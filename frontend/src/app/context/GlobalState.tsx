'use client';

import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  Date: string;
  Merchant: string;
  Amount: number;
}

interface SubcategoryBreakdown {
  [subcategory: string]: number;
}

interface DetailedCategory {
  total: number;
  breakdown: SubcategoryBreakdown;
}

interface Insight {
  category: string;
  current_month_insight: string;
  last_month_insight: string;
  last_year_insight: string;
  general_tips: string[];
}

interface GlobalState {
  budgetTotal: number;
  setBudgetTotal: (value: number) => void;
  budgetSpent: number;
  setBudgetSpent: (value: number) => void;
  categories: { [key: string]: number };
  setCategories: (value: { [key: string]: number }) => void;
  goalMessage: string;
  setGoalMessage: (value: string) => void;
  transactions: Transaction[];
  setTransactions: (value: Transaction[]) => void;
  subcategories: { [key: string]: DetailedCategory };
  setSubcategories: (value: { [key: string]: DetailedCategory }) => void;
  insights: { [key: string]: Insight };
  setInsights: (value: { [key: string]: Insight }) => void;
}

// Create default values for the context
const defaultState: GlobalState = {
  budgetTotal: 0,
  setBudgetTotal: () => {},
  budgetSpent: 0,
  setBudgetSpent: () => {},
  categories: {},
  setCategories: () => {},
  goalMessage: '',
  setGoalMessage: () => {},
  transactions: [],
  setTransactions: () => {},
  subcategories: {},
  setSubcategories: () => {},
  insights: {},
  setInsights: () => {},
};

const GlobalStateContext = createContext<GlobalState>(defaultState);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [categories, setCategories] = useState<{ [key: string]: number }>({});
  const [goalMessage, setGoalMessage] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: string]: DetailedCategory }>({});
  const [insights, setInsights] = useState<{ [key: string]: Insight }>({});

  return (
    <GlobalStateContext.Provider
      value={{
        budgetTotal,
        setBudgetTotal,
        budgetSpent,
        setBudgetSpent,
        categories,
        setCategories,
        goalMessage,
        setGoalMessage,
        transactions,
        setTransactions,
        subcategories,
        setSubcategories,
        insights,
        setInsights,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
