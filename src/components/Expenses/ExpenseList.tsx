'use client';

import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Search, Filter, Download } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseFilters, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/constants/categories';
import { filterExpenses, formatCurrency, formatDate, downloadCSV } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  showFilters?: boolean;
  limit?: number;
}

export default function ExpenseList({ showFilters = true, limit }: ExpenseListProps) {
  const { expenses, deleteExpense } = useExpenses();
  const [localFilters, setLocalFilters] = useState<ExpenseFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = useMemo(() => {
    const filters = { ...localFilters, searchQuery };
    let result = filterExpenses(expenses, filters);
    
    // Sort by date (newest first)
    result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }, [expenses, localFilters, searchQuery, limit]);

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleExport = () => {
    const expensesToExport = limit ? filteredExpenses : expenses;
    downloadCSV(expensesToExport, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={localFilters.category || 'All'}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  category: e.target.value === 'All' ? undefined : e.target.value as ExpenseCategory 
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              value={localFilters.startDate || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={localFilters.endDate || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="End date"
            />
            
            {(localFilters.startDate || localFilters.endDate || localFilters.category || searchQuery) && (
              <button
                onClick={() => {
                  setLocalFilters({});
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No expenses found</h3>
            <p>Try adjusting your search criteria or add your first expense.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {CATEGORY_ICONS[expense.category]}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {expense.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(expense.date)}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/edit/${expense.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit expense"
                      >
                        <Edit className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {limit && filteredExpenses.length === limit && (
          <div className="p-4 text-center border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Showing {limit} of {expenses.length} expenses
            </p>
            <a
              href="/expenses"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all expenses →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}