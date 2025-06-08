import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRegisteredAttendeeSchema, insertAttendanceLogSchema } from "@shared/schema";
import { generateCSV, generateJSON, generateSummaryStats, filterLogs } from "./export";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all sites with session info
  app.get("/api/sites", async (req, res) => {
    try {
      const sites = await storage.getSites();
      const sitesData = sites.map(site => ({
        id: site.id,
        name: site.name
      }));
      
      const siteSessionInfo = sites.reduce((acc, site) => {
        acc[site.id] = {
          sessionId: site.sessionId,
          sessionName: site.sessionName
        };
        return acc;
      }, {} as Record<string, { sessionId: string; sessionName: string }>);

      res.json({ sites: sitesData, siteSessionInfo });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sites" });
    }
  });

  // Get all people (master list)
  app.get("/api/people", async (req, res) => {
    try {
      const people = await storage.getAllPeople();
      res.json({ allPeople: people });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch people" });
    }
  });

  // Get registered attendees for a session
  app.get("/api/registered-attendees/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const attendees = await storage.getRegisteredAttendeesBySessionId(sessionId);
      
      const volunteers = attendees.filter(a => a.type.toLowerCase() === 'volunteer')
        .map(a => ({ id: a.personId, name: a.fullName, type: a.type }));
      const participants = attendees.filter(a => a.type.toLowerCase() === 'participant')
        .map(a => ({ id: a.personId, name: a.fullName, type: a.type }));

      res.json({ volunteers, participants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registered attendees" });
    }
  });

  // Get registered attendees by site and date
  app.get("/api/registered-attendees/site/:siteId/date/:date", async (req, res) => {
    try {
      const { siteId, date } = req.params;
      const attendees = await storage.getRegisteredAttendeesBySiteAndDate(siteId, date);
      
      const volunteers = attendees.filter(a => a.type.toLowerCase() === 'volunteer')
        .map(a => ({ id: a.personId, name: a.fullName, type: a.type }));
      const participants = attendees.filter(a => a.type.toLowerCase() === 'participant')
        .map(a => ({ id: a.personId, name: a.fullName, type: a.type }));

      res.json({ volunteers, participants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registered attendees" });
    }
  });

  // Update registered attendees for a site and date
  app.post("/api/registered-attendees", async (req, res) => {
    try {
      const updateSchema = z.object({
        siteId: z.string(),
        date: z.string(),
        registeredVolunteers: z.array(z.object({
          id: z.string(),
          name: z.string(),
          type: z.string()
        })),
        registeredParticipants: z.array(z.object({
          id: z.string(),
          name: z.string(),
          type: z.string()
        }))
      });

      const data = updateSchema.parse(req.body);
      
      const allAttendees = [
        ...data.registeredVolunteers.map(v => ({
          siteId: data.siteId,
          sessionId: null,
          date: data.date,
          personId: v.id,
          fullName: v.name,
          type: v.type
        })),
        ...data.registeredParticipants.map(p => ({
          siteId: data.siteId,
          sessionId: null,
          date: data.date,
          personId: p.id,
          fullName: p.name,
          type: p.type
        }))
      ];

      await storage.updateRegisteredAttendeesForSiteAndDate(data.siteId, data.date, allAttendees);
      
      res.json({ success: true, message: "Registered attendees updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update registered attendees" });
      }
    }
  });

  // Save attendance records
  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceSchema = z.object({
        siteId: z.string(),
        date: z.string(),
        records: z.array(z.object({
          personId: z.string(),
          personName: z.string(),
          personType: z.string(),
          status: z.string()
        }))
      });

      const data = attendanceSchema.parse(req.body);
      
      if (data.records.length === 0) {
        return res.json({ success: true, message: "No attendance records to log" });
      }

      // Create attendance log entries
      for (const record of data.records) {
        await storage.createAttendanceLog({
          id: crypto.randomUUID(),
          siteId: data.siteId,
          sessionId: null,
          sessionName: null,
          attendanceDate: data.date,
          personId: record.personId,
          personName: record.personName,
          personType: record.personType,
          status: record.status
        });
      }
      
      res.json({ success: true, message: "Attendance saved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save attendance" });
      }
    }
  });

  // Get attendance logs for dashboard
  app.get("/api/attendance-logs", async (req, res) => {
    try {
      const logs = await storage.getAllAttendanceLogs();
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance logs" });
    }
  });

  // Export attendance logs as CSV
  app.get("/api/export/csv", async (req, res) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const siteIds = req.query.siteIds ? (req.query.siteIds as string).split(',') : undefined;
      const personTypes = req.query.personTypes ? (req.query.personTypes as string).split(',') : undefined;
      
      const logs = await storage.getAllAttendanceLogs();
      const sites = await storage.getSites();
      
      // Filter logs based on query parameters
      const filteredLogs = filterLogs(logs, startDate, endDate, siteIds, personTypes);
      
      // Generate CSV content
      const csvContent = generateCSV(filteredLogs, sites);
      
      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance_export.csv');
      
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export attendance data" });
    }
  });

  // Export attendance logs as JSON
  app.get("/api/export/json", async (req, res) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const siteIds = req.query.siteIds ? (req.query.siteIds as string).split(',') : undefined;
      const personTypes = req.query.personTypes ? (req.query.personTypes as string).split(',') : undefined;
      
      const logs = await storage.getAllAttendanceLogs();
      const sites = await storage.getSites();
      
      // Filter logs based on query parameters
      const filteredLogs = filterLogs(logs, startDate, endDate, siteIds, personTypes);
      
      // Generate JSON content
      const jsonContent = generateJSON(filteredLogs, sites);
      
      // Set response headers for JSON download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance_export.json');
      
      res.send(jsonContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export attendance data" });
    }
  });

  // Get attendance summary statistics
  app.get("/api/export/summary", async (req, res) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const siteIds = req.query.siteIds ? (req.query.siteIds as string).split(',') : undefined;
      const personTypes = req.query.personTypes ? (req.query.personTypes as string).split(',') : undefined;
      
      const logs = await storage.getAllAttendanceLogs();
      const sites = await storage.getSites();
      
      // Filter logs based on query parameters
      const filteredLogs = filterLogs(logs, startDate, endDate, siteIds, personTypes);
      
      // Generate summary statistics
      const summaryStats = generateSummaryStats(filteredLogs, sites);
      
      res.json(summaryStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate summary statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

