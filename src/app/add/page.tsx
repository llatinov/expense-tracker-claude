import React from 'react';
import { Plus } from 'lucide-react';
import ExpenseForm from '@/components/Forms/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Plus className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
        </div>
        <p className="text-gray-600">
          Track your spending by adding a new expense to your records.
        </p>
      </div>

      <ExpenseForm />
    </div>
  );
}