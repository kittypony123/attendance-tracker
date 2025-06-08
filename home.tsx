import { useState, useEffect } from "react";
import { CoordinatorView } from "@/components/coordinator-view";
import { AttendanceView } from "@/components/attendance-view";
import { DashboardView } from "@/components/dashboard-view";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ToastNotification } from "@/components/ui/toast-notification";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Settings, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentView, setCurrentView] = useState<'coordinator' | 'attendance'>('coordinator');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const { theme, toggleTheme } = useTheme();

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
              {currentView === 'coordinator' ? 'Coordinator' : 'Attendance'}
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
        ) : (
          <AttendanceView 
            showLoading={setShowLoading}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

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
