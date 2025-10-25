'use client';

import React from 'react';

interface ReceiptModalProps {
  receiptUrl: string;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Payment Receipt</h2>
        <img
          src={receiptUrl}
          alt="Payment Receipt"
          className="w-full h-auto rounded-md"
        />
      </div>
    </div>
  );
};

export default ReceiptModal;
