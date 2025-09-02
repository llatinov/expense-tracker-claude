'use client';

import React from 'react';
import { FileText, Database, Eye, Info } from 'lucide-react';
import { Expense } from '@/types/expense';
import { ExportSummary, ExportFormat } from '@/types/export';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/constants/categories';

interface ExportPreviewProps {
  expenses: Expense[];
  exportSummary: ExportSummary;
  format: ExportFormat;
  isQuickPreview?: boolean;
}

export default function ExportPreview({ 
  expenses, 
  exportSummary, 
  format, 
  isQuickPreview = false 
}: ExportPreviewProps) {
  const maxDisplayRecords = isQuickPreview ? 5 : 10;
  const displayExpenses = expenses.slice(0, maxDisplayRecords);
  const hasMoreRecords = expenses.length > maxDisplayRecords;

  const formatPreviews = {
    csv: (
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="text-xs text-gray-500 mb-2">CSV Preview:</div>
        <div className="space-y-1">
          <div className="text-gray-700 font-medium">Date,Amount,Category,Description</div>
          {displayExpenses.map((expense, index) => (
            <div key={index} className="text-gray-600">
              {expense.date},{expense.amount},{expense.category},"{expense.description}"
            </div>
          ))}
          {hasMoreRecords && (
            <div className="text-gray-400 italic">... and {expenses.length - maxDisplayRecords} more records</div>
          )}
        </div>
      </div>
    ),
    json: (
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="text-xs text-gray-500 mb-2">JSON Preview:</div>
        <pre className="text-gray-700">
{`{
  "expenses": [`}
          {displayExpenses.map((expense, index) => (
            <div key={index} className="ml-4 text-gray-600">
{`    {
      "id": "${expense.id}",
      "date": "${expense.date}",
      "amount": ${expense.amount},
      "category": "${expense.category}",
      "description": "${expense.description}"
    }${index < displayExpenses.length - 1 ? ',' : ''}`}
            </div>
          ))}
          {hasMoreRecords && (
            <div className="ml-4 text-gray-400 italic">    // ... {expenses.length - maxDisplayRecords} more records</div>
          )}
{`  ],
  "totalRecords": ${expenses.length},
  "exportDate": "${new Date().toISOString()}"
}`}
        </pre>
      </div>
    ),
    pdf: (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-500 mb-4">PDF Preview (Table Format):</div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Expense Report</h3>
            <p className="text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString()} • {expenses.length} records
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Category</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayExpenses.map((expense, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-600">{formatDate(expense.date)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span>{CATEGORY_ICONS[expense.category]}</span>
                        <span className="text-gray-700">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{expense.description}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hasMoreRecords && (
            <div className="text-center text-gray-500 text-sm mt-4 py-2 bg-gray-50 rounded">
              ... and {expenses.length - maxDisplayRecords} more records will be included in the PDF
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="space-y-6">
      {/* Export Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Export Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Format:</strong> {format.toUpperCase()}</p>
              <p><strong>Records:</strong> {exportSummary.filteredRecords.toLocaleString()} of {exportSummary.totalRecords.toLocaleString()}</p>
              <p><strong>Date Range:</strong> {exportSummary.dateRange}</p>
              <p><strong>Categories:</strong> {exportSummary.categories.join(', ')}</p>
              <p><strong>Estimated Size:</strong> {exportSummary.estimatedFileSize}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Preview */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-medium text-gray-900">
            Data Preview ({format.toUpperCase()} format)
          </h4>
        </div>
        
        {formatPreviews[format]}
      </div>

      {/* Summary Statistics */}
      {!isQuickPreview && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {expenses.length.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0)}
              </div>
              <div className="text-sm text-gray-600">Average Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Check */}
      {expenses.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">No Data to Export</h4>
              <p className="text-sm text-yellow-700">
                Your current filters don't match any expenses. Please adjust your date range or category selection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}