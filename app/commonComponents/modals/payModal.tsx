"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [animateIn, setAnimateIn] = useState(false);
  // Pre-fill input with periodBalance
  const [customAmount, setCustomAmount] = useState(collection.periodBalance.toString());
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    // mirror other modals: mount then trigger animation shortly after
    setTimeout(() => setAnimateIn(true), 10);
    return () => setAnimateIn(false);
  }, []);
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
      // animate out then close
      setAnimateIn(false);
      setTimeout(() => onClose(), 150);
    } catch (err) {
      console.error('Modal payment error:', err);
      setIsPaying(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // animate out then close
      setAnimateIn(false);
      setTimeout(() => onClose(), 150);
    }
  };
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
    >
      <ModalContent
        animateIn={animateIn}
        onClose={() => {
          setAnimateIn(false);
          setTimeout(() => onClose(), 150);
        }}
        collection={collection}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        handleCustomPay={handleCustomPay}
        isPaying={isPaying}
      />
    </div>,
    document.body
  );
}

function ModalContent({ animateIn, onClose, collection, customAmount, setCustomAmount, handleCustomPay, isPaying }: any) {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md transition-all duration-150 ${
        animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      <button
        onClick={() => {
          // animated close
          onClose();
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">Pay Collection #{collection.collectionNumber}</h2>

      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Due date:</span>{' '}
        {new Date(collection.dueDate).toLocaleDateString('en-PH')}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Amount due:</span> ₱{collection.periodBalance.toLocaleString()}
      </p>

      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-700 font-medium">Enter amount to pay</label>
        <input
          id="customAmountInput"
          type="number"
          min="1"
          step="0.01"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 text-black"
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => {
            // animate out then close
            // we use onClose passed down which already animates
            onClose();
          }}
          className="px-4 py-2 bg-gray-200 rounded-md text-black"
        >
          Cancel
        </button>

        <button
          onClick={handleCustomPay}
          disabled={isPaying}
          className={`px-4 py-2 bg-red-600 text-white rounded-md font-normal ${isPaying ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'}`}
        >
          {isPaying ? 'Processing...' : 'Pay with GCash'}
        </button>
      </div>
    </div>
  );
}
