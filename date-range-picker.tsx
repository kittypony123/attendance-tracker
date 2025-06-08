import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange, DateRangePreset, getDateRange } from '@/lib/dateUtils';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last30days');
  const [date, setDate] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: dateRange.start,
    to: dateRange.end,
  });

  // Handle preset selection
  const handlePresetChange = (preset: DateRangePreset) => {
    setSelectedPreset(preset);
    
    if (preset === 'custom') {
      // Keep the current custom range if already set
      if (date.from && date.to) {
        const customRange = getDateRange('custom', date.from, date.to);
        onDateRangeChange(customRange);
      }
      return;
    }
    
    const newRange = getDateRange(preset);
    setDate({
      from: newRange.start,
      to: newRange.end,
    });
    onDateRangeChange(newRange);
  };

  // Handle calendar date selection
  const handleDateSelect = (range: { from: Date; to: Date | undefined }) => {
    setDate(range);
    
    if (range.from && range.to) {
      setSelectedPreset('custom');
      const customRange = getDateRange('custom', range.from, range.to);
      onDateRangeChange(customRange);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="px-4 pt-4 pb-2">
            <Select
              value={selectedPreset}
              onValueChange={(value) => handlePresetChange(value as DateRangePreset)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="lastWeek">Last week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="thisYear">This year</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </div>
          <div className="flex items-center justify-end gap-2 p-3 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (date.from && date.to) {
                  setIsOpen(false);
                }
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

