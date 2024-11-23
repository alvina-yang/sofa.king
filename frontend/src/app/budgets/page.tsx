"use client";

import { useState } from "react";
import { useGlobalState } from "../context/GlobalState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { FloatingDock } from "@/components/ui/floating-dock";

export default function BudgetsPage() {
  const {
    budgetTotal,
    fetchUserData,
    categoryBudgets,
    setCategoryBudgets,
  } = useGlobalState();

  const [newBudget, setNewBudget] = useState<number | "">("");
  const [localCategoryBudgets, setLocalCategoryBudgets] = useState({
    ...categoryBudgets,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [overallSuccessMessage, setOverallSuccessMessage] = useState("");
  const [categorySuccessMessage, setCategorySuccessMessage] = useState("");
  const [isUpdatingOverall, setIsUpdatingOverall] = useState(false);
  const [isUpdatingCategories, setIsUpdatingCategories] = useState(false);

  const testimonials = [
    {
      quote: "This app is so good, it’s like discovering gravity all over again.",
      name: "Isaac Newton",
      designation: "Physicist & Mathematician",
      src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/1200px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg",
    },
    {
      quote: "The best budgeting tool since the Emancipation Proclamation.",
      name: "Abraham Lincoln",
      designation: "16th U.S. President",
      src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/800px-Abraham_Lincoln_O-77_matte_collodion_print.jpg",
    },
    {
      quote: "Budgeting as innovative as Tesla, but way less expensive.",
      name: "Elon Musk",
      designation: "Entrepreneur",
      src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Elon_Musk_Royal_Society_crop.jpg/800px-Elon_Musk_Royal_Society_crop.jpg",
    },
    {
      quote: "This app is proof the Earth revolves around budgets.",
      name: "Galileo Galilei",
      designation: "Astronomer",
      src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Galileo_Galilei_%281564-1642%29_RMG_BHC2700.tiff/lossy-page1-800px-Galileo_Galilei_%281564-1642%29_RMG_BHC2700.tiff.jpg",
    },
    {
      quote: "This app made me rethink my philosophy about finances.",
      name: "Socrates",
      designation: "Philosopher",
      src:  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/1200px-Socrate_du_Louvre.jpg",
    },
  ];

  const handleUpdateOverallBudget = async () => {
    if (!newBudget || newBudget <= 0) {
      setErrorMessage("Please enter a valid budget greater than 0.");
      return;
    }

    setIsUpdatingOverall(true);
    setErrorMessage("");
    setOverallSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/update-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyBudget: newBudget }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to update budget.");
        setIsUpdatingOverall(false);
        return;
      }

      setOverallSuccessMessage("Overall budget updated successfully!");
      await fetchUserData();
    } catch (error) {
      console.error("Error updating overall budget:", error);
      setErrorMessage("An error occurred while updating the overall budget.");
    } finally {
      setIsUpdatingOverall(false);
    }
  };

  const handleUpdateCategoryBudgets = () => {
    setIsUpdatingCategories(true);
    setCategoryBudgets(localCategoryBudgets);
    setCategorySuccessMessage("Category budgets updated successfully!");
    setIsUpdatingCategories(false);
  };

  const handleCategoryBudgetChange = (category: string, value: number) => {
    setLocalCategoryBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Modify Budgets</h1>

      <div className="flex flex-col lg:flex-row mb-20 max-w-7xl gap-4">
        {/* Left Column: Overall Budget + Testimonials */}
        <div className="flex-1">
          {/* Overall Budget Form */}
          <div className="border border-white rounded bg-black px-8 pt-6 pb-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Overall Budget</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Current Budget:{" "}
              <span className="text-yellow-500">${budgetTotal.toFixed(2)}</span>
            </p>
            <div className="mb-4">
              <Label htmlFor="newBudget">Update Monthly Budget</Label>
              <Input
                id="newBudget"
                type="number"
                step="0.01"
                placeholder="Enter new budget"
                value={newBudget}
                onChange={(e) => setNewBudget(parseFloat(e.target.value))}
                className="bg-zinc-900 text-white"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
            )}
            {overallSuccessMessage && (
              <p className="text-green-500 text-xs italic mb-4">
                {overallSuccessMessage}
              </p>
            )}
            <button
              onClick={handleUpdateOverallBudget}
              disabled={isUpdatingOverall}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {isUpdatingOverall
                ? "Updating Overall Budget..."
                : "Update Overall Budget"}
            </button>
          </div>

          {/* Animated Testimonials */}
          <AnimatedTestimonials testimonials={testimonials} autoplay />
        </div>

        {/* Right Column: Category Budgets */}
        <div className="flex-1 border border-white rounded bg-black px-8 pt-6 pb-8">
          <h2 className="text-xl font-bold mb-4">Category Budgets</h2>
          {Object.entries(localCategoryBudgets).map(([category, budget]) => (
            <div key={category} className="mb-4">
              <Label htmlFor={`budget-${category}`} className="capitalize">
                {category}
              </Label>
              <Input
                id={`budget-${category}`}
                type="number"
                step="0.01"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) =>
                  handleCategoryBudgetChange(category, parseFloat(e.target.value))
                }
                className="bg-zinc-900 text-white"
              />
            </div>
          ))}
          {categorySuccessMessage && (
            <p className="text-green-500 text-xs italic mb-4">
              {categorySuccessMessage}
            </p>
          )}
          <button
            onClick={handleUpdateCategoryBudgets}
            disabled={isUpdatingCategories}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {isUpdatingCategories
              ? "Updating Category Budgets..."
              : "Update Category Budgets"}
          </button>
        </div>
      </div>
      <FloatingDock />
    </div>
  );
}
