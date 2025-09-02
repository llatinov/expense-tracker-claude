import { Expense, ExpenseCategory } from '@/types/expense';
import { format, isWeekend, getHours, differenceInDays, parseISO } from 'date-fns';

// AI Engine for predictive expense tracking
export class ExpenseAIEngine {
  private expenses: Expense[] = [];

  constructor(expenses: Expense[] = []) {
    this.expenses = expenses;
  }

  updateData(expenses: Expense[]) {
    this.expenses = expenses;
  }

  // Predict likely upcoming expenses based on patterns
  predictUpcomingExpenses(): PredictedExpense[] {
    if (this.expenses.length < 5) {
      return this.getDefaultPredictions();
    }

    const patterns = this.analyzeSpendingPatterns();
    const predictions: PredictedExpense[] = [];

    // Daily routine predictions
    const dailyPredictions = this.predictDailyRoutine();
    predictions.push(...dailyPredictions);

    // Weekly pattern predictions
    const weeklyPredictions = this.predictWeeklyPatterns();
    predictions.push(...weeklyPredictions);

    // Monthly recurring predictions
    const monthlyPredictions = this.predictMonthlyRecurring();
    predictions.push(...monthlyPredictions);

    // Seasonal/contextual predictions
    const contextualPredictions = this.predictContextualExpenses();
    predictions.push(...contextualPredictions);

    return predictions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8); // Top 8 predictions
  }

  // Intelligent auto-categorization based on description patterns
  suggestCategory(description: string): CategorySuggestion {
    const desc = description.toLowerCase().trim();
    
    // ML-inspired keyword matching with confidence scoring
    const categoryPatterns: Record<ExpenseCategory, { keywords: string[]; patterns: RegExp[] }> = {
      'Food': {
        keywords: ['restaurant', 'cafe', 'pizza', 'burger', 'lunch', 'dinner', 'breakfast', 'grocery', 'starbucks', 'mcdonalds', 'food', 'eat', 'meal', 'snack', 'coffee'],
        patterns: [/\b(eat|food|meal|restaurant|cafe|pizza|burger|lunch|dinner|breakfast|grocery|coffee)\b/i]
      },
      'Transportation': {
        keywords: ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'parking', 'metro', 'transit', 'car', 'vehicle', 'transport'],
        patterns: [/\b(gas|fuel|uber|lyft|taxi|bus|train|parking|metro|transit)\b/i]
      },
      'Entertainment': {
        keywords: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'show', 'theater', 'entertainment', 'fun', 'hobby'],
        patterns: [/\b(movie|cinema|netflix|spotify|game|concert|show|theater|entertainment)\b/i]
      },
      'Shopping': {
        keywords: ['amazon', 'store', 'shop', 'buy', 'purchase', 'retail', 'clothing', 'shoes', 'electronics', 'book'],
        patterns: [/\b(amazon|store|shop|buy|purchase|retail|clothing|shoes|electronics|book)\b/i]
      },
      'Bills': {
        keywords: ['electric', 'water', 'internet', 'phone', 'rent', 'insurance', 'bill', 'utility', 'subscription', 'payment'],
        patterns: [/\b(electric|water|internet|phone|rent|insurance|bill|utility|subscription|payment)\b/i]
      },
      'Other': {
        keywords: ['misc', 'other', 'various', 'unknown'],
        patterns: [/\b(misc|other|various|unknown)\b/i]
      }
    };

    let bestMatch: { category: ExpenseCategory; confidence: number } = { category: 'Other', confidence: 0.1 };

    Object.entries(categoryPatterns).forEach(([category, { keywords, patterns }]) => {
      let score = 0;
      
      // Keyword matching
      keywords.forEach(keyword => {
        if (desc.includes(keyword)) {
          score += keyword.length / desc.length; // More specific keywords get higher scores
        }
      });

      // Pattern matching
      patterns.forEach(pattern => {
        if (pattern.test(desc)) {
          score += 0.3;
        }
      });

      if (score > bestMatch.confidence) {
        bestMatch = { category: category as ExpenseCategory, confidence: Math.min(score, 0.95) };
      }
    });

    return {
      category: bestMatch.category,
      confidence: bestMatch.confidence,
      alternatives: this.getAlternativeCategories(desc, bestMatch.category)
    };
  }

  // Analyze spending behavior and provide insights
  analyzeSpendingBehavior(): BehaviorInsight[] {
    const insights: BehaviorInsight[] = [];

    if (this.expenses.length < 3) {
      return [{
        type: 'info',
        title: 'Building Your Profile',
        message: 'Add more expenses to unlock AI-powered insights and predictions!',
        confidence: 1.0,
        actionable: true
      }];
    }

    // Time-based spending patterns
    const timeInsights = this.analyzeTimePatterns();
    insights.push(...timeInsights);

    // Category distribution insights
    const categoryInsights = this.analyzeCategoryDistribution();
    insights.push(...categoryInsights);

    // Spending velocity insights
    const velocityInsights = this.analyzeSpendingVelocity();
    insights.push(...velocityInsights);

    // Anomaly detection
    const anomalies = this.detectSpendingAnomalies();
    insights.push(...anomalies);

    return insights
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
  }

  // Generate smart expense suggestions based on context
  generateSmartSuggestions(context: ExpenseContext = {}): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const now = new Date();
    const hour = getHours(now);
    const isWknd = isWeekend(now);

    // Time-based suggestions
    if (hour >= 7 && hour <= 10) {
      suggestions.push({
        type: 'time-based',
        description: 'Morning coffee or breakfast',
        estimatedAmount: this.getAverageAmount('Food', 'morning') || 8,
        category: 'Food',
        confidence: 0.7,
        reasoning: 'Common morning expense pattern detected'
      });
    }

    if (hour >= 12 && hour <= 14) {
      suggestions.push({
        type: 'time-based',
        description: 'Lunch expense',
        estimatedAmount: this.getAverageAmount('Food', 'lunch') || 12,
        category: 'Food',
        confidence: 0.8,
        reasoning: 'Typical lunch time spending'
      });
    }

    if (isWknd && hour >= 19) {
      suggestions.push({
        type: 'contextual',
        description: 'Weekend dinner or entertainment',
        estimatedAmount: this.getAverageAmount('Entertainment', 'weekend') || 25,
        category: 'Entertainment',
        confidence: 0.6,
        reasoning: 'Weekend evening activity pattern'
      });
    }

    // Pattern-based suggestions
    const patternSuggestions = this.getPatternBasedSuggestions();
    suggestions.push(...patternSuggestions);

    return suggestions.slice(0, 4);
  }

  private analyzeSpendingPatterns(): SpendingPattern[] {
    // Analyze temporal patterns, frequency, amounts, etc.
    const patterns: SpendingPattern[] = [];
    
    // Group by day of week
    const dayPatterns = this.groupExpensesByDay();
    patterns.push(...dayPatterns);

    // Group by category and time
    const categoryTimePatterns = this.groupExpensesByCategoryTime();
    patterns.push(...categoryTimePatterns);

    return patterns;
  }

  private predictDailyRoutine(): PredictedExpense[] {
    const now = new Date();
    const hour = getHours(now);
    const predictions: PredictedExpense[] = [];

    // Morning routine predictions
    if (hour >= 6 && hour <= 10) {
      const morningExpenses = this.expenses.filter(e => {
        const expHour = getHours(parseISO(e.date));
        return expHour >= 6 && expHour <= 10;
      });

      if (morningExpenses.length > 0) {
        predictions.push({
          description: 'Morning coffee/breakfast',
          estimatedAmount: this.calculateAverageAmount(morningExpenses),
          category: 'Food',
          confidence: 0.8,
          reasoning: 'Based on your morning routine pattern',
          timeframe: 'today',
          type: 'routine'
        });
      }
    }

    return predictions;
  }

  private predictWeeklyPatterns(): PredictedExpense[] {
    // Analyze weekly patterns and predict based on day of week
    const predictions: PredictedExpense[] = [];
    const now = new Date();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 5 || dayOfWeek === 6) { // Weekend
      const weekendExpenses = this.expenses.filter(e => {
        const expDay = parseISO(e.date).getDay();
        return expDay === 5 || expDay === 6 || expDay === 0;
      });

      if (weekendExpenses.length > 0) {
        predictions.push({
          description: 'Weekend entertainment or dining',
          estimatedAmount: this.calculateAverageAmount(weekendExpenses),
          category: 'Entertainment',
          confidence: 0.6,
          reasoning: 'Weekend spending pattern detected',
          timeframe: 'this weekend',
          type: 'weekly'
        });
      }
    }

    return predictions;
  }

  private predictMonthlyRecurring(): PredictedExpense[] {
    // Analyze monthly recurring expenses
    const predictions: PredictedExpense[] = [];
    const billKeywords = ['rent', 'insurance', 'subscription', 'bill', 'utility'];
    
    const recurringExpenses = this.expenses.filter(expense => 
      billKeywords.some(keyword => 
        expense.description.toLowerCase().includes(keyword)
      )
    );

    if (recurringExpenses.length > 0) {
      predictions.push({
        description: 'Monthly bills and subscriptions',
        estimatedAmount: this.calculateAverageAmount(recurringExpenses),
        category: 'Bills',
        confidence: 0.9,
        reasoning: 'Recurring monthly expense pattern',
        timeframe: 'this month',
        type: 'recurring'
      });
    }

    return predictions;
  }

  private predictContextualExpenses(): PredictedExpense[] {
    // Context-aware predictions (weather, events, etc.)
    const predictions: PredictedExpense[] = [];
    
    // Gas station predictions based on transportation history
    const transportExpenses = this.expenses.filter(e => e.category === 'Transportation');
    if (transportExpenses.length > 0) {
      const avgDaysBetween = this.calculateAverageInterval(transportExpenses);
      const lastTransport = transportExpenses[transportExpenses.length - 1];
      const daysSinceLastTransport = differenceInDays(new Date(), parseISO(lastTransport.date));
      
      if (daysSinceLastTransport >= avgDaysBetween * 0.8) {
        predictions.push({
          description: 'Fuel or transportation expense',
          estimatedAmount: this.calculateAverageAmount(transportExpenses),
          category: 'Transportation',
          confidence: 0.7,
          reasoning: 'Based on your transportation expense cycle',
          timeframe: 'soon',
          type: 'contextual'
        });
      }
    }

    return predictions;
  }

  private getDefaultPredictions(): PredictedExpense[] {
    return [
      {
        description: 'Morning coffee',
        estimatedAmount: 5,
        category: 'Food',
        confidence: 0.5,
        reasoning: 'Common daily expense',
        timeframe: 'today',
        type: 'default'
      },
      {
        description: 'Lunch',
        estimatedAmount: 12,
        category: 'Food',
        confidence: 0.6,
        reasoning: 'Typical midday expense',
        timeframe: 'today',
        type: 'default'
      },
      {
        description: 'Gas/Transportation',
        estimatedAmount: 35,
        category: 'Transportation',
        confidence: 0.4,
        reasoning: 'Weekly transportation need',
        timeframe: 'this week',
        type: 'default'
      }
    ];
  }

  private getAlternativeCategories(description: string, primaryCategory: ExpenseCategory): ExpenseCategory[] {
    // Return alternative categories based on description ambiguity
    const alternatives: ExpenseCategory[] = [];
    const allCategories: ExpenseCategory[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];
    
    return allCategories.filter(cat => cat !== primaryCategory).slice(0, 2);
  }

  private analyzeTimePatterns(): BehaviorInsight[] {
    const insights: BehaviorInsight[] = [];
    
    const hourDistribution = this.expenses.reduce((acc, expense) => {
      const hour = getHours(parseISO(expense.date));
      const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      acc[period] = (acc[period] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topPeriod = Object.entries(hourDistribution)
      .sort(([,a], [,b]) => b - a)[0];

    if (topPeriod) {
      insights.push({
        type: 'insight',
        title: 'Peak Spending Time',
        message: `You spend most during the ${topPeriod[0]} (${Math.round(topPeriod[1])}% of total)`,
        confidence: 0.8,
        actionable: true
      });
    }

    return insights;
  }

  private analyzeCategoryDistribution(): BehaviorInsight[] {
    const insights: BehaviorInsight[] = [];
    
    const categoryTotals = this.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
      const percentage = Math.round((topCategory[1] / total) * 100);
      
      insights.push({
        type: 'warning',
        title: 'Top Spending Category',
        message: `${percentage}% of your spending goes to ${topCategory[0]}`,
        confidence: 0.9,
        actionable: percentage > 50
      });
    }

    return insights;
  }

  private analyzeSpendingVelocity(): BehaviorInsight[] {
    const insights: BehaviorInsight[] = [];
    
    if (this.expenses.length < 7) return insights;

    const recentExpenses = this.expenses.slice(-7);
    const olderExpenses = this.expenses.slice(-14, -7);
    
    const recentTotal = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const olderTotal = olderExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const change = ((recentTotal - olderTotal) / olderTotal) * 100;
    
    if (Math.abs(change) > 20) {
      insights.push({
        type: change > 0 ? 'warning' : 'success',
        title: 'Spending Trend',
        message: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.round(Math.abs(change))}% this week`,
        confidence: 0.7,
        actionable: change > 0
      });
    }

    return insights;
  }

  private detectSpendingAnomalies(): BehaviorInsight[] {
    const insights: BehaviorInsight[] = [];
    
    if (this.expenses.length < 10) return insights;

    const amounts = this.expenses.map(e => e.amount);
    const avg = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sum, amount) => sum + Math.pow(amount - avg, 2), 0) / amounts.length);
    
    const recentAnomalies = this.expenses.slice(-5).filter(expense => 
      Math.abs(expense.amount - avg) > stdDev * 2
    );

    if (recentAnomalies.length > 0) {
      insights.push({
        type: 'info',
        title: 'Unusual Spending Detected',
        message: `${recentAnomalies.length} recent expense(s) significantly differ from your usual pattern`,
        confidence: 0.8,
        actionable: false
      });
    }

    return insights;
  }

  private getPatternBasedSuggestions(): SmartSuggestion[] {
    return []; // Implementation would analyze historical patterns for suggestions
  }

  private getAverageAmount(category: ExpenseCategory, context?: string): number | null {
    const filteredExpenses = this.expenses.filter(e => e.category === category);
    if (filteredExpenses.length === 0) return null;
    
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / filteredExpenses.length;
  }

  private groupExpensesByDay(): SpendingPattern[] {
    return []; // Implementation for day-based pattern analysis
  }

  private groupExpensesByCategoryTime(): SpendingPattern[] {
    return []; // Implementation for category-time pattern analysis
  }

  private calculateAverageAmount(expenses: Expense[]): number {
    if (expenses.length === 0) return 0;
    return expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
  }

  private calculateAverageInterval(expenses: Expense[]): number {
    if (expenses.length < 2) return 7; // Default to weekly
    
    const sortedExpenses = expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let totalDays = 0;
    
    for (let i = 1; i < sortedExpenses.length; i++) {
      const days = differenceInDays(parseISO(sortedExpenses[i].date), parseISO(sortedExpenses[i-1].date));
      totalDays += days;
    }
    
    return totalDays / (sortedExpenses.length - 1);
  }
}

// Type definitions for AI predictions and insights
export interface PredictedExpense {
  description: string;
  estimatedAmount: number;
  category: ExpenseCategory;
  confidence: number; // 0-1 scale
  reasoning: string;
  timeframe: string; // 'today', 'this week', 'this month', etc.
  type: 'routine' | 'weekly' | 'monthly' | 'recurring' | 'contextual' | 'default';
}

export interface CategorySuggestion {
  category: ExpenseCategory;
  confidence: number;
  alternatives: ExpenseCategory[];
}

export interface BehaviorInsight {
  type: 'info' | 'warning' | 'success' | 'insight';
  title: string;
  message: string;
  confidence: number;
  actionable: boolean;
}

export interface SmartSuggestion {
  type: 'time-based' | 'pattern-based' | 'contextual' | 'predictive';
  description: string;
  estimatedAmount: number;
  category: ExpenseCategory;
  confidence: number;
  reasoning: string;
}

export interface ExpenseContext {
  location?: string;
  weather?: string;
  timeOfDay?: string;
  dayOfWeek?: number;
}

export interface SpendingPattern {
  type: string;
  frequency: number;
  avgAmount: number;
  confidence: number;
}