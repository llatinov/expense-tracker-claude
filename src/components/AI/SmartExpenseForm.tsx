'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Wand2, Target, Check, X } from 'lucide-react';
import { ExpenseAIEngine, CategorySuggestion, SmartSuggestion } from '@/lib/aiEngine';
import { ExpenseFormData } from '@/types/expense';
import { useExpenses } from '@/contexts/ExpenseContext';

interface SmartExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function SmartExpenseForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Add Expense' 
}: SmartExpenseFormProps) {
  const { expenses } = useExpenses();
  const aiEngine = React.useMemo(() => new ExpenseAIEngine(expenses), [expenses]);

  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });

  const [categorySuggestion, setCategorySuggestion] = useState<CategorySuggestion | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get AI suggestions when component mounts
  useEffect(() => {
    const suggestions = aiEngine.generateSmartSuggestions();
    setSmartSuggestions(suggestions);
  }, [aiEngine]);

  // Auto-suggest category when description changes
  useEffect(() => {
    if (formData.description.length > 2) {
      const suggestion = aiEngine.suggestCategory(formData.description);
      setCategorySuggestion(suggestion);
    } else {
      setCategorySuggestion(null);
    }
  }, [formData.description, aiEngine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const applySuggestion = (suggestion: SmartSuggestion) => {
    setFormData(prev => ({
      ...prev,
      description: suggestion.description,
      amount: suggestion.estimatedAmount.toString(),
      category: suggestion.category
    }));
    setShowAISuggestions(false);
  };

  const acceptCategorySuggestion = () => {
    if (categorySuggestion) {
      setFormData(prev => ({ ...prev, category: categorySuggestion.category }));
      setCategorySuggestion(null);
    }
  };

  const isValid = formData.date && formData.amount && formData.description.trim();

  return (
    <div className="max-w-2xl mx-auto">
      {/* AI Smart Suggestions */}
      {showAISuggestions && smartSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">AI Expense Suggestions</h3>
            <button
              onClick={() => setShowAISuggestions(false)}
              className="ml-auto p-1 hover:bg-white/50 rounded"
            >
              <X className="h-4 w-4 text-purple-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {smartSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="text-left p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-gray-800">{suggestion.description}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">${suggestion.estimatedAmount.toFixed(2)}</span>
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{suggestion.reasoning}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Smart Expense Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What did you spend money on?"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              {categorySuggestion && categorySuggestion.confidence > 0.5 && (
                <button
                  type="button"
                  onClick={acceptCategorySuggestion}
                  className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors"
                >
                  <Wand2 className="h-3 w-3" />
                  AI suggests: {categorySuggestion.category}
                  <span className="text-xs">({Math.round(categorySuggestion.confidence * 100)}%)</span>
                </button>
              )}
            </div>
            
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Food">🍽️ Food</option>
              <option value="Transportation">🚗 Transportation</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">📄 Bills</option>
              <option value="Other">📝 Other</option>
            </select>

            {categorySuggestion && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-800">AI Category Suggestion</span>
                </div>
                <p className="text-sm text-blue-600">
                  Based on your description, this looks like <strong>{categorySuggestion.category}</strong>
                  {' '}(confidence: {Math.round(categorySuggestion.confidence * 100)}%)
                </p>
                {categorySuggestion.alternatives.length > 0 && (
                  <p className="text-xs text-blue-500 mt-1">
                    Other possibilities: {categorySuggestion.alternatives.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}