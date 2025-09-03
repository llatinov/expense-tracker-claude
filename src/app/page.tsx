import React from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Store } from 'lucide-react';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import CategoryBreakdown from '@/components/Dashboard/CategoryBreakdown';
import ExpenseList from '@/components/Expenses/ExpenseList';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s an overview of your expenses.
          </p>
        </div>
        
        <Link
          href="/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Expenses</h2>
            <p className="text-sm text-gray-600">Your latest spending activity</p>
          </div>
          <ExpenseList showFilters={false} limit={5} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1">
          <CategoryBreakdown />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/add"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Add Expense</div>
              <div className="text-sm text-gray-500">Record a new expense</div>
            </div>
          </Link>
          
          <Link
            href="/expenses"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View All</div>
              <div className="text-sm text-gray-500">See all expenses</div>
            </div>
          </Link>
          
          <Link
            href="/analytics"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">Detailed insights</div>
            </div>
          </Link>
          
          <Link
            href="/top-vendors"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Store className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Top Vendors</div>
              <div className="text-sm text-gray-500">Spending by vendor</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
