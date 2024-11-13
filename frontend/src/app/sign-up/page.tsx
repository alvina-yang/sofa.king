"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
      // Send form data to the backend
      const response = await fetch("http://localhost:5000/api/user-data", {
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
        console.log("User data saved:", data);
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
        className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-white text-sm font-bold mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-white text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Confirm your password"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="preferredCurrency" className="block text-white text-sm font-bold mb-2">
            Preferred Currency
          </label>
          <select
            id="preferredCurrency"
            name="preferredCurrency"
            value={formData.preferredCurrency}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
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
          <label htmlFor="monthlyBudget" className="block text-white text-sm font-bold mb-2">
            Monthly Budget
          </label>
          <input
            id="monthlyBudget"
            name="monthlyBudget"
            type="number"
            value={formData.monthlyBudget}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your monthly budget"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="shortTermGoal" className="block text-white text-sm font-bold mb-2">
            I am saving for... (Short term)
          </label>
          <input
            id="shortTermGoal"
            name="shortTermGoal"
            type="text"
            value={formData.shortTermGoal}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your short term goal"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="shortTermTimeframe" className="block text-white text-sm font-bold mb-2">
            Time frame in months
          </label>
          <input
            id="shortTermTimeframe"
            name="shortTermTimeframe"
            type="number"
            value={formData.shortTermTimeframe}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter time frame in months"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="longTermGoal" className="block text-white text-sm font-bold mb-2">
            Long term goals
          </label>
          <input
            id="longTermGoal"
            name="longTermGoal"
            type="text"
            value={formData.longTermGoal}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your long term goal"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="longTermTimeframe" className="block text-white text-sm font-bold mb-2">
            Time frame in years
          </label>
          <input
            id="longTermTimeframe"
            name="longTermTimeframe"
            type="number"
            value={formData.longTermTimeframe}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter timeframe in years"
            required
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <span className="text-sm">I agree to the terms and conditions</span>
          </label>
        </div>
        {error && (
          <p className="text-red-500 text-xs italic mb-4">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}