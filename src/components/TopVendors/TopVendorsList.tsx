'use client';

import React, { useState } from 'react';
import { Store, TrendingUp, Calendar, Hash, BarChart3 } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateTopVendors } from '@/lib/vendors';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/constants/categories';

interface TopVendorsListProps {
  limit?: number;
}

export default function TopVendorsList({ limit = 20 }: TopVendorsListProps) {
  const { expenses } = useExpenses();
  const [showAll, setShowAll] = useState(false);
  
  const topVendors = calculateTopVendors(expenses, showAll ? undefined : limit);
  const displayVendors = showAll ? topVendors : topVendors.slice(0, 10);

  if (topVendors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No vendor data available</h3>
          <p>Add some expenses to see your top vendors analysis.</p>
        </div>
      </div>
    );
  }

  const getTopCategory = (categories: Record<string, number>) => {
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Store className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Vendor Breakdown</h3>
          </div>
          <div className="text-sm text-gray-500">
            Showing top {displayVendors.length} vendor{displayVendors.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {displayVendors.map((vendor, index) => (
          <div key={vendor.name} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    #{index + 1}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {vendor.name}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      {vendor.transactionCount} transaction{vendor.transactionCount !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Last: {formatDate(vendor.lastTransaction)}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Avg: {formatCurrency(vendor.averageTransaction)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-right">
                {/* Top Category */}
                <div className="hidden sm:block">
                  <div className="flex items-center justify-end mb-1">
                    <span className="text-lg mr-1">
                      {CATEGORY_ICONS[getTopCategory(vendor.categories) as keyof typeof CATEGORY_ICONS]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getTopCategory(vendor.categories)}
                    </span>
                  </div>
                </div>

                {/* Amount and Percentage */}
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(vendor.totalSpent)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {vendor.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Spending distribution</span>
                <span>{vendor.percentage.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(vendor.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {topVendors.length > 10 && (
        <div className="p-4 text-center border-t border-gray-200">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {showAll ? 'Show less' : `Show ${topVendors.length - 10} more vendors`}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total vendors analyzed:</span> {topVendors.length} • 
          <span className="font-medium ml-2">Combined spending:</span> {formatCurrency(topVendors.reduce((sum, v) => sum + v.totalSpent, 0))}
        </div>
      </div>
    </div>
  );
}