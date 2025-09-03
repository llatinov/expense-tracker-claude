'use client';

import React from 'react';
import { TopCategoryData, formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';

interface TopCategoryCardProps {
  data: TopCategoryData;
  rank: number;
}

export default function TopCategoryCard({ data, rank }: TopCategoryCardProps) {
  const { category, totalAmount, expenseCount, percentage, avgPerExpense } = data;
  const categoryColor = CATEGORY_COLORS[category];
  const categoryIcon = CATEGORY_ICONS[category];

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow duration-200" 
         style={{ borderLeftColor: categoryColor }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryIcon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-600">{expenseCount} expense{expenseCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRankStyle(rank)}`}>
          {getRankIcon(rank)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold" style={{ color: categoryColor }}>
            {percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">of Total</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800 font-medium">Average per expense:</span>
          <span className="text-sm text-blue-900 font-bold">{formatCurrency(avgPerExpense)}</span>
        </div>
      </div>

      {/* Progress bar showing percentage */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: categoryColor,
              minWidth: percentage > 0 ? '4px' : '0px'
            }}
          />
        </div>
      </div>
    </div>
  );
}