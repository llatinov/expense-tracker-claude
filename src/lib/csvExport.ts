import { Expense } from '@/types/expense';

export function exportExpensesToCSV(expenses: Expense[]): void {
  const csvHeaders = ['Date', 'Category', 'Amount', 'Description'];
  
  const csvRows = expenses.map(expense => [
    expense.date,
    expense.category,
    expense.amount.toString(),
    expense.description.replace(/"/g, '""') // Escape quotes in description
  ]);

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}