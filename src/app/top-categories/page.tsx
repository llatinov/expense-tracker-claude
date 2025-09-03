'use client';

import React from 'react';
import { Trophy, TrendingUp, Target } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateTopCategories } from '@/lib/utils';
import TopCategoriesChart from '@/components/TopCategories/TopCategoriesChart';
import TopCategoryCard from '@/components/TopCategories/TopCategoryCard';

export default function TopCategoriesPage() {
  const { expenses, loading, error } = useExpenses();
  const topCategoriesData = calculateTopCategories(expenses);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your top categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = topCategoriesData.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Top Categories</h1>
        </div>
        <p className="text-gray-600">
          Discover your highest spending categories and understand your spending patterns.
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Spending Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Start adding expenses to see your top spending categories and get insights into your habits.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Expense
            </a>
            <a
              href="/expenses"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View All Expenses
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Top Category</p>
                  <p className="text-2xl font-bold">{topCategoriesData[0].category}</p>
                  <p className="text-yellow-100 text-sm">
                    ${topCategoriesData[0].totalAmount.toFixed(2)} spent
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-100" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Categories Active</p>
                  <p className="text-2xl font-bold">{topCategoriesData.length}</p>
                  <p className="text-blue-100 text-sm">
                    out of 6 total
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-100" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Avg per Category</p>
                  <p className="text-2xl font-bold">
                    ${(topCategoriesData.reduce((sum, cat) => sum + cat.totalAmount, 0) / topCategoriesData.length).toFixed(0)}
                  </p>
                  <p className="text-green-100 text-sm">
                    across active categories
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-100" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <TopCategoriesChart data={topCategoriesData} type="bar" height={350} />
            <TopCategoriesChart data={topCategoriesData} type="pie" height={350} />
          </div>

          {/* Category Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
              Detailed Category Breakdown
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCategoriesData.map((categoryData, index) => (
                <TopCategoryCard 
                  key={categoryData.category} 
                  data={categoryData} 
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Insights Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              Spending Insights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Top Spender</h4>
                  <p className="text-blue-800 text-sm">
                    Your <strong>{topCategoriesData[0].category}</strong> category accounts for{' '}
                    <strong>{topCategoriesData[0].percentage.toFixed(1)}%</strong> of your total spending.
                    You&apos;ve made <strong>{topCategoriesData[0].expenseCount}</strong> expenses in this category.
                  </p>
                </div>
                
                {topCategoriesData.length > 1 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">📊 Category Spread</h4>
                    <p className="text-green-800 text-sm">
                      Your spending is distributed across <strong>{topCategoriesData.length}</strong> categories.
                      The top 3 categories account for{' '}
                      <strong>
                        {topCategoriesData.slice(0, 3).reduce((sum, cat) => sum + cat.percentage, 0).toFixed(1)}%
                      </strong>{' '}
                      of your total spending.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {topCategoriesData.length > 2 && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">🎯 Focus Area</h4>
                    <p className="text-purple-800 text-sm">
                      Consider reviewing your <strong>{topCategoriesData[0].category}</strong> expenses.
                      Your average per expense is <strong>${topCategoriesData[0].avgPerExpense.toFixed(2)}</strong>.
                      Small optimizations here could have a big impact.
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">📈 Tracking Tip</h4>
                  <p className="text-orange-800 text-sm">
                    Regular expense tracking helps identify patterns. Consider setting monthly budgets
                    for your top categories to better manage your spending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}