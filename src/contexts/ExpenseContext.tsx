'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFormData, ExpenseFilters } from '@/types/expense';
import { storageUtils } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface ExpenseState {
  expenses: Expense[];
  filters: ExpenseFilters;
  loading: boolean;
  error: string | null;
}

type ExpenseAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: ExpenseFormData }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<Expense> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_FILTERS'; payload: ExpenseFilters }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ALL_EXPENSES' };

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: ExpenseFormData) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: ExpenseFilters) => void;
  clearAllExpenses: () => void;
  refreshExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const initialState: ExpenseState = {
  expenses: [],
  filters: {},
  loading: true,
  error: null,
};

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    
    case 'ADD_EXPENSE': {
      const newExpense: Expense = {
        id: generateId(),
        date: action.payload.date,
        amount: parseFloat(action.payload.amount),
        category: action.payload.category,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedExpenses = [...state.expenses, newExpense];
      storageUtils.saveExpenses(updatedExpenses);
      
      return { ...state, expenses: updatedExpenses };
    }
    
    case 'UPDATE_EXPENSE': {
      const updatedExpenses = state.expenses.map(expense =>
        expense.id === action.payload.id
          ? { ...expense, ...action.payload.data, updatedAt: new Date().toISOString() }
          : expense
      );
      
      storageUtils.saveExpenses(updatedExpenses);
      
      return { ...state, expenses: updatedExpenses };
    }
    
    case 'DELETE_EXPENSE': {
      const filteredExpenses = state.expenses.filter(expense => expense.id !== action.payload);
      storageUtils.saveExpenses(filteredExpenses);
      
      return { ...state, expenses: filteredExpenses };
    }
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ALL_EXPENSES':
      storageUtils.clearAllExpenses();
      return { ...state, expenses: [] };
    
    default:
      return state;
  }
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const loadExpenses = () => {
      try {
        const expenses = storageUtils.getExpenses();
        dispatch({ type: 'SET_EXPENSES', payload: expenses });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load expenses' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadExpenses();
  }, []);

  const addExpense = (expense: ExpenseFormData) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateExpense = (id: string, data: Partial<Expense>) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: { id, data } });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const setFilters = (filters: ExpenseFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearAllExpenses = () => {
    dispatch({ type: 'CLEAR_ALL_EXPENSES' });
  };

  const refreshExpenses = () => {
    const expenses = storageUtils.getExpenses();
    dispatch({ type: 'SET_EXPENSES', payload: expenses });
  };

  const value: ExpenseContextType = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    clearAllExpenses,
    refreshExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}