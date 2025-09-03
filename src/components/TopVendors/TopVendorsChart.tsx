'use client';

import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateTopVendors } from '@/lib/vendors';

interface TopVendorsChartProps {
  type?: 'pie' | 'bar';
  height?: number;
  limit?: number;
}

const VENDOR_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
  '#f97316', // orange
  '#14b8a6', // teal
  '#84cc16', // lime
];

export default function TopVendorsChart({ type = 'pie', height = 300, limit = 10 }: TopVendorsChartProps) {
  const { expenses } = useExpenses();
  const topVendors = calculateTopVendors(expenses, limit);
  
  const chartData = topVendors.map((vendor, index) => ({
    name: vendor.name,
    value: vendor.totalSpent,
    percentage: vendor.percentage,
    count: vendor.transactionCount,
    color: VENDOR_COLORS[index % VENDOR_COLORS.length]
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendors</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <p>Add expenses to see your top vendors!</p>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-blue-600 font-semibold">
            ${data.value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {data.payload.percentage.toFixed(1)}% of total
          </p>
          <p className="text-sm text-gray-500">
            {data.payload.count} transaction{data.payload.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const truncateLabel = (label: string, maxLength: number = 15) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Vendors {type === 'pie' ? '(by spending)' : '(breakdown)'}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${truncateLabel(name)} ${percentage.toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => truncateLabel(value, 12)}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        )}
      </ResponsiveContainer>
      
      {/* Legend for pie chart */}
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.slice(0, 8).map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 truncate" title={item.name}>
                {truncateLabel(item.name, 18)}
              </span>
            </div>
          ))}
          {chartData.length > 8 && (
            <div className="text-sm text-gray-500 col-span-2 text-center pt-2">
              + {chartData.length - 8} more vendors
            </div>
          )}
        </div>
      )}
    </div>
  );
}