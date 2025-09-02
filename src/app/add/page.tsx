'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseFormData } from '@/types/expense';
import SmartExpenseForm from '@/components/AI/SmartExpenseForm';
import ExpenseForm from '@/components/Forms/ExpenseForm';

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense } = useExpenses();

  const handleSubmit = (data: ExpenseFormData) => {
    addExpense(data);
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-10 h-10 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Expense Tracking</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience intelligent expense management with AI-powered suggestions, automatic categorization, 
          and predictive insights based on your spending patterns.
        </p>
      </div>

      {/* <ExpenseForm /> */}
      <SmartExpenseForm onSubmit={handleSubmit} />
    </div>
  );
}