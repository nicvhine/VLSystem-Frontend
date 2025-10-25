'use client';
import React, { useState, useEffect } from 'react';
import { Collection } from '@/app/commonComponents/utils/Types/collection';
import { Loan } from '@/app/commonComponents/utils/Types/loan';
import { handlePay } from '@/app/userPage/borrowerPage/dashboard/function';
import { X } from 'lucide-react';

interface CustomAmountModalProps {
  collection: Collection;
  activeLoan: Loan;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export default function CustomAmountModal({
  collection,
  activeLoan,
  setErrorMsg,
  setShowErrorModal,
  onClose,
}: CustomAmountModalProps) {
  // Pre-fill input with periodBalance
  const [customAmount, setCustomAmount] = useState(collection.periodBalance.toString());
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const input = document.getElementById('customAmountInput') as HTMLInputElement | null;
    if (input) input.focus();
  }, []);

  const handleCustomPay = async () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      setShowErrorModal(true);
      return;
    }

    setIsPaying(true);

    try {
      await handlePay(
        collection,
        activeLoan,
        setErrorMsg,
        setShowErrorModal,
        amount
      );
      setIsPaying(false);
      onClose();
    } catch (err) {
      console.error('Modal payment error:', err);
      setIsPaying(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Pay Collection #{collection.collectionNumber}
        </h2>

        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Due date:</span>{' '}
          {new Date(collection.dueDate).toLocaleDateString('en-PH')}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Amount due:</span> ₱
          {collection.periodBalance.toLocaleString()}
        </p>

        <div className="space-y-2 mb-4">
          <label className="text-sm text-gray-700 font-medium">Enter amount to pay</label>
          <input
            id="customAmountInput"
            type="number"
            min="1"
            step="0.01"
            value={customAmount} // pre-filled value
            onChange={(e) => setCustomAmount(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>

        <button
          onClick={handleCustomPay}
          disabled={isPaying}
          className={`w-full py-2.5 rounded-lg text-white font-semibold transition
            ${isPaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isPaying ? 'Processing...' : 'Pay with GCash'}
        </button>
      </div>
    </div>
  );
}
