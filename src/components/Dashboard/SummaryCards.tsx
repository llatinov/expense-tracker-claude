'use client';

import React from 'react';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateExpenseSummary, formatCurrency } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/constants/categories';

export default function SummaryCards() {
  const { expenses } = useExpenses();
  const summary = calculateExpenseSummary(expenses);

  const cards = [
    {
      title: 'Total Spending',
      value: formatCurrency(summary.totalSpending),
      icon: DollarSign,
      color: 'bg-blue-500',
      description: 'All time total'
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlySpending),
      icon: Calendar,
      color: 'bg-green-500',
      description: 'Current month spending'
    },
    {
      title: 'Total Expenses',
      value: summary.expenseCount.toString(),
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Number of transactions'
    },
    {
      title: 'Top Category',
      value: summary.topCategory || 'None',
      icon: PieChart,
      color: 'bg-orange-500',
      description: summary.topCategory ? `${CATEGORY_ICONS[summary.topCategory]} ${formatCurrency(summary.categoryBreakdown[summary.topCategory])}` : 'No expenses yet'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}