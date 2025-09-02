import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from './utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

// Enhanced CSV export with metadata
export const exportToCSV = (expenses: Expense[], filename: string, includeMetadata: boolean = true): void => {
  let csvContent = '';
  
  // Add metadata if requested
  if (includeMetadata) {
    csvContent += `# Expense Report Export\n`;
    csvContent += `# Generated on: ${new Date().toLocaleString()}\n`;
    csvContent += `# Total records: ${expenses.length}\n`;
    csvContent += `# Date range: ${expenses.length > 0 ? 
      `${formatDate(Math.min(...expenses.map(e => new Date(e.date).getTime())).toString())} to ${formatDate(Math.max(...expenses.map(e => new Date(e.date).getTime())).toString())}` : 
      'No data'}\n`;
    csvContent += `#\n`;
  }
  
  // Headers
  const headers = ['Date', 'Amount', 'Category', 'Description', 'Created At', 'Updated At'];
  csvContent += headers.join(',') + '\n';
  
  // Data rows
  expenses.forEach(expense => {
    const row = [
      expense.date,
      expense.amount.toString(),
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.createdAt,
      expense.updatedAt
    ];
    csvContent += row.join(',') + '\n';
  });
  
  // Add summary if metadata is included
  if (includeMetadata && expenses.length > 0) {
    csvContent += '\n# Summary Statistics\n';
    csvContent += `# Total Amount: ${expenses.reduce((sum, exp) => sum + exp.amount, 0)}\n`;
    csvContent += `# Average Amount: ${(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toFixed(2)}\n`;
    
    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    csvContent += '# Category Breakdown:\n';
    Object.entries(categoryTotals).forEach(([category, total]) => {
      csvContent += `# ${category}: ${total}\n`;
    });
  }
  
  downloadFile(csvContent, filename, 'text/csv');
};

// Enhanced JSON export with metadata
export const exportToJSON = (expenses: Expense[], filename: string, includeMetadata: boolean = true): void => {
  const data: any = {
    expenses: expenses
  };
  
  if (includeMetadata) {
    // Calculate summary statistics
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    data.metadata = {
      exportDate: new Date().toISOString(),
      totalRecords: expenses.length,
      totalAmount: totalAmount,
      averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
      dateRange: expenses.length > 0 ? {
        earliest: Math.min(...expenses.map(e => new Date(e.date).getTime())),
        latest: Math.max(...expenses.map(e => new Date(e.date).getTime()))
      } : null,
      categoryBreakdown: categoryTotals,
      uniqueCategories: [...new Set(expenses.map(e => e.category))],
      exportVersion: '2.0'
    };
  }
  
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

// Enhanced PDF export with professional formatting
export const exportToPDF = async (expenses: Expense[], filename: string, includeMetadata: boolean = true): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Expense Report', pageWidth / 2, 20, { align: 'center' });
  
  // Subtitle with metadata
  if (includeMetadata) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Summary information
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    pdf.text(`Total Records: ${expenses.length} | Total Amount: ${formatCurrency(totalAmount)}`, pageWidth / 2, 40, { align: 'center' });
    
    if (expenses.length > 0) {
      const earliestDate = new Date(Math.min(...expenses.map(e => new Date(e.date).getTime())));
      const latestDate = new Date(Math.max(...expenses.map(e => new Date(e.date).getTime())));
      pdf.text(`Date Range: ${earliestDate.toLocaleDateString()} - ${latestDate.toLocaleDateString()}`, pageWidth / 2, 48, { align: 'center' });
    }
  }
  
  // Prepare table data
  const tableColumns = ['Date', 'Category', 'Description', 'Amount'];
  const tableData = expenses.map(expense => [
    formatDate(expense.date),
    expense.category,
    expense.description.length > 40 ? expense.description.substring(0, 37) + '...' : expense.description,
    formatCurrency(expense.amount)
  ]);
  
  // Add main table
  pdf.autoTable({
    head: [tableColumns],
    body: tableData,
    startY: includeMetadata ? 55 : 30,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Light blue-gray
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Date
      1: { cellWidth: 30 }, // Category  
      2: { cellWidth: 85 }, // Description
      3: { cellWidth: 30, halign: 'right' } // Amount
    },
    margin: { left: 15, right: 15 },
    tableWidth: 'wrap'
  });
  
  // Add category breakdown if metadata is included
  if (includeMetadata && expenses.length > 0) {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const finalY = (pdf as any).lastAutoTable.finalY || 100;
    
    // Category breakdown section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category Breakdown', 15, finalY + 20);
    
    const categoryData = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .map(([category, total]) => [
        category,
        formatCurrency(total),
        `${((total / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)}%`
      ]);
    
    pdf.autoTable({
      head: [['Category', 'Amount', 'Percentage']],
      body: categoryData,
      startY: finalY + 25,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [229, 231, 235], // Gray color
        textColor: 0,
        fontStyle: 'bold'
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' }
      },
      margin: { left: 15 }
    });
  }
  
  // Add footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    
    if (includeMetadata) {
      pdf.text('Generated by Expense Tracker v2.0', 15, pdf.internal.pageSize.getHeight() - 10);
    }
  }
  
  // Save the PDF
  pdf.save(filename);
};

// Utility function to download files
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Helper function to estimate file sizes
export const estimateFileSize = (expenses: Expense[], format: 'csv' | 'json' | 'pdf', includeMetadata: boolean = true): string => {
  let estimatedBytes = 0;
  
  switch (format) {
    case 'csv':
      // Headers + data rows + metadata
      estimatedBytes = 100; // Headers
      estimatedBytes += expenses.length * 80; // Average row size
      if (includeMetadata) estimatedBytes += 500; // Metadata overhead
      break;
      
    case 'json':
      // JSON structure overhead + data + metadata
      estimatedBytes = 200; // JSON structure
      estimatedBytes += expenses.length * 150; // Average record size in JSON
      if (includeMetadata) estimatedBytes += 300; // Metadata object
      break;
      
    case 'pdf':
      // Base PDF + table data + formatting
      estimatedBytes = 5000; // Base PDF overhead
      estimatedBytes += expenses.length * 100; // Table row overhead
      if (includeMetadata) estimatedBytes += 2000; // Charts and summary
      break;
  }
  
  // Convert to human readable format
  if (estimatedBytes < 1024) return `${estimatedBytes}B`;
  if (estimatedBytes < 1048576) return `${Math.round(estimatedBytes / 1024)}KB`;
  return `${Math.round(estimatedBytes / 1048576)}MB`;
};