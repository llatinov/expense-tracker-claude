'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TopCategoryData, formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/constants/categories';

interface TopCategoriesChartProps {
  data: TopCategoryData[];
  type?: 'bar' | 'pie';
  height?: number;
}

export default function TopCategoriesChart({ data, type = 'bar', height = 350 }: TopCategoriesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories Visualization</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p>Add expenses to see your top categories!</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.category,
    value: item.totalAmount,
    percentage: item.percentage,
    count: item.expenseCount,
    color: CATEGORY_COLORS[item.category]
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; percentage: number; count: number }; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.payload.name}</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-bold">
              {formatCurrency(data.value)}
            </p>
            <p className="text-sm text-gray-600">
              {data.payload.percentage.toFixed(1)}% of total spending
            </p>
            <p className="text-sm text-gray-600">
              {data.payload.count} expense{data.payload.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Categories {type === 'pie' ? 'Distribution' : 'Comparison'}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
              outerRadius={100}
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
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
          <p className="text-sm text-gray-600">Categories with spending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.totalAmount, 0))}
          </p>
          <p className="text-sm text-gray-600">Total spending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{data[0]?.category || 'N/A'}</p>
          <p className="text-sm text-gray-600">Top category</p>
        </div>
      </div>

      {/* Legend for pie chart */}
      {type === 'pie' && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 truncate">
                {item.name} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}