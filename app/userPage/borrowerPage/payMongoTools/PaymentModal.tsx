"use client";

import React, { useState } from 'react';
import paymentService, { PaymentData } from './paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  paymentAmount: number;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  loanId, 
  paymentAmount, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'gcash' | 'qrph'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const paymentData: PaymentData = {
        loanId,
        amount: paymentAmount,
        paymentMethod: selectedMethod
      };

      const response = await paymentService.createPayment(paymentData);

      if (response.success) {
        // For card payments, redirect to PayMongo checkout
        if (selectedMethod === 'card' && response.checkoutUrl) {
          window.open(response.checkoutUrl, '_blank');
        }
        // For GCash/QRPh, redirect to their respective checkout
        else if (response.checkoutUrl) {
          window.open(response.checkoutUrl, '_blank');
        }

        // Close modal and refresh parent component
        onClose();
        onPaymentSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Make Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(paymentAmount)}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Loan ID: {loanId}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={(e) => setSelectedMethod(e.target.value as 'card')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
                    💳
                  </div>
                  <span>Credit/Debit Card</span>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gcash"
                  checked={selectedMethod === 'gcash'}
                  onChange={(e) => setSelectedMethod(e.target.value as 'gcash')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                    📱
                  </div>
                  <span>GCash</span>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qrph"
                  checked={selectedMethod === 'qrph'}
                  onChange={(e) => setSelectedMethod(e.target.value as 'qrph')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center mr-3">
                    📲
                  </div>
                  <span>QR Ph</span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}