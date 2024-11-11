'use client'; 

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { FloatingDock } from "@/components/ui/floating-dock";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // Dynamic constants
  const budgetSpent = 4672.89;
  const budgetTotal = 6000.00;
  const remaining = budgetTotal - budgetSpent;
  const amountAwayFromCar = `$${remaining.toFixed(2)} away from buying a new car`;

  // Category data
  const categories = {
    'Entertainment': 0.23,
    'Transportation': 0.38,
    'Food & Groceries': 0.24,
    'School Materials & Tuition': 0.58,
    'Rent & Utilities': 0.75,
  };

  // Colors for both donut chart and progress bars
  const colors = ['#FFA500', '#6A5ACD', '#FF69B4', '#32CD32', '#FF4500'];

  // Prepare data for donut chart
  const categoryLabels = Object.keys(categories);
  const categoryValues = Object.values(categories).map((value) => value * budgetSpent);

  // Donut chart data
  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Spending',
        data: categoryValues,
        backgroundColor: colors,
        borderWidth: 0,
        cutout: '70%', // Adjusted cutout size to make the chart larger
      },
    ],
  };

  // State to control animation of progress bars
  const [filledWidths, setFilledWidths] = useState(
    Object.values(categories).map(() => "0%") // Start with all widths at 0%
  );

  useEffect(() => {
    // Animate the progress bars after component mounts
    const timeoutId = setTimeout(() => {
      setFilledWidths(Object.values(categories).map((percentage) => `${percentage * 100}%`));
    }, 200); // Delay for a smoother effect

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black">
      {/* Main Content */}
      <div className="flex flex-grow w-full p-6 gap-6"> 
        {/* Donut Chart */}
        <div className="w-full lg:w-1/2 bg-zinc-900 p-8 rounded-lg shadow-md relative"> 
          <div className="flex justify-center mb-4"> 
            <FontAwesomeIcon icon={faSmile} className="text-white text-xl" /> 
          </div>

          <h1 className="text-2xl font-bold text-center text-white">My Spending for September</h1> 
          <p className="text-center text-zinc-400 text-base">{amountAwayFromCar}</p> 

          <div className="mt-6 mb-6 flex justify-center"> 
            <div className="w-full max-w-md"> 
              <Pie data={data} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center mt-5 text-white">
                  <p className="text-base font-semibold">Budget Spent</p> 
                  <p className="text-5xl font-bold">${budgetSpent.toFixed(2)}</p> 
                  <p>out of ${budgetTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="w-full lg:w-1/2 bg-zinc-900 p-6 rounded-lg shadow-md"> 
          <h2 className="text-xl font-bold text-white mb-4">Category Breakdown</h2> 
          {Object.entries(categories).map(([category, percentage], index) => (
            <div key={index} className="mb-4 mt-5"> 
              <p className="text-white text-sm">{category} - {(percentage * 100).toFixed(0)}% of total spending</p> {/* Adjusted text size */}
              <div className="w-full bg-zinc-800 rounded-full h-4"> {/* Adjusted height */}
                <div
                  className="h-full mt-6 rounded-full transition-all duration-1000" 
                  style={{
                    width: filledWidths[index], 
                    backgroundColor: colors[index], 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Dock Navigation */}
      <FloatingDock />
    </div>
  );
}