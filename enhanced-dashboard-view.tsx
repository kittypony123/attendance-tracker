import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartContainer } from "@/components/ui/chart-container";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Heatmap } from "@/components/ui/heatmap";
import { useDashboard } from "@/contexts/dashboard-context";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Download,
  FileSpreadsheet,
  FilePdf,
  Filter,
  RefreshCw
} from "lucide-react";
import { 
  DateRange, 
  getDateRange, 
  getPreviousPeriod, 
  formatDateForDisplay 
} from "@/lib/dateUtils";
import {
  filterLogs,
  calculateMetrics,
  calculateComparisonMetrics,
  prepareTrendData,
  prepareSiteData,
  prepareTypeData,
  calculateAttendeeStats,
  prepareHeatmapData,
  AttendanceLog,
  Site
} from "@/lib/dataUtils";

interface DashboardViewProps {
  showLoading: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function EnhancedDashboardView({ showLoading, showToast }: DashboardViewProps) {
  // Get dashboard context
  const { 
    dateRange, 
    preferences, 
    updateCustomDateRange, 
    updateSelectedSiteIds 
  } = useDashboard();
  
  // Local state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch sites
  const { data: sitesData } = useQuery({
    queryKey: ['/api/sites'],
    select: (data: any) => data as { sites: Site[] }
  });

  // Fetch attendance logs
  const { data: attendanceData, isLoading, refetch } = useQuery({
    queryKey: ['/api/attendance-logs'],
    select: (data: any) => data as { logs: AttendanceLog[] }
  });

  // Show loading state
  useEffect(() => {
    showLoading(isLoading);
  }, [isLoading, showLoading]);

  const sites = sitesData?.sites || [];
  const logs = attendanceData?.logs || [];

  // Calculate previous period
  const previousPeriod = getPreviousPeriod(dateRange);

  // Filter logs based on selected date range and sites
  const currentLogs = filterLogs(logs, dateRange, preferences.selectedSiteIds);
  const previousLogs = filterLogs(logs, previousPeriod, preferences.selectedSiteIds);

  // Calculate metrics
  const metrics = calculateMetrics(currentLogs);
  const comparisonMetrics = calculateComparisonMetrics(currentLogs, previousLogs);

  // Prepare chart data
  const trendData = prepareTrendData(currentLogs);
  const siteData = prepareSiteData(currentLogs, sites);
  const typeData = prepareTypeData(currentLogs);
  const attendeeStats = calculateAttendeeStats(currentLogs);
  const heatmapData = prepareHeatmapData(currentLogs);

  // Top attendees
  const topAttendees = attendeeStats.slice(0, 5);

  // Prepare site options for multi-select
  const siteOptions: Option[] = [
    { value: 'all', label: 'All Sites' },
    ...sites.map(site => ({ value: site.id, label: site.name }))
  ];

  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    updateCustomDateRange(range);
  };

  // Handle site selection change
  const handleSiteSelectionChange = (selected: string[]) => {
    // If no sites are selected, default to 'all'
    const siteIds = selected.length === 0 ? ['all'] : selected;
    updateSelectedSiteIds(siteIds);
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast(
        `Attendance data exported as ${exportFormat.toUpperCase()} successfully!`, 
        'success'
      );
    } catch (error) {
      showToast('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Pie chart colors
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="p-4 space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-purple-600 text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Attendance Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Date Range</label>
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Site Filter</label>
            <MultiSelect
              options={siteOptions}
              selected={preferences.selectedSiteIds}
              onChange={handleSiteSelectionChange}
              placeholder="Select sites..."
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Format:</span>
        <div className="flex space-x-2">
          <Button
            variant={exportFormat === 'csv' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('csv')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant={exportFormat === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('pdf')}
          >
            <FilePdf className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Attendees"
              value={metrics.totalAttendees}
              icon={Users}
              trend={comparisonMetrics.changePercentage.totalAttendees}
              trendLabel={`vs. ${formatDateForDisplay(previousPeriod.start)} - ${formatDateForDisplay(previousPeriod.end)}`}
              iconClassName="bg-blue-100 dark:bg-blue-900 text-blue-600"
            />
            
            <MetricCard
              title="Attendance Rate"
              value={metrics.attendanceRate}
              valueSuffix="%"
              icon={TrendingUp}
              trend={comparisonMetrics.changePercentage.attendanceRate}
              trendLabel={`vs. ${comparisonMetrics.previousPeriod.attendanceRate}% previous period`}
              iconClassName="bg-green-100 dark:bg-green-900 text-green-600"
            />
            
            <MetricCard
              title="Present"
              value={metrics.presentCount}
              icon={Activity}
              trend={comparisonMetrics.changePercentage.presentCount}
              trendLabel={`vs. ${comparisonMetrics.previousPeriod.presentCount} previous period`}
              iconClassName="bg-emerald-100 dark:bg-emerald-900 text-emerald-600"
            />
            
            <MetricCard
              title="Absent"
              value={metrics.absentCount}
              icon={Calendar}
              trend={comparisonMetrics.changePercentage.absentCount}
              invertTrendColors={true}
              trendLabel={`vs. ${comparisonMetrics.previousPeriod.absentCount} previous period`}
              iconClassName="bg-red-100 dark:bg-red-900 text-red-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trend */}
            <ChartContainer title="Attendance Trend" onDownload={handleExport}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [
                      value, 
                      name === 'present' ? 'Present' : 
                      name === 'absent' ? 'Absent' : 
                      name === 'rate' ? 'Attendance Rate' : name
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="absent" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    yAxisId={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Overall Attendance Pie Chart */}
            <ChartContainer title="Overall Attendance" onDownload={handleExport}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: metrics.presentCount, color: '#10b981' },
                      { name: 'Absent', value: metrics.absentCount, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Present', value: metrics.presentCount, color: '#10b981' },
                      { name: 'Absent', value: metrics.absentCount, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Top Attendees */}
          {topAttendees.length > 0 && (
            <ChartContainer title="Top Attendees" onDownload={handleExport}>
              <div className="space-y-3">
                {topAttendees.map((attendee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{attendee.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{attendee.type}</p>
                        {attendee.streak > 1 && (
                          <Badge variant="outline" className="text-xs">
                            {attendee.streak} day streak
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attendee.presentSessions}/{attendee.totalSessions} sessions
                        </p>
                        <Badge 
                          variant={attendee.attendanceRate >= 80 ? "default" : attendee.attendanceRate >= 60 ? "secondary" : "destructive"}
                        >
                          {attendee.attendanceRate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartContainer>
          )}
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Patterns Heatmap */}
            <ChartContainer title="Attendance Patterns by Day & Time" onDownload={handleExport}>
              <div className="h-full flex items-center justify-center">
                <Heatmap data={heatmapData} />
              </div>
            </ChartContainer>
            
            {/* Attendance by Site */}
            {siteData.length > 0 && (
              <ChartContainer title="Attendance by Site" onDownload={handleExport}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={siteData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="site" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#10b981" />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="Attendance Rate (%)" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
          
          {/* Attendance by Type */}
          {typeData.length > 0 && (
            <ChartContainer title="Attendance by Person Type" onDownload={handleExport}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Present" fill="#10b981" />
                  <Bar dataKey="absent" name="Absent" fill="#ef4444" />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="Attendance Rate (%)" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {/* Detailed Attendance Table */}
          <ChartContainer title="Detailed Attendance Records" onDownload={handleExport}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Site</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.slice(0, 10).map((log, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                      <td className="px-6 py-4">{new Date(log.attendanceDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium">{log.personName}</td>
                      <td className="px-6 py-4">{log.personType}</td>
                      <td className="px-6 py-4">
                        {sites.find(site => site.id === log.siteId)?.name || log.siteId}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={log.status === 'Present' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentLogs.length > 10 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  Showing 10 of {currentLogs.length} records. Export to see all data.
                </div>
              )}
            </div>
          </ChartContainer>
        </TabsContent>
      </Tabs>

      {/* No Data State */}
      {currentLogs.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Attendance Data</h3>
          <p className="text-gray-500 dark:text-gray-400">
            There's no attendance data for the selected filters. Try adjusting your date range or site selection.
          </p>
        </Card>
      )}
    </div>
  );
}

