'use client';

import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  Date: string;
  Merchant: string;
  Amount: number;
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
};

const GlobalStateContext = createContext<GlobalState>(defaultState);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [categories, setCategories] = useState<{ [key: string]: number }>({});
  const [goalMessage, setGoalMessage] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
