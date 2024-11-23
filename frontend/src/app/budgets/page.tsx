'use client';

import { useState } from 'react';
import { useGlobalState } from '../context/GlobalState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { FloatingDock } from '@/components/ui/floating-dock';

export default function BudgetsPage() {
  const {
    budgetTotal,
    fetchUserData,
    categoryBudgets,
    setCategoryBudgets,
  } = useGlobalState();

  const [newBudget, setNewBudget] = useState<number | ''>('');
  const [localCategoryBudgets, setLocalCategoryBudgets] = useState({ ...categoryBudgets });
  const [errorMessage, setErrorMessage] = useState('');
  const [overallSuccessMessage, setOverallSuccessMessage] = useState('');
  const [categorySuccessMessage, setCategorySuccessMessage] = useState('');
  const [isUpdatingOverall, setIsUpdatingOverall] = useState(false);
  const [isUpdatingCategories, setIsUpdatingCategories] = useState(false);

  const handleUpdateOverallBudget = async () => {
    if (!newBudget || newBudget <= 0) {
      setErrorMessage('Please enter a valid budget greater than 0.');
      return;
    }

    setIsUpdatingOverall(true);
    setErrorMessage('');
    setOverallSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/update-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyBudget: newBudget }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update budget.');
        setIsUpdatingOverall(false);
        return;
      }

      setOverallSuccessMessage('Overall budget updated successfully!');
      await fetchUserData();
    } catch (error) {
      console.error('Error updating overall budget:', error);
      setErrorMessage('An error occurred while updating the overall budget.');
    } finally {
      setIsUpdatingOverall(false);
    }
  };

  const handleUpdateCategoryBudgets = () => {
    setIsUpdatingCategories(true);
    setCategoryBudgets(localCategoryBudgets);
    setCategorySuccessMessage('Category budgets updated successfully!');
    setIsUpdatingCategories(false);
  };

  const handleCategoryBudgetChange = (category: string, value: number) => {
    setLocalCategoryBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const testimonials = [
    {
      quote: "I would recommend sofa.king budgeted to all of my friends. It is such a convenient tool to use!",
      name: "Isaac Newton",
      title: "Mathematician and Physicist",
    },
    {
      quote: "The best budgeting tool since sliced bread. I use it to manage all my monthly expenses!",
      name: "Abraham Lincoln",
      title: "16th President of the United States",
    },
    {
      quote: "Budgeting has never been easier. Truly revolutionary software!",
      name: "Pythagoras",
      title: "Philosopher and Mathematician",
    },
    {
      quote: "Finally, a budget app as innovative as Tesla.",
      name: "Elon Musk",
      title: "Entrepreneur and Innovator",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8">Modify Budgets</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-8 mb-20">
        {/* Overall Budget Card */}
        <div className="flex-1">
          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>Overall Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-zinc-400">
                Your current budget is: <span className="text-yellow-500">${budgetTotal.toFixed(2)}</span>
              </p>
              <div className="mt-4">
                <label className="block text-sm text-zinc-300 mb-2">Update Monthly Budget</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter new budget"
                  value={newBudget}
                  onChange={(e) => setNewBudget(parseFloat(e.target.value))}
                  className="bg-zinc-800 text-white placeholder-zinc-500"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              {overallSuccessMessage && (
                <p className="text-green-500 text-sm mt-2">{overallSuccessMessage}</p>
              )}
              <Button
                className="mt-4 bg-green-600 hover:bg-green-500 w-full"
                onClick={handleUpdateOverallBudget}
                disabled={isUpdatingOverall}
              >
                {isUpdatingOverall ? 'Updating Overall Budget...' : 'Update Overall Budget'}
              </Button>
            </CardContent>
          </Card>

          {/* Infinite Moving Testimonials */}
          <div className="mt-6 pt-8">
            <InfiniteMovingCards
              items={testimonials}
              direction="left"
              speed="slow"
              pauseOnHover
              className="max-w-md"
            />
          </div>
        </div>

        {/* Category Budgets Card */}
        <Card className="bg-zinc-900 text-white flex-1">
          <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(localCategoryBudgets).map(([category, budget]) => (
              <div key={category} className="mb-4">
                <p className="text-md text-zinc-400 capitalize">{category}</p>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter budget"
                  value={budget}
                  onChange={(e) => handleCategoryBudgetChange(category, parseFloat(e.target.value))}
                  className="bg-zinc-800 text-white placeholder-zinc-500"
                />
              </div>
            ))}
            {categorySuccessMessage && (
              <p className="text-green-500 text-sm mt-2">{categorySuccessMessage}</p>
            )}
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-500 w-full"
              onClick={handleUpdateCategoryBudgets}
              disabled={isUpdatingCategories}
            >
              {isUpdatingCategories ? 'Updating Category Budgets...' : 'Update Category Budgets'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <FloatingDock />
    </div>
  );
}
