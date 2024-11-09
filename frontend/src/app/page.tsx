"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between w-full max-w-4xl">
        <Image
          className="dark:invert"
          src="/sofa-king-logo.jpg"
          alt="Sofa.King logo"
          width={80}
          height={40}
          priority
        />
        <nav className="flex gap-6">
          <a
            href="#features"
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base"
          >
            Features
          </a>
          <button
            onClick={goToLogin}
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base cursor-pointer"
          >
            Login
          </button>
        </nav>
      </header>

      <main className="flex flex-col gap-8 items-center sm:items-start max-w-4xl row-start-2">
        <section className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Take Control of Your Budget with Sofa.King
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mt-4">
            A financial budgeting app designed for students. Track your spending, save for your goals, and build a brighter financial future.
          </p>
          <div className="flex gap-4 mt-8 flex-col sm:flex-row">
            <a
              href="#features"
              className="rounded-full bg-blue-600 text-white px-6 py-3 text-sm sm:text-base hover:bg-blue-700 transition-colors"
            >
              Explore Features
            </a>
            <button
              onClick={goToLogin}
              className="rounded-full border border-solid border-gray-300 text-gray-700 px-6 py-3 text-sm sm:text-base hover:bg-gray-100 transition-colors"
            >
              Login
            </button>
          </div>
        </section>

        <section id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Image src="/track-spending.svg" alt="Track Spending" width={80} height={80} />
            <h2 className="text-xl font-semibold mt-4">Track Spending</h2>
            <p className="text-gray-600 mt-2">
              Get real-time insights into where your money is going and stay on top of your expenses with notifications.
            </p>
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Image src="/set-goals.svg" alt="Set Goals" width={80} height={80} />
            <h2 className="text-xl font-semibold mt-4">Set Savings Goals</h2>
            <p className="text-gray-600 mt-2">
              Plan for the future by setting goals for your financial priorities.
            </p>
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Image src="/budget-tips.svg" alt="Budget Tips" width={80} height={80} />
            <h2 className="text-xl font-semibold mt-4">Get Budgeting Tips</h2>
            <p className="text-gray-600 mt-2">
              Access student-friendly financial advice to maximize your savings.
            </p>
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Image src="/secure-data.svg" alt="Secure Data" width={80} height={80} />
            <h2 className="text-xl font-semibold mt-4">AI-Enhanced</h2>
            <p className="text-gray-600 mt-2">
              Get dynamically changing budget advice and recommendations powered by AI.
            </p>
          </div>
        </section>
      </main>

      <footer id="contact" className="row-start-3 w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Sofa.King. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4">
          <a
            href="mailto:gongju904@gmail.com"
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base"
          >
            Email Us
          </a>
        </nav>
      </footer>
    </div>
  );
}
