"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IconWallet,
  IconTarget,
  IconBulb,
  IconLock,
  IconChartBar,
  IconCoin,
  IconTrendingUp,
  IconDatabase,
} from "@tabler/icons-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  const goToSignUp = () => {
    router.push("/sign-up");
  };

  const features = [
    {
      title: "Track Spending",
      description:
        "Get real-time insights into where your money is going and stay on top of your expenses.",
      icon: <IconWallet />,
    },
    {
      title: "Set Savings Goals",
      description: "Plan for the future by setting goals for your financial priorities.",
      icon: <IconTarget />,
    },
    {
      title: "Budgeting Tips",
      description:
        "Access student-friendly financial advice to maximize your savings and reach your goals.",
      icon: <IconBulb />,
    },
    {
      title: "Secure Data",
      description: "Your data is encrypted and protected with industry-standard security protocols.",
      icon: <IconLock />,
    },
    {
      title: "AI Insights",
      description: "Get dynamically changing advice and recommendations powered by AI.",
      icon: <IconChartBar />,
    },
    {
      title: "Multi-Currency Support",
      description: "Budget in your preferred currency with global multi-currency support.",
      icon: <IconCoin />,
    },
    {
      title: "Track Progress",
      description: "Monitor your financial progress with detailed analytics and insights.",
      icon: <IconTrendingUp />,
    },
    {
      title: "Cloud Sync",
      description: "Access your budgeting data anytime, anywhere with cloud synchronization.",
      icon: <IconDatabase />,
    },
  ];

  return (
    <div className="relative grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white overflow-hidden">
      <BackgroundBeams className="z-0" />
      <header className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between w-full max-w-4xl">
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
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base text-white"
          >
            Features
          </a>
          <button
            onClick={goToLogin}
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base text-white cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={goToSignUp}
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base text-white cursor-pointer"
          >
            Sign Up
          </button>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col gap-8 items-center sm:items-start max-w-4xl row-start-2">
        <section className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-white">
            Take Control of Your Budget with Sofa.King
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mt-4">
            A financial budgeting app designed for students. Track your spending, save for your
            goals, and build a brighter financial future.
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
              className="rounded-full border border-solid border-zinc-700 text-white px-6 py-3 text-sm sm:text-base hover:bg-zinc-800 transition-colors"
            >
              Login
            </button>
            <button
              onClick={goToSignUp}
              className="rounded-full border border-solid border-zinc-700 text-white px-6 py-3 text-sm sm:text-base hover:bg-zinc-800 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </section>

        <section
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10 max-w-7xl mx-auto gap-8"
        >
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </section>
      </main>

      <footer
        id="contact"
        className="relative z-10 row-start-3 w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-12"
      >
        <div className="text-center sm:text-left">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Sofa.King. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4">
          <a
            href="mailto:gongju904@gmail.com"
            className="hover:underline hover:underline-offset-4 text-sm sm:text-base text-white"
          >
            Email Us
          </a>
        </nav>
      </footer>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => (
  <div
    className={cn(
      "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
      (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
      index < 4 && "lg:border-b dark:border-neutral-800"
    )}
  >
    {index < 4 && (
      <div className="opacity-0 group-hover/feature:opacity-30 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
    )}
    {index >= 4 && (
      <div className="opacity-0 group-hover/feature:opacity-30 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
    )}
    <div className="mb-4 relative z-10 px-10 text-neutral-400">{icon}</div>
    <div className="text-lg font-bold mb-2 relative z-10 px-10">
      <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
      <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
        {title}
      </span>
    </div>
    <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
      {description}
    </p>
  </div>
);
