import React from 'react';
import { List } from 'lucide-react';
import ExpenseList from '@/components/Expenses/ExpenseList';

export default function ExpensesPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <List className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
        </div>
        <p className="text-gray-600">
          View, search, and manage all your recorded expenses.
        </p>
      </div>

      <ExpenseList />
    </div>
  );
}