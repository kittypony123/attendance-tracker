import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DateRange, getDateRange, DateRangePreset } from '@/lib/dateUtils';

type ChartType = 'trend' | 'pie' | 'site' | 'type' | 'heatmap' | 'topAttendees';

interface DashboardPreferences {
  dateRangePreset: DateRangePreset;
  customDateRange: DateRange | null;
  selectedSiteIds: string[];
  visibleCharts: ChartType[];
  comparisonEnabled: boolean;
}

interface DashboardContextType {
  preferences: DashboardPreferences;
  dateRange: DateRange;
  updateDateRangePreset: (preset: DateRangePreset) => void;
  updateCustomDateRange: (range: DateRange) => void;
  updateSelectedSiteIds: (siteIds: string[]) => void;
  toggleChartVisibility: (chartType: ChartType) => void;
  toggleComparison: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: DashboardPreferences = {
  dateRangePreset: 'last30days',
  customDateRange: null,
  selectedSiteIds: ['all'],
  visibleCharts: ['trend', 'pie', 'site', 'type', 'topAttendees'],
  comparisonEnabled: false,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    // Try to load preferences from localStorage
    const savedPreferences = typeof window !== 'undefined' 
      ? localStorage.getItem('dashboardPreferences')
      : null;
    
    return savedPreferences 
      ? JSON.parse(savedPreferences) 
      : defaultPreferences;
  });
  
  // Calculate the current date range based on preferences
  const dateRange = preferences.dateRangePreset === 'custom' && preferences.customDateRange
    ? preferences.customDateRange
    : getDateRange(preferences.dateRangePreset);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);
  
  const updateDateRangePreset = (preset: DateRangePreset) => {
    setPreferences(prev => ({
      ...prev,
      dateRangePreset: preset,
    }));
  };
  
  const updateCustomDateRange = (range: DateRange) => {
    setPreferences(prev => ({
      ...prev,
      dateRangePreset: 'custom',
      customDateRange: range,
    }));
  };
  
  const updateSelectedSiteIds = (siteIds: string[]) => {
    setPreferences(prev => ({
      ...prev,
      selectedSiteIds: siteIds,
    }));
  };
  
  const toggleChartVisibility = (chartType: ChartType) => {
    setPreferences(prev => {
      const isVisible = prev.visibleCharts.includes(chartType);
      const visibleCharts = isVisible
        ? prev.visibleCharts.filter(type => type !== chartType)
        : [...prev.visibleCharts, chartType];
      
      return {
        ...prev,
        visibleCharts,
      };
    });
  };
  
  const toggleComparison = () => {
    setPreferences(prev => ({
      ...prev,
      comparisonEnabled: !prev.comparisonEnabled,
    }));
  };
  
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };
  
  return (
    <DashboardContext.Provider
      value={{
        preferences,
        dateRange,
        updateDateRangePreset,
        updateCustomDateRange,
        updateSelectedSiteIds,
        toggleChartVisibility,
        toggleComparison,
        resetPreferences,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

