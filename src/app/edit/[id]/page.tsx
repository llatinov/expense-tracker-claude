'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import ExpenseForm from '@/components/Forms/ExpenseForm';
import { ExpenseFormData } from '@/types/expense';

interface EditExpensePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { expenses, updateExpense } = useExpenses();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundExpense = expenses.find(exp => exp.id === id);
    if (foundExpense) {
      setExpense(foundExpense);
    }
    setLoading(false);
  }, [expenses, id]);

  const handleSubmit = (formData: ExpenseFormData) => {
    updateExpense(id, {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    });
    router.push('/expenses');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Expense Not Found</h2>
          <p className="text-gray-600 mb-4">
            The expense you're trying to edit could not be found.
          </p>
          <button
            onClick={() => router.push('/expenses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Expenses
          </button>
        </div>
      </div>
    );
  }

  const initialData: ExpenseFormData = {
    date: expense.date,
    amount: expense.amount.toString(),
    category: expense.category,
    description: expense.description,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Edit className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
        </div>
        <p className="text-gray-600">
          Update the details of your expense record.
        </p>
      </div>

      <ExpenseForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Update Expense"
      />
    </div>
  );
}