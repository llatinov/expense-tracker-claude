import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Expense, ExpenseFilters, ExpenseSummary, ExpenseCategory } from '@/types/expense';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterExpenses = (expenses: Expense[], filters: ExpenseFilters): Expense[] => {
  return expenses.filter(expense => {
    // Category filter
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const expenseDate = parseISO(expense.date);
      const startDate = parseISO(filters.startDate);
      const endDate = parseISO(filters.endDate);
      
      if (!isWithinInterval(expenseDate, { start: startDate, end: endDate })) {
        return false;
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(query);
      const matchesCategory = expense.category.toLowerCase().includes(query);
      const matchesAmount = expense.amount.toString().includes(query);
      
      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    return true;
  });
};

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0
  };

  expenses.forEach(expense => {
    categoryBreakdown[expense.category] += expense.amount;
  });

  const topCategory = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as ExpenseCategory | null;

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
    expenseCount: expenses.length
  };
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      expense.date,
      expense.amount.toString(),
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (expenses: Expense[], filename: string = 'expenses.csv'): void => {
  const csvContent = exportToCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};