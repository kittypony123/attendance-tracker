import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  className?: string;
  showValue?: boolean;
  invertColors?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIndicator({
  value,
  className,
  showValue = true,
  invertColors = false,
  size = 'md',
}: TrendIndicatorProps) {
  // Determine if the trend is positive, negative, or neutral
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;
  
  // Determine colors based on trend and invertColors flag
  let colorClass = '';
  if (isPositive) {
    colorClass = invertColors ? 'text-red-600' : 'text-green-600';
  } else if (isNegative) {
    colorClass = invertColors ? 'text-green-600' : 'text-red-600';
  } else {
    colorClass = 'text-gray-500';
  }
  
  // Determine icon size based on size prop
  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];
  
  // Determine text size based on size prop
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  
  return (
    <div className={cn('flex items-center gap-1', colorClass, className)}>
      {isPositive && <TrendingUp className={iconSize} />}
      {isNegative && <TrendingDown className={iconSize} />}
      {isNeutral && <Minus className={iconSize} />}
      {showValue && (
        <span className={cn('font-medium', textSize)}>
          {Math.abs(value)}%
        </span>
      )}
    </div>
  );
}

