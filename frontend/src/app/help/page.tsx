'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingDock } from '@/components/ui/floating-dock';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8">Help & Instructions</h1>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Instruction: Modify Budgets */}
        <Card className="bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Modify Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">
              Navigate to the <span className="text-yellow-500 font-semibold">Budgets</span> page using the Navbar. 
              Here, you can set and modify your monthly budgets for different categories.
            </p>
          </CardContent>
        </Card>

        {/* Instruction: Earn Coins */}
        <Card className="bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Earn Sofa.King Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">
              Accumulate <span className="text-green-500 font-semibold">Sofa.King Coins</span> by tracking your purchases and achieving goals. 
              Use these coins to unlock exciting rewards within the app.
            </p>
          </CardContent>
        </Card>

        {/* Instruction: Dynamic Categories */}
        <Card className="bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Dynamic Categories & Logging Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">
              The app dynamically creates categories based on your spending habits. All your purchases are logged and categorized automatically, 
              providing detailed insights and breakdowns.
            </p>
          </CardContent>
        </Card>

        {/* Instruction: Add Transactions */}
        <Card className="bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Add Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">
              You can add transactions easily through the Navbar. Look for the <span className="text-blue-500 font-semibold">Add Transaction</span> option 
              and fill in the details like date, merchant, and amount.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Floating Dock */}
      <div className="mt-8">
        <FloatingDock />
      </div>
    </div>
  );
}
