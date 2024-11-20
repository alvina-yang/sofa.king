/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';
import { useGlobalState } from '../context/GlobalState';
import { FloatingDock } from "@/components/ui/floating-dock";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Accounts() {
  const {
    budgetTotal,
    setBudgetTotal,
    budgetSpent,
    setBudgetSpent,
    categories,
    setCategories,
    setGoalMessage,
    transactions,
    setTransactions,
  } = useGlobalState();

  // Fetch updated user data
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get-user-data');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();

      // Update global state
      setBudgetTotal(data.monthlyBudget || 0);
      setBudgetSpent(data.totalSpent || 0);
      setCategories(data.categories || {});
      setGoalMessage(data.goalMessage || '');
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Poll for file changes
  const checkFileChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/file-changed');
      if (!response.ok) throw new Error('Failed to check file change');
      const data = await response.json();
      if (data.fileChanged) {
        await fetchUserData(); // Refresh data on file change
      }
    } catch (error) {
      console.error('Error checking file changes:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Initial fetch
    const interval = setInterval(checkFileChanges, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Calculate percentage spent, capping at 100%
  const spentPercentage = budgetTotal
    ? Math.min((budgetSpent / budgetTotal) * 100, 100).toFixed(2)
    : '0';

  // Set earnings and remaining balance
  const earnings = 10000; // Example total earnings
  const remainingBalance = (earnings - budgetSpent).toFixed(2); // Remaining balance in the bank account

  // Prepare transaction data for the chart
  const chartData = transactions.map((transaction) => ({
    date: transaction.Date,
    amount: transaction.Amount,
  }));

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6">
      <h1 className="text-xl font-bold mb-4">My Cashflow for November</h1>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-4">
        {/* Left Column */}
        <div className="flex flex-col w-full lg:w-2/3 gap-4">
          {/* Top Section */}
          <div className="bg-zinc-900 rounded-lg p-5">
            {/* Bars Section */}
            <div className="mb-4">
              {/* Spent Bar */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center">
                  <span className="w-20 text-sm font-medium text-red-500">Spent</span>
                  <div className="flex-grow h-4 bg-gray-800 rounded-full relative">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${spentPercentage}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-sm font-medium text-red-500 text-right">
                    {spentPercentage}%
                  </span>
                </div>
                <p className="text-sm text-zinc-400 text-center mt-2">
                  ${budgetSpent.toFixed(2)} out of ${budgetTotal.toFixed(2)} spent
                </p>
              </div>

              {/* Earnings Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <span className="w-20 text-sm font-medium text-green-500">Earned</span>
                  <div className="flex-grow h-4 bg-gray-800 rounded-full relative">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(earnings / 10000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-sm font-medium text-green-500 text-right">
                    {(earnings / 10000) * 100}%
                  </span>
                </div>
                <p className="text-sm text-zinc-400 text-center mt-2">
                  ${earnings.toFixed(2)} earned this month
                </p>
              </div>
            </div>

            {/* Remaining Balance */}
            <div className="text-2xl font-bold text-center">
              ${remainingBalance} remaining balance in bank account
            </div>
          </div>

          {/* Chart Section */}
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-xl text-zinc-300">Daily Spending for November</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={chartData}
                width={600}
                height={300}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(-2)} // Show only day of the month
                  tick={{ fill: "#fff" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#fff" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#27272a" }} // zinc-300
                  labelStyle={{ color: "#a1a1aa" }}
                  itemStyle={{ color: "#a1a1aa" }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#1E90FF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </CardContent>
          </Card>
        </div>

       {/* Right Column - Categories */}
       <div className="w-full lg:w-1/3 bg-zinc-900 rounded-lg p-5 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <div className="flex flex-col gap-2 overflow-y-auto h-full">
            {Object.keys(categories).map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-700"
              >
                <span className="text-md font-medium">{category}</span>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Dock */}
      <div className="mt-6 mb-2">
        <FloatingDock />
      </div>
    </div>
  );
}
