/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGlobalState } from '@/app/context/GlobalState';
import { FloatingDock } from '@/components/ui/floating-dock';

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

export default function CategoryPage() {
  const params = useParams();
  const category = typeof params?.category === 'string' ? params.category : undefined;
  const {
    categories,
    subcategories,
    setSubcategories,
    insights,
    setInsights,
  } = useGlobalState();
  const [currentSubcategories, setCurrentSubcategories] = useState<DetailedCategory | null>(null);
  const [currentInsights, setCurrentInsights] = useState<Insight | null>(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [spentPercentage, setSpentPercentage] = useState(0);
  const [subSpentPercentages, setSubSpentPercentages] = useState<{ [key: string]: number }>({});

  const totalCategoryBudget = 50; // Default category budget

  // Fetch subcategories for the selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category) {
        try {
          const response = await fetch(`http://localhost:5000/api/get-subcategories/${category}`);
          if (!response.ok) throw new Error('Failed to fetch subcategories');
          const data: DetailedCategory = await response.json();

          setSubcategories((prev) => ({ ...prev, [category]: data }));
          setCurrentSubcategories(data);
        } catch (err) {
          console.error(`Error fetching subcategories for ${category}:`, err);
        }
      }
    };

    if (category && !subcategories[category]) {
      fetchSubcategories();
    } else if (category) {
      setCurrentSubcategories(subcategories[category]);
    }
  }, [category, subcategories, setSubcategories]);

  // Fetch insights for the selected category
  useEffect(() => {
    const fetchInsights = async () => {
      if (category) {
        try {
          const response = await fetch(`http://localhost:5000/api/get-insights/${category}`);
          if (!response.ok) throw new Error('Failed to fetch insights');
          const data: Insight = await response.json();

          setInsights((prev) => ({ ...prev, [category]: data }));
          setCurrentInsights(data);
        } catch (err) {
          console.error(`Error fetching insights for ${category}:`, err);
        }
      }
    };

    if (category && !insights[category]) {
      fetchInsights();
    } else if (category) {
      setCurrentInsights(insights[category]);
    }
  }, [category, insights, setInsights]);

  // Poll for file changes and update subcategories and insights
  useEffect(() => {
    const checkFileChanges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/file-changed');
        if (!response.ok) throw new Error('Failed to check file change');
        const data = await response.json();

        if (data.fileChanged) {
          setFileChanged(true);
        }
      } catch (error) {
        console.error('Error checking file changes:', error);
      }
    };

    const interval = setInterval(checkFileChanges, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [category]);

  // Update animations for percentages
  useEffect(() => {
    if (category && categories[category] !== undefined) {
      const amountSpent = categories[category];
      const percentage = Math.min((amountSpent / totalCategoryBudget) * 100, 100);
      setSpentPercentage(percentage);

      if (currentSubcategories) {
        const percentages = Object.entries(currentSubcategories.breakdown).reduce(
          (acc, [subcategory, spent]) => {
            acc[subcategory] = Math.min((spent / totalCategoryBudget) * 100, 100);
            return acc;
          },
          {} as { [key: string]: number }
        );
        setSubSpentPercentages(percentages);
      }
    }
  }, [categories, currentSubcategories, category]);

  const amountSpent =
    category && categories[category] !== undefined ? categories[category].toFixed(2) : '0';
  const remainingBudget = (totalCategoryBudget - parseFloat(amountSpent)).toFixed(2);

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-xl font-bold">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">{category}</h1>
      <div className="flex flex-col lg:flex-row w-full max-w-4xl">
        {/* Left Column */}
        <div className="w-full lg:w-1/2">
          <div className="bg-zinc-900 rounded-lg p-5">
            {/* Budget Overview */}
            <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
            <div className="flex items-center">
              <span className="w-20 text-sm font-medium text-green-500">Spent</span>
              <div className="flex-grow h-4 bg-gray-800 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${spentPercentage}%` }}
                ></div>
              </div>
              <span className="w-16 text-sm font-medium text-green-500 text-right">
                ${amountSpent}
              </span>
            </div>
            <p className="text-sm text-zinc-400 text-center mt-4">
              You have spent <span className="text-green-500">${amountSpent}</span> out of your
              <span className="text-yellow-500"> ${totalCategoryBudget}</span> budget for this category.
            </p>
            <p className="text-sm text-zinc-400 text-center mt-2">
              Remaining budget: <span className="text-red-500">${remainingBudget}</span>
            </p>
          </div>

          {currentSubcategories && (
            <div className="bg-zinc-900 rounded-lg p-5 mt-6">
              {/* Breakdown */}
              <h2 className="text-xl font-bold mb-4">Breakdown</h2>
              {Object.entries(currentSubcategories.breakdown).map(([subcategory, spent], index) => (
                <div key={index} className="mb-4">
                  <p className="text-white text-sm">
                    {subcategory} - ${spent.toFixed(2)}
                  </p>
                  <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${subSpentPercentages[subcategory] || 0}%`,
                        backgroundColor: '#1E90FF',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        {currentInsights && (
          <div className="w-full lg:w-1/2 lg:ml-6 mt-6 lg:mt-0 bg-zinc-900 rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4">Insights</h2>
            <div className="mb-4">
              <p className="text-white text-sm font-semibold">This Month&apos;s Insight:</p>
              <p className="text-zinc-400 text-sm">{currentInsights.current_month_insight}</p>
            </div>
            <div className="mb-4">
              <p className="text-white text-sm font-semibold">Last Month&apos;s Insight:</p>
              <p className="text-zinc-400 text-sm">{currentInsights.last_month_insight}</p>
            </div>
            <div className="mb-4">
              <p className="text-white text-sm font-semibold">Last Year&apos;s Insight:</p>
              <p className="text-zinc-400 text-sm">{currentInsights.last_year_insight}</p>
            </div>
            <div className="mb-4">
              <p className="text-white text-sm font-semibold">General Tips:</p>
              <ul className="list-disc list-inside text-zinc-400 text-sm">
                {currentInsights.general_tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <FloatingDock />
    </div>
  );
}
