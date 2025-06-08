import fs from 'fs';
import path from 'path';
import { Storage } from './storage';

// Initialize storage
const storage = new Storage();

// Function to import sites
async function importSites() {
  try {
    const sitesPath = path.join(__dirname, '../dummy_data/sites.csv');
    const sitesData = fs.readFileSync(sitesPath, 'utf8');
    const lines = sitesData.split('\n');
    
    // Skip header
    const header = lines[0].split(',');
    const siteIdIndex = header.indexOf('Site ID');
    const siteNameIndex = header.indexOf('Site Name');
    const sessionNameIndex = header.indexOf('Session Name');
    const sessionIdIndex = header.indexOf('Session ID');
    
    const sites = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      
      const site = {
        id: values[siteIdIndex],
        name: values[siteNameIndex],
        sessionName: values[sessionNameIndex],
        sessionId: values[sessionIdIndex]
      };
      
      sites.push(site);
    }
    
    // Store sites
    await storage.setSites(sites);
    console.log(`Imported ${sites.length} sites`);
    
    return sites;
  } catch (error) {
    console.error('Error importing sites:', error);
    return [];
  }
}

// Function to import people
async function importPeople() {
  try {
    const peoplePath = path.join(__dirname, '../dummy_data/people.csv');
    const peopleData = fs.readFileSync(peoplePath, 'utf8');
    const lines = peopleData.split('\n');
    
    // Skip header
    const header = lines[0].split(',');
    const personIdIndex = header.indexOf('Person ID');
    const fullNameIndex = header.indexOf('Full Name');
    const typeIndex = header.indexOf('Type');
    
    const people = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      
      const person = {
        id: values[personIdIndex],
        name: values[fullNameIndex],
        type: values[typeIndex]
      };
      
      people.push(person);
    }
    
    // Store people
    await storage.setPeople(people);
    console.log(`Imported ${people.length} people`);
    
    return people;
  } catch (error) {
    console.error('Error importing people:', error);
    return [];
  }
}

// Function to import registered attendees
async function importRegisteredAttendees() {
  try {
    const registeredPath = path.join(__dirname, '../dummy_data/registered_attendees.csv');
    const registeredData = fs.readFileSync(registeredPath, 'utf8');
    const lines = registeredData.split('\n');
    
    // Skip header
    const header = lines[0].split(',');
    const siteIdIndex = header.indexOf('Site ID');
    const sessionIdIndex = header.indexOf('Session ID');
    const personIdIndex = header.indexOf('Person ID');
    const fullNameIndex = header.indexOf('Full Name');
    const typeIndex = header.indexOf('Type');
    
    const registrations = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      
      const registration = {
        siteId: values[siteIdIndex],
        sessionId: values[sessionIdIndex],
        personId: values[personIdIndex],
        personName: values[fullNameIndex],
        personType: values[typeIndex]
      };
      
      registrations.push(registration);
    }
    
    // Store registrations
    await storage.setRegistrations(registrations);
    console.log(`Imported ${registrations.length} registrations`);
    
    return registrations;
  } catch (error) {
    console.error('Error importing registrations:', error);
    return [];
  }
}

// Function to import attendance logs
async function importAttendanceLogs() {
  try {
    const logsPath = path.join(__dirname, '../dummy_data/attendance_logs.json');
    const logsData = fs.readFileSync(logsPath, 'utf8');
    const logs = JSON.parse(logsData);
    
    // Store logs
    await storage.setAttendanceLogs(logs);
    console.log(`Imported ${logs.length} attendance logs`);
    
    return logs;
  } catch (error) {
    console.error('Error importing attendance logs:', error);
    return [];
  }
}

// Main import function
export async function importDummyData() {
  console.log('Starting import of dummy data...');
  
  await importSites();
  await importPeople();
  await importRegisteredAttendees();
  await importAttendanceLogs();
  
  console.log('Dummy data import completed');
}

// Run import if this file is executed directly
if (require.main === module) {
  importDummyData()
    .then(() => console.log('Import completed successfully'))
    .catch(error => console.error('Import failed:', error));
}

