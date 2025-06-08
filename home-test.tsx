import { useState, useEffect } from "react";
import { CoordinatorView } from "@/components/coordinator-view";
import { AttendanceView } from "@/components/attendance-view";
import { DashboardView } from "@/components/dashboard-view";
import { EnhancedDashboardView } from "@/components/enhanced-dashboard-view";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Settings, Wifi, WifiOff, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomeTest() {
  const [currentView, setCurrentView] = useState<'coordinator' | 'attendance' | 'dashboard'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [dashboardType, setDashboardType] = useState<'original' | 'enhanced'>('enhanced');

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setToast({ message: 'You are offline. Changes will sync when online.', type: 'warning' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA status bar space for standalone mode
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      document.body.classList.add('standalone-mode');
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300 pb-20">
      {/* Status bar space for PWA */}
      <div className="safe-area-top"></div>

      {/* Top App Bar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-30 transition-colors duration-300">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentView === 'coordinator' ? 'Coordinator' : 
               currentView === 'attendance' ? 'Attendance' : 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Network status indicator */}
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Settings button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {currentView === 'coordinator' ? (
          <CoordinatorView 
            showLoading={setShowLoading}
            showToast={showToast}
          />
        ) : currentView === 'attendance' ? (
          <AttendanceView 
            showLoading={setShowLoading}
            showToast={showToast}
          />
        ) : (
          <div className="p-4">
            <Tabs value={dashboardType} onValueChange={(value) => setDashboardType(value as 'original' | 'enhanced')}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="original">Original Dashboard</TabsTrigger>
                <TabsTrigger value="enhanced">Enhanced Dashboard</TabsTrigger>
              </TabsList>
              <TabsContent value="original">
                <DashboardView 
                  showLoading={setShowLoading}
                  showToast={showToast}
                />
              </TabsContent>
              <TabsContent value="enhanced">
                <EnhancedDashboardView 
                  showLoading={setShowLoading}
                  showToast={showToast}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView('coordinator')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentView === 'coordinator' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">Coordinator</span>
          </button>
          
          <button
            onClick={() => setCurrentView('attendance')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentView === 'attendance' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs mt-1">Attendance</span>
          </button>
          
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentView === 'dashboard' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay show={showLoading} />

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

