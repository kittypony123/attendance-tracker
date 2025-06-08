import { Users, ClipboardCheck, BarChart3 } from "lucide-react";

interface BottomNavigationProps {
  currentView: 'coordinator' | 'attendance' | 'dashboard';
  onViewChange: (view: 'coordinator' | 'attendance' | 'dashboard') => void;
}

export function BottomNavigation({ currentView, onViewChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex">
        <button
          onClick={() => onViewChange('coordinator')}
          className={`flex-1 flex flex-col items-center py-2 px-4 transition-colors ${
            currentView === 'coordinator'
              ? 'text-primary dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Users className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Coordinator</span>
        </button>
        
        <button
          onClick={() => onViewChange('attendance')}
          className={`flex-1 flex flex-col items-center py-2 px-4 transition-colors ${
            currentView === 'attendance'
              ? 'text-primary dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <ClipboardCheck className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Attendance</span>
        </button>

        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex-1 flex flex-col items-center py-2 px-4 transition-colors ${
            currentView === 'dashboard'
              ? 'text-primary dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <BarChart3 className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
      </div>
    </nav>
  );
}

