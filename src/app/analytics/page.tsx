import React from 'react';
import { BarChart3 } from 'lucide-react';
import SpendingChart from '@/components/Charts/SpendingChart';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import CategoryBreakdown from '@/components/Dashboard/CategoryBreakdown';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <p className="text-gray-600">
          Detailed insights into your spending patterns and trends.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <SpendingChart type="pie" height={350} />
        <SpendingChart type="bar" height={350} />
      </div>

      {/* Category Breakdown */}
      <div className="grid lg:grid-cols-2 gap-8">
        <CategoryBreakdown />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
              <p className="text-blue-800 text-sm">
                Track your expenses regularly to get better insights into your spending habits. 
                Consider setting monthly budgets for each category.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📊 Analysis</h4>
              <p className="text-green-800 text-sm">
                Your spending data helps you understand where your money goes. 
                Use the category breakdown to identify areas where you might save money.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">🎯 Goal Setting</h4>
              <p className="text-yellow-800 text-sm">
                Set realistic spending goals for each category. Monitor your progress 
                and adjust your habits to meet your financial objectives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}