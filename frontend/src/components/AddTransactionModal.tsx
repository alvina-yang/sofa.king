import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useGlobalState } from "@/app/context/GlobalState";
import { format } from "date-fns";

interface AddTransactionModalProps {
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const { fetchUserData } = useGlobalState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!date || !merchant || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    // Format the date
    const formattedDate = date.toISOString().split("T")[0];

    // Send data to the backend
    try {
      onClose();
      const response = await fetch("http://localhost:5000/api/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          merchant,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      // Fetch updated data and close modal
      await fetchUserData();
      alert("Transaction added successfully!");
      
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("An error occurred while adding the transaction.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <Card className="bg-zinc-900 text-white border border-zinc-800">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                {/* Date Picker */}
                <div className="flex flex-col space-y-1.5">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full pl-3 text-left bg-zinc-700 text-white hover:bg-zinc-600"
                      >
                        {date ? format(date, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-800 border border-zinc-700 rounded-md">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md text-white"
                        disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Merchant Input */}
                <div className="flex flex-col space-y-1.5">
                  <Label>Merchant</Label>
                  <Input
                    placeholder="Enter merchant name"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="bg-zinc-700 text-white placeholder-zinc-500 focus:ring-0"
                    required
                  />
                </div>
                {/* Amount Input */}
                <div className="flex flex-col space-y-1.5">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-zinc-700 text-white placeholder-zinc-500 focus:ring-0"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-zinc-700 hover:bg-zinc-600" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-500" onClick={handleSubmit}>
              Add
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddTransactionModal;
