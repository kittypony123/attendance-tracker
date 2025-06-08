import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendIndicator } from '@/components/ui/trend-indicator';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  invertTrendColors?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  invertTrendColors = false,
  valuePrefix = '',
  valueSuffix = '',
  className,
  iconClassName,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center space-x-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconClassName)}>
          <Icon className="text-current" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex items-center gap-2">
            <p className={cn('text-lg font-bold', valueClassName)}>
              {valuePrefix}{value}{valueSuffix}
            </p>
            {typeof trend === 'number' && (
              <TrendIndicator 
                value={trend} 
                invertColors={invertTrendColors} 
                size="sm"
              />
            )}
          </div>
          {trendLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {trendLabel}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

