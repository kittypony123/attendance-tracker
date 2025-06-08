import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Calendar, MapPin, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface Site {
  id: string;
  name: string;
}

interface AttendanceLog {
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

interface DashboardViewProps {
  showLoading: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function DashboardView({ showLoading, showToast }: DashboardViewProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");

  // Fetch sites
  const { data: sitesData } = useQuery({
    queryKey: ['/api/sites'],
    select: (data: any) => data as { sites: Site[] }
  });

  // Fetch attendance logs
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['/api/attendance-logs'],
    select: (data: any) => data as { logs: AttendanceLog[] }
  });

  const sites = sitesData?.sites || [];
  const logs = attendanceData?.logs || [];

  // Filter data based on selections
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.attendanceDate);
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const isWithinDateRange = logDate >= cutoffDate;
    const isSelectedSite = selectedSiteId === "all" || log.siteId === selectedSiteId;

    return isWithinDateRange && isSelectedSite;
  });

  // Calculate metrics
  const totalAttendees = new Set(filteredLogs.map(log => log.personId)).size;
  const presentCount = filteredLogs.filter(log => log.status === 'Present').length;
  const absentCount = filteredLogs.filter(log => log.status === 'Absent').length;
  const attendanceRate = totalAttendees > 0 ? Math.round((presentCount / (presentCount + absentCount)) * 100) : 0;

  // Prepare chart data
  const attendanceByDate = filteredLogs.reduce((acc, log) => {
    const date = log.attendanceDate;
    if (!acc[date]) {
      acc[date] = { date, present: 0, absent: 0 };
    }
    if (log.status === 'Present') {
      acc[date].present++;
    } else {
      acc[date].absent++;
    }
    return acc;
  }, {} as Record<string, { date: string; present: number; absent: number }>);

  const dateChartData = Object.values(attendanceByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Attendance by site
  const attendanceBySite = filteredLogs.reduce((acc, log) => {
    const siteName = sites.find(s => s.id === log.siteId)?.name || log.siteId;
    if (!acc[siteName]) {
      acc[siteName] = { site: siteName, present: 0, absent: 0 };
    }
    if (log.status === 'Present') {
      acc[siteName].present++;
    } else {
      acc[siteName].absent++;
    }
    return acc;
  }, {} as Record<string, { site: string; present: number; absent: number }>);

  const siteChartData = Object.values(attendanceBySite);

  // Attendance by person type
  const attendanceByType = filteredLogs.reduce((acc, log) => {
    if (!acc[log.personType]) {
      acc[log.personType] = { type: log.personType, present: 0, absent: 0 };
    }
    if (log.status === 'Present') {
      acc[log.personType].present++;
    } else {
      acc[log.personType].absent++;
    }
    return acc;
  }, {} as Record<string, { type: string; present: number; absent: number }>);

  const typeChartData = Object.values(attendanceByType);

  // Pie chart data for overall attendance
  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Absent', value: absentCount, color: '#ef4444' }
  ];

  // Most active attendees
  const attendeeStats = filteredLogs.reduce((acc, log) => {
    if (!acc[log.personId]) {
      acc[log.personId] = {
        name: log.personName,
        type: log.personType,
        totalSessions: 0,
        presentSessions: 0
      };
    }
    acc[log.personId].totalSessions++;
    if (log.status === 'Present') {
      acc[log.personId].presentSessions++;
    }
    return acc;
  }, {} as Record<string, { name: string; type: string; totalSessions: number; presentSessions: number }>);

  const topAttendees = Object.values(attendeeStats)
    .map(stats => ({
      ...stats,
      attendanceRate: Math.round((stats.presentSessions / stats.totalSessions) * 100)
    }))
    .sort((a, b) => b.presentSessions - a.presentSessions)
    .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-4 space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-purple-600 text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Site Filter</label>
            <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select site..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map(site => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Attendees</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalAttendees}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Attendance Rate</p>
              <p className="text-lg font-bold text-green-600">{attendanceRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <Activity className="text-emerald-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
              <p className="text-lg font-bold text-emerald-600">{presentCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Calendar className="text-red-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
              <p className="text-lg font-bold text-red-600">{absentCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dateChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'present' ? 'Present' : 'Absent']}
              />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Overall Attendance Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance by Site */}
        {siteChartData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance by Site</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={siteChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="site" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" />
                <Bar dataKey="absent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Attendance by Type */}
        {typeChartData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" />
                <Bar dataKey="absent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Top Attendees */}
      {topAttendees.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Attendees</h3>
          <div className="space-y-3">
            {topAttendees.map((attendee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{attendee.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{attendee.type}</p>
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
        </Card>
      )}

      {/* No Data State */}
      {filteredLogs.length === 0 && !isLoading && (
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