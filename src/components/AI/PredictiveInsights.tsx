'use client';

import React from 'react';
import { Brain, TrendingUp, Target, Clock, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ExpenseAIEngine, PredictedExpense, BehaviorInsight } from '@/lib/aiEngine';
import { useExpenses } from '@/contexts/ExpenseContext';

export default function PredictiveInsights() {
  const { expenses } = useExpenses();
  const aiEngine = React.useMemo(() => new ExpenseAIEngine(expenses), [expenses]);

  const predictions = React.useMemo(() => aiEngine.predictUpcomingExpenses(), [aiEngine]);
  const insights = React.useMemo(() => aiEngine.analyzeSpendingBehavior(), [aiEngine]);

  const getInsightIcon = (type: BehaviorInsight['type']) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTypeIcon = (type: PredictedExpense['type']) => {
    switch (type) {
      case 'routine': return <Clock className="h-4 w-4" />;
      case 'recurring': return <Target className="h-4 w-4" />;
      case 'contextual': return <TrendingUp className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">AI Expense Assistant</h2>
            <p className="text-purple-100">Intelligent predictions powered by your spending patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {expenses.length} expenses analyzed
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {predictions.length} active predictions
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Predictions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Predicted Expenses</h3>
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Add more expenses to unlock AI predictions!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(prediction.type)}
                      <span className="font-medium text-gray-800">{prediction.description}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(prediction.confidence)}`}>
                      {Math.round(prediction.confidence * 100)}% confident
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{prediction.category}</span>
                      <span>${prediction.estimatedAmount.toFixed(2)}</span>
                    </span>
                    <span className="text-purple-600">{prediction.timeframe}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">{prediction.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Behavior Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
          </div>

          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Building your spending profile...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                        {insight.actionable && (
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 text-xs rounded-full">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}