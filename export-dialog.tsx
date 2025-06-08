import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange, formatDate } from '@/lib/dateUtils';
import { Loader2, FileSpreadsheet, FilePdf, FileJson } from 'lucide-react';

interface Site {
  id: string;
  name: string;
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sites: Site[];
  dateRange: DateRange;
  onExport: (format: string, options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  startDate: string;
  endDate: string;
  siteIds: string[];
  personTypes: string[];
  includeTimestamp: boolean;
  includePersonId: boolean;
}

export function ExportDialog({ 
  isOpen, 
  onClose, 
  sites, 
  dateRange,
  onExport 
}: ExportDialogProps) {
  // Export format options
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  
  // Export date range
  const [exportDateRange, setExportDateRange] = useState<DateRange>(dateRange);
  
  // Site selection
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['all']);
  
  // Person type selection
  const [selectedPersonTypes, setSelectedPersonTypes] = useState<string[]>([
    'Volunteer', 'Participant'
  ]);
  
  // Additional options
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includePersonId, setIncludePersonId] = useState(true);
  
  // Loading state
  const [isExporting, setIsExporting] = useState(false);
  
  // Site options for multi-select
  const siteOptions: Option[] = [
    { value: 'all', label: 'All Sites' },
    ...sites.map(site => ({ value: site.id, label: site.name }))
  ];
  
  // Person type options
  const personTypeOptions: Option[] = [
    { value: 'Volunteer', label: 'Volunteers' },
    { value: 'Participant', label: 'Participants' }
  ];
  
  // Handle export button click
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await onExport(format, {
        startDate: formatDate(exportDateRange.start),
        endDate: formatDate(exportDateRange.end),
        siteIds: selectedSiteIds,
        personTypes: selectedPersonTypes,
        includeTimestamp,
        includePersonId
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Attendance Data</DialogTitle>
          <DialogDescription>
            Configure your export options and download the data in your preferred format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup 
              value={format} 
              onValueChange={(value) => setFormat(value as 'csv' | 'json')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center">
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker 
              dateRange={exportDateRange}
              onDateRangeChange={setExportDateRange}
            />
          </div>
          
          {/* Site Selection */}
          <div className="space-y-2">
            <Label>Sites</Label>
            <MultiSelect
              options={siteOptions}
              selected={selectedSiteIds}
              onChange={setSelectedSiteIds}
              placeholder="Select sites..."
            />
          </div>
          
          {/* Person Type Selection */}
          <div className="space-y-2">
            <Label>Person Types</Label>
            <MultiSelect
              options={personTypeOptions}
              selected={selectedPersonTypes}
              onChange={setSelectedPersonTypes}
              placeholder="Select person types..."
            />
          </div>
          
          {/* Additional Options */}
          <div className="space-y-2">
            <Label>Additional Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-timestamp" 
                  checked={includeTimestamp}
                  onCheckedChange={(checked) => setIncludeTimestamp(checked as boolean)}
                />
                <Label htmlFor="include-timestamp">Include timestamp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-person-id" 
                  checked={includePersonId}
                  onCheckedChange={(checked) => setIncludePersonId(checked as boolean)}
                />
                <Label htmlFor="include-person-id">Include person ID</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>Export</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

