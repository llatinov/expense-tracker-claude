import { Expense } from '@/types/expense';

export interface VendorData {
  name: string;
  totalSpent: number;
  transactionCount: number;
  percentage: number;
  averageTransaction: number;
  categories: Record<string, number>;
  lastTransaction: string;
}

/**
 * Extracts vendor name from expense description
 * This is a simple implementation that uses the description as the vendor name
 * In a more sophisticated implementation, this could parse and normalize vendor names
 */
export function extractVendorName(expense: Expense): string {
  // For now, we'll use the first part of the description (up to first comma or dash) as the vendor
  // This allows for descriptions like "Starbucks - Coffee" or "Amazon, Books"
  const description = expense.description.trim();
  
  // Split by common separators and take the first part
  const separators = [',', '-', ':', '|', '('];
  let vendorName = description;
  
  for (const separator of separators) {
    if (description.includes(separator)) {
      vendorName = description.split(separator)[0].trim();
      break;
    }
  }
  
  // Limit length and ensure it's not empty
  vendorName = vendorName.substring(0, 50);
  return vendorName || description.substring(0, 20);
}

/**
 * Calculates top vendors based on total spending
 */
export function calculateTopVendors(expenses: Expense[], limit: number = 10): VendorData[] {
  if (expenses.length === 0) return [];

  // Group expenses by vendor
  const vendorMap = new Map<string, VendorData>();
  let totalSpending = 0;

  for (const expense of expenses) {
    const vendorName = extractVendorName(expense);
    totalSpending += expense.amount;

    if (vendorMap.has(vendorName)) {
      const existingVendor = vendorMap.get(vendorName)!;
      existingVendor.totalSpent += expense.amount;
      existingVendor.transactionCount += 1;
      existingVendor.categories[expense.category] = (existingVendor.categories[expense.category] || 0) + expense.amount;
      
      // Update last transaction if this one is more recent
      if (new Date(expense.date) > new Date(existingVendor.lastTransaction)) {
        existingVendor.lastTransaction = expense.date;
      }
    } else {
      vendorMap.set(vendorName, {
        name: vendorName,
        totalSpent: expense.amount,
        transactionCount: 1,
        percentage: 0, // Will be calculated below
        averageTransaction: expense.amount,
        categories: { [expense.category]: expense.amount },
        lastTransaction: expense.date,
      });
    }
  }

  // Convert to array and calculate percentages and averages
  const vendors = Array.from(vendorMap.values()).map(vendor => ({
    ...vendor,
    percentage: totalSpending > 0 ? (vendor.totalSpent / totalSpending) * 100 : 0,
    averageTransaction: vendor.totalSpent / vendor.transactionCount,
  }));

  // Sort by total spent (descending) and limit results
  return vendors
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

/**
 * Gets vendor statistics for a specific vendor
 */
export function getVendorStats(expenses: Expense[], vendorName: string): VendorData | null {
  const vendorExpenses = expenses.filter(expense => extractVendorName(expense) === vendorName);
  
  if (vendorExpenses.length === 0) return null;

  const totalSpent = vendorExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categories: Record<string, number> = {};
  let lastTransaction = vendorExpenses[0].date;

  for (const expense of vendorExpenses) {
    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    if (new Date(expense.date) > new Date(lastTransaction)) {
      lastTransaction = expense.date;
    }
  }

  return {
    name: vendorName,
    totalSpent,
    transactionCount: vendorExpenses.length,
    percentage: totalSpending > 0 ? (totalSpent / totalSpending) * 100 : 0,
    averageTransaction: totalSpent / vendorExpenses.length,
    categories,
    lastTransaction,
  };
}