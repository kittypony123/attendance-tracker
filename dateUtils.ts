import { format, subDays, subWeeks, subMonths, subYears, parseISO, isAfter, isBefore, isEqual, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export type DateRange = {
  start: Date;
  end: Date;
  label: string;
};

export type DateRangePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';

export const getDateRange = (preset: DateRangePreset, customStart?: Date, customEnd?: Date): DateRange => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  switch (preset) {
    case 'today':
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return {
        start: todayStart,
        end: today,
        label: 'Today'
      };
    case 'yesterday':
      const yesterday = subDays(today, 1);
      const yesterdayStart = new Date(yesterday);
      yesterdayStart.setHours(0, 0, 0, 0);
      yesterday.setHours(23, 59, 59, 999);
      return {
        start: yesterdayStart,
        end: yesterday,
        label: 'Yesterday'
      };
    case 'last7days':
      return {
        start: subDays(today, 6),
        end: today,
        label: 'Last 7 Days'
      };
    case 'last30days':
      return {
        start: subDays(today, 29),
        end: today,
        label: 'Last 30 Days'
      };
    case 'thisWeek':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: today,
        label: 'This Week'
      };
    case 'lastWeek':
      const lastWeekEnd = subDays(startOfWeek(today, { weekStartsOn: 1 }), 1);
      const lastWeekStart = startOfWeek(lastWeekEnd, { weekStartsOn: 1 });
      return {
        start: lastWeekStart,
        end: lastWeekEnd,
        label: 'Last Week'
      };
    case 'thisMonth':
      return {
        start: startOfMonth(today),
        end: today,
        label: 'This Month'
      };
    case 'lastMonth':
      const lastMonthEnd = subDays(startOfMonth(today), 1);
      const lastMonthStart = startOfMonth(lastMonthEnd);
      return {
        start: lastMonthStart,
        end: lastMonthEnd,
        label: 'Last Month'
      };
    case 'thisYear':
      return {
        start: startOfYear(today),
        end: today,
        label: 'This Year'
      };
    case 'lastYear':
      const lastYearEnd = subDays(startOfYear(today), 1);
      const lastYearStart = startOfYear(lastYearEnd);
      return {
        start: lastYearStart,
        end: lastYearEnd,
        label: 'Last Year'
      };
    case 'custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom date range requires start and end dates');
      }
      return {
        start: customStart,
        end: customEnd,
        label: 'Custom Range'
      };
    default:
      return {
        start: subDays(today, 29),
        end: today,
        label: 'Last 30 Days'
      };
  }
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDateForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

export const isDateInRange = (date: Date | string, range: DateRange): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return (isAfter(dateObj, range.start) || isEqual(dateObj, range.start)) && 
         (isBefore(dateObj, range.end) || isEqual(dateObj, range.end));
};

export const getPreviousPeriod = (range: DateRange): DateRange => {
  const duration = range.end.getTime() - range.start.getTime();
  const previousStart = new Date(range.start.getTime() - duration);
  const previousEnd = new Date(range.end.getTime() - duration);
  
  return {
    start: previousStart,
    end: previousEnd,
    label: `Previous ${range.label}`
  };
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getDayOfWeek = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.getDay();
};

export const getMonthName = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM');
};

export const getDaysArray = (start: Date, end: Date): Date[] => {
  const arr = [];
  const dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

