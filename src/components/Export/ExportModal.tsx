'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Database, 
  Settings, 
  Calendar,
  Filter,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExportOptions, ExportFormat, ExportSummary, ExportProgress } from '@/types/export';
import { Expense } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { filterExpenses, formatCurrency, formatDate } from '@/lib/utils';
import ExportPreview from './ExportPreview';
import { exportToCSV, exportToJSON, exportToPDF } from '@/lib/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { expenses } = useExpenses();
  const [currentStep, setCurrentStep] = useState<'options' | 'preview' | 'export'>('options');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {},
    categories: [...EXPENSE_CATEGORIES],
    filename: `expenses-${new Date().toISOString().split('T')[0]}`,
    includeMetadata: true
  });
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate filtered expenses based on current options
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      startDate: exportOptions.dateRange.startDate,
      endDate: exportOptions.dateRange.endDate,
      category: undefined // We'll filter categories separately
    }).filter(expense => exportOptions.categories.includes(expense.category));
  }, [expenses, exportOptions]);

  // Calculate export summary
  const exportSummary: ExportSummary = useMemo(() => {
    const totalRecords = expenses.length;
    const filteredRecords = filteredExpenses.length;
    
    let dateRangeText = 'All time';
    if (exportOptions.dateRange.startDate && exportOptions.dateRange.endDate) {
      dateRangeText = `${formatDate(exportOptions.dateRange.startDate)} - ${formatDate(exportOptions.dateRange.endDate)}`;
    } else if (exportOptions.dateRange.startDate) {
      dateRangeText = `From ${formatDate(exportOptions.dateRange.startDate)}`;
    } else if (exportOptions.dateRange.endDate) {
      dateRangeText = `Until ${formatDate(exportOptions.dateRange.endDate)}`;
    }

    // Rough file size estimation
    const avgRecordSize = exportOptions.format === 'csv' ? 80 : 
                         exportOptions.format === 'json' ? 150 : 200;
    const estimatedBytes = filteredRecords * avgRecordSize;
    const estimatedFileSize = estimatedBytes < 1024 ? `${estimatedBytes}B` :
                             estimatedBytes < 1048576 ? `${Math.round(estimatedBytes / 1024)}KB` :
                             `${Math.round(estimatedBytes / 1048576)}MB`;

    return {
      totalRecords,
      filteredRecords,
      dateRange: dateRangeText,
      categories: exportOptions.categories,
      estimatedFileSize
    };
  }, [expenses, filteredExpenses, exportOptions]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('options');
      setExportProgress(null);
      setShowPreview(false);
    }
  }, [isOpen]);

  const handleFormatChange = (format: ExportFormat) => {
    setExportOptions(prev => ({
      ...prev,
      format,
      filename: prev.filename.replace(/\.(csv|json|pdf)$/, '') + `.${format}`
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setExportOptions(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSelectAllCategories = () => {
    setExportOptions(prev => ({
      ...prev,
      categories: prev.categories.length === EXPENSE_CATEGORIES.length 
        ? [] 
        : [...EXPENSE_CATEGORIES]
    }));
  };

  const handleExport = async () => {
    setCurrentStep('export');
    setExportProgress({
      step: 'preparing',
      progress: 0,
      message: 'Preparing export...'
    });

    try {
      // Simulate progress updates
      const steps = [
        { step: 'filtering' as const, progress: 25, message: 'Filtering data...' },
        { step: 'generating' as const, progress: 75, message: 'Generating file...' },
        { step: 'downloading' as const, progress: 90, message: 'Starting download...' },
        { step: 'complete' as const, progress: 100, message: 'Export complete!' }
      ];

      for (const stepData of steps) {
        setExportProgress(stepData);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Perform the actual export
      const filename = exportOptions.filename.includes('.') 
        ? exportOptions.filename 
        : `${exportOptions.filename}.${exportOptions.format}`;

      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(filteredExpenses, filename, exportOptions.includeMetadata);
          break;
        case 'json':
          exportToJSON(filteredExpenses, filename, exportOptions.includeMetadata);
          break;
        case 'pdf':
          await exportToPDF(filteredExpenses, filename, exportOptions.includeMetadata);
          break;
      }

      // Keep success message for a moment, then close
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setExportProgress({
        step: 'preparing',
        progress: 0,
        message: 'Export failed. Please try again.'
      });
    }
  };

  if (!isOpen) return null;

  const formatIcons = {
    csv: FileText,
    json: Database,
    pdf: FileText
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
              <p className="text-sm text-gray-500">
                {currentStep === 'options' && 'Configure your export settings'}
                {currentStep === 'preview' && 'Preview your data before export'}
                {currentStep === 'export' && 'Exporting your data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={currentStep === 'export'}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'options' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'options' ? 'bg-blue-600 text-white' : 
                ['preview', 'export'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {['preview', 'export'].includes(currentStep) ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Options</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'preview' ? 'text-blue-600' : 
              currentStep === 'export' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'preview' ? 'bg-blue-600 text-white' : 
                currentStep === 'export' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {currentStep === 'export' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${
              currentStep === 'export' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'export' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                {exportProgress?.step === 'complete' ? <CheckCircle className="w-4 h-4" /> : '3'}
              </div>
              <span className="text-sm font-medium">Export</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {currentStep === 'options' && (
            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Export Format
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['csv', 'json', 'pdf'] as ExportFormat[]).map(format => {
                    const Icon = formatIcons[format];
                    return (
                      <button
                        key={format}
                        onClick={() => handleFormatChange(format)}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          exportOptions.format === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm font-medium uppercase">{format}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format === 'csv' && 'Spreadsheet compatible'}
                          {format === 'json' && 'Structured data'}
                          {format === 'pdf' && 'Formatted report'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Date Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.startDate || ''}
                      onChange={e => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, startDate: e.target.value || undefined }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.endDate || ''}
                      onChange={e => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, endDate: e.target.value || undefined }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Categories
                  </div>
                  <button
                    onClick={handleSelectAllCategories}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {exportOptions.categories.length === EXPENSE_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                  </button>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {EXPENSE_CATEGORIES.map(category => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={exportOptions.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filename */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filename
                </label>
                <input
                  type="text"
                  value={exportOptions.filename}
                  onChange={e => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter filename"
                />
              </div>

              {/* Options */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={e => setExportOptions(prev => ({ 
                      ...prev, 
                      includeMetadata: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include export metadata (date created, filters applied, etc.)</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="p-6">
              <ExportPreview 
                expenses={filteredExpenses} 
                exportSummary={exportSummary}
                format={exportOptions.format}
              />
            </div>
          )}

          {currentStep === 'export' && exportProgress && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-center space-y-4">
                {exportProgress.step === 'complete' ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                ) : (
                  <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                )}
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {exportProgress.message}
                  </h3>
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${exportProgress.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {exportProgress.progress}% complete
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Summary Sidebar */}
        {currentStep === 'options' && (
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-3">Export Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total records:</span>
                <span className="font-medium">{exportSummary.totalRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filtered records:</span>
                <span className="font-medium text-blue-600">{exportSummary.filteredRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date range:</span>
                <span className="font-medium">{exportSummary.dateRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categories:</span>
                <span className="font-medium">{exportSummary.categories.length} selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated size:</span>
                <span className="font-medium">{exportSummary.estimatedFileSize}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {currentStep !== 'export' && (
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep === 'options' && (
                <>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Quick Preview</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep('preview')}
                    disabled={exportSummary.filteredRecords === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue to Preview
                  </button>
                </>
              )}
              
              {currentStep === 'preview' && (
                <>
                  <button
                    onClick={() => setCurrentStep('options')}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back to Options
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export {exportSummary.filteredRecords} Records</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Preview Overlay */}
      {showPreview && currentStep === 'options' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Quick Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              <ExportPreview 
                expenses={filteredExpenses.slice(0, 10)} 
                exportSummary={exportSummary}
                format={exportOptions.format}
                isQuickPreview
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}