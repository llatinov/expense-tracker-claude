import React from 'react';
import { Store } from 'lucide-react';
import TopVendorsChart from '@/components/TopVendors/TopVendorsChart';
import TopVendorsList from '@/components/TopVendors/TopVendorsList';
import SummaryCards from '@/components/Dashboard/SummaryCards';

export default function TopVendorsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Store className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Top Vendors</h1>
        </div>
        <p className="text-gray-600">
          See which vendors you spend the most money with and analyze your spending patterns.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <TopVendorsChart type="pie" height={350} />
        <TopVendorsChart type="bar" height={350} />
      </div>

      {/* Vendor List */}
      <TopVendorsList />
      
      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Insights</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
            <p className="text-blue-800 text-sm">
              Monitor your top vendors to identify recurring expenses. Consider negotiating better rates 
              or finding alternatives for your most frequent purchases.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">📊 Analysis</h4>
            <p className="text-green-800 text-sm">
              Understanding your vendor spending helps you identify loyalty opportunities and 
              budget allocation across different merchants and service providers.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">🎯 Optimization</h4>
            <p className="text-yellow-800 text-sm">
              Look for patterns in your vendor spending. Can you consolidate purchases or 
              take advantage of bulk discounts with your top vendors?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}