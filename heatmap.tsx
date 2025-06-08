import React from 'react';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  data: Array<{
    dayOfWeek: number;
    hour: number;
    value: number;
  }>;
  className?: string;
  showLabels?: boolean;
  colorScale?: string[];
}

export function Heatmap({
  data,
  className,
  showLabels = true,
  colorScale = ['#f7fafc', '#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff', '#1890ff', '#096dd9', '#0050b3', '#003a8c'],
}: HeatmapProps) {
  // Find the maximum value to normalize the color scale
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Day of week labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Hour labels (24-hour format)
  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    i === 0 ? '12am' : i === 12 ? '12pm' : i < 12 ? `${i}am` : `${i-12}pm`
  );
  
  // Get color based on value
  const getColor = (value: number) => {
    if (value === 0) return colorScale[0];
    const normalizedValue = Math.min(Math.floor((value / maxValue) * (colorScale.length - 1)), colorScale.length - 1);
    return colorScale[normalizedValue];
  };
  
  return (
    <div className={cn('flex flex-col', className)}>
      {showLabels && (
        <div className="flex mb-1">
          <div className="w-10" /> {/* Empty space for alignment */}
          <div className="flex-1 flex">
            {hourLabels.filter((_, i) => i % 3 === 0).map((label, i) => (
              <div key={i} className="flex-1 text-xs text-center text-gray-500">
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-1">
        {showLabels && (
          <div className="flex flex-col justify-between pr-2 py-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="text-xs text-gray-500">
                {label}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex-1 grid grid-rows-7 gap-1">
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="grid grid-cols-24 gap-[1px]">
              {Array.from({ length: 24 }, (_, hour) => {
                const cellData = data.find(d => d.dayOfWeek === day && d.hour === hour);
                const value = cellData?.value || 0;
                return (
                  <div
                    key={hour}
                    className="aspect-square rounded-sm"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${dayLabels[day]} ${hourLabels[hour]}: ${value}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add custom grid classes to tailwind
const gridColsStyles = `
.grid-cols-24 {
  grid-template-columns: repeat(24, minmax(0, 1fr));
}
.grid-rows-7 {
  grid-template-rows: repeat(7, minmax(0, 1fr));
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = gridColsStyles;
  document.head.appendChild(styleElement);
}

