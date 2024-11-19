'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { FloatingDock } from "@/components/ui/floating-dock";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [goalMessage, setGoalMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const colors = ['#FFA500', '#6A5ACD', '#FF69B4', '#32CD32', '#FF4500'];

  // Fetch transaction analysis data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transaction-analysis');
      if (!response.ok) throw new Error('Failed to fetch transaction data');
      
      const data = await response.json();
      setBudgetSpent(data.total);
      setCategories(data.categories);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  // Fetch user budget and goal data
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get-user-data');
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setBudgetTotal(data.monthlyBudget);
      setGoalMessage(data.goalMessage);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Refetch data after new transaction is added
  const refreshData = async () => {
    await fetchData();
    await fetchUserData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Prepare data for the donut chart
  const categoryLabels = Object.keys(categories || {});
  const categoryValues = Object.values(categories || {}).map((value) => value * budgetSpent);

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Spending',
        data: categoryValues,
        backgroundColor: colors.slice(0, categoryLabels.length),
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  // Animated widths for category bars
  const [filledWidths, setFilledWidths] = useState(
    Object.values(categories).map(() => '0%')
  );

  useEffect(() => {
    setFilledWidths(Object.values(categories).map((percentage) => `${(percentage * 100).toFixed(2)}%`));
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black">
      {/* Main Content */}
      <div className="flex flex-grow w-full p-6 gap-6">
        {/* Donut Chart Section */}
        <div className="w-full lg:w-1/2 bg-zinc-900 p-8 rounded-lg shadow-md relative">
          <div className="flex justify-center mb-4">
            <FontAwesomeIcon icon={faSmile} className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-center text-white">My Spending</h1>
          <p className="text-center text-zinc-400 text-base">{goalMessage}</p>
          <div className="mt-6 mb-6 flex justify-center">
            <div className="w-full max-w-md">
              <Pie data={data} />
              <div className="absolute inset-0 mt-8 flex items-center justify-center">
                <div className="text-center mt-8 text-white">
                  <p className="text-base mt-8 font-semibold">Budget Spent</p>
                  <p className="text-5xl font-bold">${budgetSpent.toFixed(2)}</p>
                  <p>out of ${budgetTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Section */}
        <div className="w-full lg:w-1/2 bg-zinc-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Category Breakdown</h2>
          {Object.entries(categories).map(([category, percentage], index) => (
            <div key={index} className="mb-4">
              <p className="text-white text-sm">{category} - {(percentage * 100).toFixed(0)}% of total spending</p>
              <div className="w-full bg-zinc-800 rounded-full h-4">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: filledWidths[index],
                    backgroundColor: colors[index % colors.length],
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Dock Navigation */}
      <FloatingDock
        onUpdateData={refreshData} // Ensure data refresh after adding a transaction
      />
    </div>
  );
}
