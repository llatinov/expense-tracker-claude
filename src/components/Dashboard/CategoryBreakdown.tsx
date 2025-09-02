'use client';

import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateExpenseSummary, formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { ExpenseCategory } from '@/types/expense';

export default function CategoryBreakdown() {
  const { expenses } = useExpenses();
  const summary = calculateExpenseSummary(expenses);
  
  const categoriesWithSpending = Object.entries(summary.categoryBreakdown)
    .filter(([_, amount]) => amount > 0)
    .sort(([,a], [,b]) => b - a)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: summary.totalSpending > 0 ? (amount / summary.totalSpending) * 100 : 0
    }));

  if (categoriesWithSpending.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p>Add some expenses to see your spending breakdown!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
      
      <div className="space-y-4">
        {categoriesWithSpending.map(({ category, amount, percentage }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{CATEGORY_ICONS[category]}</span>
                <span className="font-medium text-gray-900">{category}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </div>
                <div className="text-sm text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: CATEGORY_COLORS[category]
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total:</span>
          <span>{formatCurrency(summary.totalSpending)}</span>
        </div>
      </div>
    </div>
  );
}