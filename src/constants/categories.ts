import { ExpenseCategory } from '@/types/expense';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation', 
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Food': '#ef4444',
  'Transportation': '#3b82f6',
  'Entertainment': '#8b5cf6',
  'Shopping': '#f59e0b',
  'Bills': '#10b981',
  'Other': '#6b7280'
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'Food': '🍽️',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Bills': '📄',
  'Other': '📝'
};