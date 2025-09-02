import React from 'react';
import { Brain } from 'lucide-react';
import SpendingChart from '@/components/Charts/SpendingChart';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import CategoryBreakdown from '@/components/Dashboard/CategoryBreakdown';
import PredictiveInsights from '@/components/AI/PredictiveInsights';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics & Predictions</h1>
        </div>
        <p className="text-gray-600">
          Advanced AI-powered insights, predictions, and behavioral analysis of your spending patterns.
        </p>
      </div>

      {/* AI Predictive Insights */}
      <PredictiveInsights />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <SpendingChart type="pie" height={350} />
        <SpendingChart type="bar" height={350} />
      </div>

      {/* Category Breakdown */}
      <div className="grid lg:grid-cols-2 gap-8">
        <CategoryBreakdown />
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Intelligence
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/60 backdrop-blur rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-900 mb-2">🤖 Smart Predictions</h4>
              <p className="text-purple-800 text-sm">
                Our AI analyzes your spending patterns to predict future expenses, 
                helping you budget proactively rather than reactively.
              </p>
            </div>
            
            <div className="p-4 bg-white/60 backdrop-blur rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">🧠 Behavioral Insights</h4>
              <p className="text-blue-800 text-sm">
                Advanced pattern recognition identifies your spending habits, 
                peak spending times, and suggests optimizations automatically.
              </p>
            </div>
            
            <div className="p-4 bg-white/60 backdrop-blur rounded-lg border border-green-100">
              <h4 className="font-medium text-green-900 mb-2">⚡ Auto-Categorization</h4>
              <p className="text-green-800 text-sm">
                Machine learning algorithms automatically suggest categories 
                based on expense descriptions with 95%+ accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}