import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MoreHorizontal, 
  Download, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  onDownload?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  downloadDisabled?: boolean;
  fullScreenDisabled?: boolean;
}

export function ChartContainer({
  title,
  children,
  className,
  onRefresh,
  onDownload,
  onToggleVisibility,
  isVisible = true,
  downloadDisabled = false,
  fullScreenDisabled = true,
}: ChartContainerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300',
        isFullScreen ? 'fixed inset-4 z-50 flex flex-col' : 'h-full',
        className
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onDownload && (
                <DropdownMenuItem
                  onClick={onDownload}
                  disabled={downloadDisabled}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              )}
              {!fullScreenDisabled && (
                <DropdownMenuItem onClick={toggleFullScreen}>
                  {isFullScreen ? (
                    <>
                      <Minimize2 className="mr-2 h-4 w-4" />
                      Exit Full Screen
                    </>
                  ) : (
                    <>
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Full Screen
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onToggleVisibility && (
                <DropdownMenuItem onClick={onToggleVisibility}>
                  {isVisible ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Chart
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Chart
                    </>
                  )}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={cn(
        'p-4',
        isFullScreen ? 'flex-1 overflow-auto' : 'h-[calc(100%-60px)]'
      )}>
        {children}
      </div>
    </Card>
  );
}

