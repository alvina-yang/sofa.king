/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGlobalState } from '@/app/context/GlobalState';

interface SubcategoryBreakdown {
  [subcategory: string]: number;
}

interface DetailedCategory {
  total: number;
  breakdown: SubcategoryBreakdown;
}

export default function CategoryPage() {
  const params = useParams();
  const category = typeof params?.category === 'string' ? params.category : undefined;
  const { categories, subcategories, setSubcategories, setCategories } = useGlobalState();
  const [currentSubcategories, setCurrentSubcategories] = useState<DetailedCategory | null>(null);
  const [fileChanged, setFileChanged] = useState(false);

  const totalCategoryBudget = 50; // Default category budget

  // Fetch updated subcategories when category changes or file changes
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
          console.error(err);
        }
      }
    };

    if (category && !subcategories[category]) {
      fetchSubcategories();
    } else if (category) {
      setCurrentSubcategories(subcategories[category]);
    }
  }, [category, subcategories, setSubcategories]);

  // Poll for file changes and update categories
  useEffect(() => {
    const checkFileChanges = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/file-changed');
        if (!response.ok) throw new Error('Failed to check file change');
        const data = await response.json();

        if (data.fileChanged) {
          setFileChanged(true);

          // Re-fetch user data
          const response = await fetch('http://localhost:5000/api/get-user-data');
          if (!response.ok) throw new Error('Failed to fetch user data');
          const userData = await response.json();

          // Update global state
          setCategories(userData.categories || {});
          setSubcategories(userData.subcategories || {});
        }
      } catch (error) {
        console.error('Error checking file changes:', error);
      }
    };

    const interval = setInterval(checkFileChanges, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [setCategories, setSubcategories]);

  const amountSpent =
    category && categories[category] !== undefined
      ? categories[category].toFixed(2)
      : '0';
  const remainingBudget = (totalCategoryBudget - parseFloat(amountSpent)).toFixed(2);
  const spentPercentage = ((parseFloat(amountSpent) / totalCategoryBudget) * 100).toFixed(2);

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
      <div className="w-full max-w-md bg-zinc-900 rounded-lg p-5">
        <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
        <div className="flex items-center">
          <span className="w-20 text-sm font-medium text-green-500">Spent</span>
          <div className="flex-grow h-4 bg-gray-800 rounded-full relative">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min(parseFloat(spentPercentage), 100)}%` }}
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
        <div className="w-full max-w-md bg-zinc-900 rounded-lg p-5 mt-6">
          <h2 className="text-xl font-bold mb-4">Breakdown</h2>
          {Object.entries(currentSubcategories.breakdown).map(([subcategory, spent], index) => {
            const subSpentPercentage = ((spent / totalCategoryBudget) * 100).toFixed(2);
            return (
              <div key={index} className="mb-4">
                <p className="text-white text-sm">
                  {subcategory} - ${spent.toFixed(2)}
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-4">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(parseFloat(subSpentPercentage), 100)}%`,
                      backgroundColor: '#1E90FF',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
