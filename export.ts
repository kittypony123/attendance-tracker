import { AttendanceLog, Site } from '@shared/schema';
import { format } from 'date-fns';

/**
 * Generate CSV content from attendance logs
 */
export function generateCSV(logs: AttendanceLog[], sites: Site[]): string {
  // CSV header
  const header = [
    'Date',
    'Person ID',
    'Name',
    'Type',
    'Site',
    'Status',
    'Timestamp'
  ].join(',');
  
  // Format each log as a CSV row
  const rows = logs.map(log => {
    const site = sites.find(s => s.id === log.siteId)?.name || log.siteId;
    const date = log.attendanceDate;
    const timestamp = log.timestamp ? new Date(log.timestamp).toISOString() : '';
    
    return [
      date,
      log.personId,
      `"${log.personName}"`, // Wrap in quotes to handle names with commas
      log.personType,
      `"${site}"`, // Wrap in quotes to handle site names with commas
      log.status,
      timestamp
    ].join(',');
  });
  
  // Combine header and rows
  return [header, ...rows].join('\n');
}

/**
 * Generate JSON content from attendance logs
 */
export function generateJSON(logs: AttendanceLog[], sites: Site[]): string {
  const formattedLogs = logs.map(log => {
    const site = sites.find(s => s.id === log.siteId)?.name || log.siteId;
    return {
      date: log.attendanceDate,
      personId: log.personId,
      name: log.personName,
      type: log.personType,
      site,
      status: log.status,
      timestamp: log.timestamp
    };
  });
  
  return JSON.stringify(formattedLogs, null, 2);
}

/**
 * Generate summary statistics from attendance logs
 */
export function generateSummaryStats(logs: AttendanceLog[], sites: Site[]) {
  // Calculate overall attendance rate
  const totalLogs = logs.length;
  const presentCount = logs.filter(log => log.status === 'Present').length;
  const absentCount = logs.filter(log => log.status === 'Absent').length;
  const attendanceRate = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0;
  
  // Calculate attendance by site
  const siteStats = sites.map(site => {
    const siteLogs = logs.filter(log => log.siteId === site.id);
    const siteTotal = siteLogs.length;
    const sitePresent = siteLogs.filter(log => log.status === 'Present').length;
    const siteRate = siteTotal > 0 ? Math.round((sitePresent / siteTotal) * 100) : 0;
    
    return {
      name: site.name,
      total: siteTotal,
      present: sitePresent,
      absent: siteTotal - sitePresent,
      rate: siteRate
    };
  });
  
  // Calculate attendance by person type
  const typeStats = logs.reduce((acc, log) => {
    if (!acc[log.personType]) {
      acc[log.personType] = { type: log.personType, total: 0, present: 0, absent: 0 };
    }
    
    acc[log.personType].total++;
    if (log.status === 'Present') {
      acc[log.personType].present++;
    } else {
      acc[log.personType].absent++;
    }
    
    return acc;
  }, {} as Record<string, { type: string; total: number; present: number; absent: number }>);
  
  // Calculate attendance by date
  const dateStats = logs.reduce((acc, log) => {
    if (!acc[log.attendanceDate]) {
      acc[log.attendanceDate] = { date: log.attendanceDate, total: 0, present: 0, absent: 0 };
    }
    
    acc[log.attendanceDate].total++;
    if (log.status === 'Present') {
      acc[log.attendanceDate].present++;
    } else {
      acc[log.attendanceDate].absent++;
    }
    
    return acc;
  }, {} as Record<string, { date: string; total: number; present: number; absent: number }>);
  
  return {
    overall: {
      total: totalLogs,
      present: presentCount,
      absent: absentCount,
      rate: attendanceRate
    },
    bySite: Object.values(siteStats),
    byType: Object.values(typeStats),
    byDate: Object.values(dateStats).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  };
}

/**
 * Filter logs based on query parameters
 */
export function filterLogs(
  logs: AttendanceLog[], 
  startDate?: string, 
  endDate?: string, 
  siteIds?: string[], 
  personTypes?: string[]
): AttendanceLog[] {
  return logs.filter(log => {
    // Filter by date range
    if (startDate && log.attendanceDate < startDate) return false;
    if (endDate && log.attendanceDate > endDate) return false;
    
    // Filter by site
    if (siteIds && siteIds.length > 0 && !siteIds.includes('all')) {
      if (!siteIds.includes(log.siteId)) return false;
    }
    
    // Filter by person type
    if (personTypes && personTypes.length > 0) {
      if (!personTypes.includes(log.personType)) return false;
    }
    
    return true;
  });
}

