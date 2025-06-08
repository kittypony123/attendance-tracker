import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sessionName: text("session_name").notNull(),
  sessionId: text("session_id").notNull(),
});

export const people = pgTable("people", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  type: text("type").notNull(), // 'Volunteer' or 'Participant'
});

export const registeredAttendees = pgTable("registered_attendees", {
  id: serial("id").primaryKey(),
  siteId: text("site_id").notNull(),
  sessionId: text("session_id"), // Optional for backward compatibility
  date: text("date"), // New field for date-based registrations
  personId: text("person_id").notNull(),
  fullName: text("full_name").notNull(),
  type: text("type").notNull(),
});

export const attendanceLog = pgTable("attendance_log", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  siteId: text("site_id").notNull(),
  sessionId: text("session_id"), // Optional for backward compatibility
  sessionName: text("session_name"), // Optional for backward compatibility
  attendanceDate: text("attendance_date").notNull(),
  personId: text("person_id").notNull(),
  personName: text("person_name").notNull(),
  personType: text("person_type").notNull(),
  status: text("status").notNull(), // 'Present' or 'Absent'
});

export const insertSiteSchema = createInsertSchema(sites);
export const insertPersonSchema = createInsertSchema(people);
export const insertRegisteredAttendeeSchema = createInsertSchema(registeredAttendees).omit({ id: true });
export const insertAttendanceLogSchema = createInsertSchema(attendanceLog);

export type Site = typeof sites.$inferSelect;
export type Person = typeof people.$inferSelect;
export type RegisteredAttendee = typeof registeredAttendees.$inferSelect;
export type AttendanceLog = typeof attendanceLog.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type InsertRegisteredAttendee = z.infer<typeof insertRegisteredAttendeeSchema>;
export type InsertAttendanceLog = z.infer<typeof insertAttendanceLogSchema>;
