"use client"; // Ensure client-side execution
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ensure this code runs on the client only
    setIsClient(true);
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "gongjuno" && password === "12345") {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  if (!isClient) return null; // Avoid rendering until on the client

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Login to Sofa.King</h1>
      <form
        onSubmit={handleLogin}
        className="border border-white rounded z-10 bg-black px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-900 text-white"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs italic mb-4">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>
      </form>
      <BackgroundBeams />
    </div>
  );
}
