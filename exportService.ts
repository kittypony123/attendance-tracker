import { ExportOptions } from '@/components/export-dialog';

/**
 * Download a file from a URL with query parameters
 */
export async function downloadFile(
  url: string, 
  queryParams: Record<string, string | string[]>,
  filename: string
): Promise<void> {
  // Build query string
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${encodeURIComponent(value.join(','))}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
  
  // Create full URL with query parameters
  const fullUrl = `${url}?${queryString}`;
  
  try {
    // Fetch the file
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Export attendance data as CSV
 */
export async function exportAsCSV(options: ExportOptions): Promise<void> {
  const queryParams = {
    startDate: options.startDate,
    endDate: options.endDate,
    siteIds: options.siteIds,
    personTypes: options.personTypes
  };
  
  const filename = `attendance_${options.startDate}_to_${options.endDate}.csv`;
  
  await downloadFile('/api/export/csv', queryParams, filename);
}

/**
 * Export attendance data as JSON
 */
export async function exportAsJSON(options: ExportOptions): Promise<void> {
  const queryParams = {
    startDate: options.startDate,
    endDate: options.endDate,
    siteIds: options.siteIds,
    personTypes: options.personTypes
  };
  
  const filename = `attendance_${options.startDate}_to_${options.endDate}.json`;
  
  await downloadFile('/api/export/json', queryParams, filename);
}

/**
 * Export attendance data based on format
 */
export async function exportAttendanceData(
  format: string, 
  options: ExportOptions
): Promise<void> {
  switch (format) {
    case 'csv':
      return exportAsCSV(options);
    case 'json':
      return exportAsJSON(options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

