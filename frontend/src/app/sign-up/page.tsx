"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../context/GlobalState";
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input"; 
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    preferredCurrency: "",
    monthlyBudget: "",
    shortTermGoal: "",
    shortTermTimeframe: "",
    longTermGoal: "",
    longTermTimeframe: "",
    agreeTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { setBudgetTotal, setGoalMessage, setBudgetSpent, setCategories, setTransactions } =
    useGlobalState();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyBudget: formData.monthlyBudget,
          shortTermGoal: formData.shortTermGoal,
          longTermGoal: formData.longTermGoal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBudgetTotal(parseFloat(data.monthlyBudget));
        setGoalMessage(data.goalMessage);
        setBudgetSpent(data.totalSpent);
        setCategories(data.categories);
        setTransactions(data.transactions);
        router.push("/dashboard");
      } else {
        setError(data.error || "An error occurred while signing up.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("An error occurred while signing up.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up for Sofa.King</h1>
      <form
        onSubmit={handleSignUp}
        className="border border-white z-10 rounded bg-black px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Confirm your password"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="preferredCurrency">Preferred Currency</Label>
          <select
            id="preferredCurrency"
            name="preferredCurrency"
            value={formData.preferredCurrency}
            onChange={handleChange}
            className="bg-zinc-900 text-white w-full py-2 px-3 rounded focus:outline-none"
            required
          >
            <option value="">Select currency</option>
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <div className="mb-4">
          <Label htmlFor="monthlyBudget">Monthly Budget</Label>
          <Input
            id="monthlyBudget"
            name="monthlyBudget"
            type="number"
            value={formData.monthlyBudget}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter your monthly budget"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="shortTermGoal">I am saving for... (Short term)</Label>
          <Input
            id="shortTermGoal"
            name="shortTermGoal"
            type="text"
            value={formData.shortTermGoal}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter your short term goal"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="shortTermTimeframe">Time frame in months</Label>
          <Input
            id="shortTermTimeframe"
            name="shortTermTimeframe"
            type="number"
            value={formData.shortTermTimeframe}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter time frame in months"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="longTermGoal">Long term goals</Label>
          <Input
            id="longTermGoal"
            name="longTermGoal"
            type="text"
            value={formData.longTermGoal}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter your long term goal"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="longTermTimeframe">Time frame in years</Label>
          <Input
            id="longTermTimeframe"
            name="longTermTimeframe"
            type="number"
            value={formData.longTermTimeframe}
            onChange={handleChange}
            className="bg-zinc-900 text-white"
            placeholder="Enter timeframe in years"
            required
          />
        </div>
        <div className="mb-6">
          <Label className="flex items-center">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
              required
            />
            I agree to the terms and conditions
          </Label>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none w-full"
          >
            Sign Up
          </button>
        </div>
      </form>
      <BackgroundBeams />
    </div>
  );
}
