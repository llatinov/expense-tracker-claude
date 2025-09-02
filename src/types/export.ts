export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
  categories: string[];
  filename: string;
  includeMetadata: boolean;
}

export interface ExportSummary {
  totalRecords: number;
  filteredRecords: number;
  dateRange: string;
  categories: string[];
  estimatedFileSize: string;
}

export interface ExportProgress {
  step: 'preparing' | 'filtering' | 'generating' | 'downloading' | 'complete';
  progress: number; // 0-100
  message: string;
}