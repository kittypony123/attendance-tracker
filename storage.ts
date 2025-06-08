import { 
  sites, 
  people, 
  registeredAttendees, 
  attendanceLog,
  type Site, 
  type Person, 
  type RegisteredAttendee, 
  type AttendanceLog,
  type InsertSite,
  type InsertPerson,
  type InsertRegisteredAttendee,
  type InsertAttendanceLog
} from "@shared/schema";

export interface IStorage {
  // Sites
  getSites(): Promise<Site[]>;
  getSiteById(id: string): Promise<Site | undefined>;
  createSite(site: InsertSite): Promise<Site>;
  
  // People
  getAllPeople(): Promise<Person[]>;
  getPersonById(id: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  
  // Registered Attendees
  getRegisteredAttendeesBySessionId(sessionId: string): Promise<RegisteredAttendee[]>;
  getRegisteredAttendeesBySiteAndDate(siteId: string, date: string): Promise<RegisteredAttendee[]>;
  updateRegisteredAttendeesForSession(sessionId: string, siteId: string, attendees: InsertRegisteredAttendee[]): Promise<void>;
  updateRegisteredAttendeesForSiteAndDate(siteId: string, date: string, attendees: InsertRegisteredAttendee[]): Promise<void>;
  
  // Attendance Log
  createAttendanceLog(log: InsertAttendanceLog): Promise<AttendanceLog>;
  getAttendanceLogsByDateAndSession(date: string, sessionId: string): Promise<AttendanceLog[]>;
  getAllAttendanceLogs(): Promise<AttendanceLog[]>;
}

export class MemStorage implements IStorage {
  private sites: Map<string, Site>;
  private people: Map<string, Person>;
  private registeredAttendees: RegisteredAttendee[];
  private attendanceLogs: AttendanceLog[];
  private currentId: number;

  constructor() {
    this.sites = new Map();
    this.people = new Map();
    this.registeredAttendees = [];
    this.attendanceLogs = [];
    this.currentId = 1;
    
    // Initialize with CSV data
    this.initializeData();
  }

  private initializeData() {
    // Initialize sites from Sites.csv
    const sitesData = [
      { id: "site001", name: "City Central Library", sessionName: "Wednesday Reading Group", sessionId: "s001_wed" },
      { id: "site002", name: "Northside Community Hub", sessionName: "Saturday Tech Workshop", sessionId: "s002_sat" },
      { id: "site003", name: "Elm Street Park Pavilion", sessionName: "Friday Morning Art Class", sessionId: "s003_fri" }
    ];

    sitesData.forEach(site => {
      this.sites.set(site.id, site);
    });

    // Initialize people from Master_People_List.csv
    const peopleData = [
      { id: "v001", fullName: "Alice Wonderland", type: "Volunteer" },
      { id: "v002", fullName: "Bob The Builder", type: "Volunteer" },
      { id: "v003", fullName: "Charles Xavier", type: "Volunteer" },
      { id: "p001", fullName: "Diana Prince", type: "Participant" },
      { id: "p002", fullName: "Edward Scissorhands", type: "Participant" },
      { id: "p003", fullName: "Fiona Gallagher", type: "Participant" },
      { id: "p004", fullName: "Gregory House", type: "Participant" }
    ];

    peopleData.forEach(person => {
      this.people.set(person.id, person);
    });

    // Initialize registered attendees from Registered_Attendees.csv
    this.registeredAttendees = [
      { id: 1, siteId: "site001", sessionId: "s001_wed", date: null, personId: "v001", fullName: "Alice Wonderland", type: "Volunteer" },
      { id: 2, siteId: "site001", sessionId: "s001_wed", date: null, personId: "p001", fullName: "Diana Prince", type: "Participant" },
      { id: 3, siteId: "site001", sessionId: "s001_wed", date: null, personId: "p002", fullName: "Edward Scissorhands", type: "Participant" },
      { id: 4, siteId: "site002", sessionId: "s002_sat", date: null, personId: "v002", fullName: "Bob The Builder", type: "Volunteer" },
      { id: 5, siteId: "site002", sessionId: "s002_sat", date: null, personId: "p003", fullName: "Fiona Gallagher", type: "Participant" }
    ];
  }

  async getSites(): Promise<Site[]> {
    return Array.from(this.sites.values());
  }

  async getSiteById(id: string): Promise<Site | undefined> {
    return this.sites.get(id);
  }

  async createSite(site: InsertSite): Promise<Site> {
    this.sites.set(site.id, site);
    return site;
  }

  async getAllPeople(): Promise<Person[]> {
    return Array.from(this.people.values());
  }

  async getPersonById(id: string): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async createPerson(person: InsertPerson): Promise<Person> {
    this.people.set(person.id, person);
    return person;
  }

  async getRegisteredAttendeesBySessionId(sessionId: string): Promise<RegisteredAttendee[]> {
    return this.registeredAttendees.filter(attendee => attendee.sessionId === sessionId);
  }

  async getRegisteredAttendeesBySiteAndDate(siteId: string, date: string): Promise<RegisteredAttendee[]> {
    return this.registeredAttendees.filter(attendee => 
      attendee.siteId === siteId && attendee.date === date
    );
  }

  async updateRegisteredAttendeesForSession(sessionId: string, siteId: string, attendees: InsertRegisteredAttendee[]): Promise<void> {
    // Remove existing attendees for this session
    this.registeredAttendees = this.registeredAttendees.filter(attendee => attendee.sessionId !== sessionId);
    
    // Add new attendees
    attendees.forEach(attendee => {
      const newAttendee: RegisteredAttendee = {
        id: this.currentId++,
        siteId: attendee.siteId,
        sessionId: attendee.sessionId ?? null,
        date: attendee.date ?? null,
        personId: attendee.personId,
        fullName: attendee.fullName,
        type: attendee.type
      };
      this.registeredAttendees.push(newAttendee);
    });
  }

  async updateRegisteredAttendeesForSiteAndDate(siteId: string, date: string, attendees: InsertRegisteredAttendee[]): Promise<void> {
    // Remove existing attendees for this site and date
    this.registeredAttendees = this.registeredAttendees.filter(attendee => 
      !(attendee.siteId === siteId && attendee.date === date)
    );
    
    // Add new attendees
    attendees.forEach(attendee => {
      const newAttendee: RegisteredAttendee = {
        id: this.currentId++,
        siteId: attendee.siteId,
        sessionId: attendee.sessionId ?? null,
        date: attendee.date ?? null,
        personId: attendee.personId,
        fullName: attendee.fullName,
        type: attendee.type
      };
      this.registeredAttendees.push(newAttendee);
    });
  }

  async createAttendanceLog(log: InsertAttendanceLog): Promise<AttendanceLog> {
    const attendanceEntry: AttendanceLog = {
      id: log.id,
      timestamp: new Date(),
      siteId: log.siteId,
      sessionId: log.sessionId ?? null,
      sessionName: log.sessionName ?? null,
      attendanceDate: log.attendanceDate,
      personId: log.personId,
      personName: log.personName,
      personType: log.personType,
      status: log.status
    };
    this.attendanceLogs.push(attendanceEntry);
    return attendanceEntry;
  }

  async getAttendanceLogsByDateAndSession(date: string, sessionId: string): Promise<AttendanceLog[]> {
    return this.attendanceLogs.filter(log => 
      log.attendanceDate === date && log.sessionId === sessionId
    );
  }

  async getAllAttendanceLogs(): Promise<AttendanceLog[]> {
    return [...this.attendanceLogs];
  }
}

export const storage = new MemStorage();
