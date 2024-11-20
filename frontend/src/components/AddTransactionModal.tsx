import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGlobalState } from '@/app/context/GlobalState';

interface AddTransactionModalProps {
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const { fetchUserData } = useGlobalState()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!date || !merchant || !amount) {
      alert('Please fill in all fields.');
      return;
    }

    // Send data to backend
    try {
      const response = await fetch('http://localhost:5000/api/add-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, merchant, amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      await fetchUserData();
    alert('Transaction added successfully!');
    onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('An error occurred while adding the transaction.');
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
        className="bg-zinc-800 rounded-lg p-6 w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-xl font-bold mb-4 text-white">Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Merchant</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 rounded bg-zinc-700 text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={onClose} // Trigger modal dismissal on cancel
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTransactionModal;
