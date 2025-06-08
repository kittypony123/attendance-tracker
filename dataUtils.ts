import { parseISO } from 'date-fns';
import { DateRange, formatDate, isDateInRange } from './dateUtils';

export interface AttendanceLog {
  id: string;
  timestamp: string;
  siteId: string;
  sessionId: string | null;
  sessionName: string | null;
  attendanceDate: string;
  personId: string;
  personName: string;
  personType: string;
  status: string;
}

export interface Site {
  id: string;
  name: string;
}

export interface AttendanceMetrics {
  totalAttendees: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

export interface TrendData {
  date: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
}

export interface SiteAttendance {
  site: string;
  siteId: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
}

export interface TypeAttendance {
  type: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
}

export interface AttendeeStats {
  id: string;
  name: string;
  type: string;
  totalSessions: number;
  presentSessions: number;
  attendanceRate: number;
  streak: number;
}

export interface ComparisonMetrics {
  currentPeriod: AttendanceMetrics;
  previousPeriod: AttendanceMetrics;
  changePercentage: {
    totalAttendees: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
  };
}

export interface HeatmapData {
  dayOfWeek: number;
  hour: number;
  value: number;
}

// Filter logs based on date range and site selection
export const filterLogs = (
  logs: AttendanceLog[], 
  dateRange: DateRange, 
  selectedSiteIds: string[]
): AttendanceLog[] => {
  return logs.filter(log => {
    const logDate = parseISO(log.attendanceDate);
    const isWithinDateRange = isDateInRange(logDate, dateRange);
    const isSelectedSite = selectedSiteIds.includes('all') || selectedSiteIds.includes(log.siteId);
    return isWithinDateRange && isSelectedSite;
  });
};

// Calculate basic attendance metrics
export const calculateMetrics = (logs: AttendanceLog[]): AttendanceMetrics => {
  const totalAttendees = new Set(logs.map(log => log.personId)).size;
  const presentCount = logs.filter(log => log.status === 'Present').length;
  const absentCount = logs.filter(log => log.status === 'Absent').length;
  const attendanceRate = totalAttendees > 0 ? Math.round((presentCount / (presentCount + absentCount)) * 100) : 0;
  
  return {
    totalAttendees,
    presentCount,
    absentCount,
    attendanceRate
  };
};

// Calculate comparison metrics between current and previous periods
export const calculateComparisonMetrics = (
  currentLogs: AttendanceLog[], 
  previousLogs: AttendanceLog[]
): ComparisonMetrics => {
  const current = calculateMetrics(currentLogs);
  const previous = calculateMetrics(previousLogs);
  
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  return {
    currentPeriod: current,
    previousPeriod: previous,
    changePercentage: {
      totalAttendees: calculateChange(current.totalAttendees, previous.totalAttendees),
      presentCount: calculateChange(current.presentCount, previous.presentCount),
      absentCount: calculateChange(current.absentCount, previous.absentCount),
      attendanceRate: calculateChange(current.attendanceRate, previous.attendanceRate)
    }
  };
};

// Prepare data for trend charts
export const prepareTrendData = (logs: AttendanceLog[]): TrendData[] => {
  const attendanceByDate = logs.reduce((acc, log) => {
    const date = log.attendanceDate;
    if (!acc[date]) {
      acc[date] = { date, present: 0, absent: 0, total: 0, rate: 0 };
    }
    if (log.status === 'Present') {
      acc[date].present++;
    } else {
      acc[date].absent++;
    }
    acc[date].total = acc[date].present + acc[date].absent;
    acc[date].rate = Math.round((acc[date].present / acc[date].total) * 100);
    return acc;
  }, {} as Record<string, TrendData>);

  return Object.values(attendanceByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Prepare data for site attendance charts
export const prepareSiteData = (logs: AttendanceLog[], sites: Site[]): SiteAttendance[] => {
  const attendanceBySite = logs.reduce((acc, log) => {
    const siteName = sites.find(s => s.id === log.siteId)?.name || log.siteId;
    if (!acc[log.siteId]) {
      acc[log.siteId] = { 
        site: siteName, 
        siteId: log.siteId,
        present: 0, 
        absent: 0,
        total: 0,
        rate: 0
      };
    }
    if (log.status === 'Present') {
      acc[log.siteId].present++;
    } else {
      acc[log.siteId].absent++;
    }
    acc[log.siteId].total = acc[log.siteId].present + acc[log.siteId].absent;
    acc[log.siteId].rate = Math.round((acc[log.siteId].present / acc[log.siteId].total) * 100);
    return acc;
  }, {} as Record<string, SiteAttendance>);

  return Object.values(attendanceBySite);
};

// Prepare data for person type attendance charts
export const prepareTypeData = (logs: AttendanceLog[]): TypeAttendance[] => {
  const attendanceByType = logs.reduce((acc, log) => {
    if (!acc[log.personType]) {
      acc[log.personType] = { 
        type: log.personType, 
        present: 0, 
        absent: 0,
        total: 0,
        rate: 0
      };
    }
    if (log.status === 'Present') {
      acc[log.personType].present++;
    } else {
      acc[log.personType].absent++;
    }
    acc[log.personType].total = acc[log.personType].present + acc[log.personType].absent;
    acc[log.personType].rate = Math.round((acc[log.personType].present / acc[log.personType].total) * 100);
    return acc;
  }, {} as Record<string, TypeAttendance>);

  return Object.values(attendanceByType);
};

// Calculate attendee statistics
export const calculateAttendeeStats = (logs: AttendanceLog[]): AttendeeStats[] => {
  // Group logs by person
  const attendeeLogsMap = logs.reduce((acc, log) => {
    if (!acc[log.personId]) {
      acc[log.personId] = [];
    }
    acc[log.personId].push(log);
    return acc;
  }, {} as Record<string, AttendanceLog[]>);
  
  // Calculate stats for each attendee
  const attendeeStats = Object.entries(attendeeLogsMap).map(([personId, personLogs]) => {
    const sortedLogs = [...personLogs].sort((a, b) => 
      new Date(a.attendanceDate).getTime() - new Date(b.attendanceDate).getTime()
    );
    
    // Calculate current streak
    let streak = 0;
    for (let i = sortedLogs.length - 1; i >= 0; i--) {
      if (sortedLogs[i].status === 'Present') {
        streak++;
      } else {
        break;
      }
    }
    
    const totalSessions = personLogs.length;
    const presentSessions = personLogs.filter(log => log.status === 'Present').length;
    const attendanceRate = Math.round((presentSessions / totalSessions) * 100);
    
    return {
      id: personId,
      name: personLogs[0].personName,
      type: personLogs[0].personType,
      totalSessions,
      presentSessions,
      attendanceRate,
      streak
    };
  });
  
  return attendeeStats.sort((a, b) => b.attendanceRate - a.attendanceRate);
};

// Prepare data for heatmap visualization
export const prepareHeatmapData = (logs: AttendanceLog[]): HeatmapData[] => {
  const heatmapData: HeatmapData[] = [];
  
  // Initialize the heatmap data structure (7 days x 24 hours)
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      heatmapData.push({
        dayOfWeek: day,
        hour,
        value: 0
      });
    }
  }
  
  // Count attendance for each day and hour
  logs.forEach(log => {
    if (log.status === 'Present') {
      const date = parseISO(log.attendanceDate);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      
      const index = dayOfWeek * 24 + hour;
      if (index >= 0 && index < heatmapData.length) {
        heatmapData[index].value++;
      }
    }
  });
  
  return heatmapData;
};

