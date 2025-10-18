'use client';
import React from 'react';
import { FiMaximize } from 'react-icons/fi';
import { Payment } from '../type';

interface PaymentHistoryCardProps {
  paidPayments: Payment[];
  setIsPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PaymentHistoryCard({ paidPayments, setIsPaymentModalOpen }: PaymentHistoryCardProps) {
  return (
    <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow relative">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-m mb-4">Payment History</h2>
        <FiMaximize
          className="cursor-pointer text-gray-600 hover:text-gray-900"
          size={20}
          onClick={() => setIsPaymentModalOpen(true)}
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 max-h-48 overflow-y-auto">
        {paidPayments.length === 0 ? (
          <p className="text-gray-500 text-sm">No payments made yet.</p>
        ) : (
          paidPayments.slice(0, 3).map((payment, index) => (
            <div
              key={payment._id || index}
              className="flex justify-between items-center px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition"
            >
              <div className="flex flex-col">
                <span className="text-gray-800 text-sm truncate">{payment.referenceNumber}</span>
                <span className="text-gray-500 text-xs">
                  {payment.datePaid ? new Date(payment.datePaid).toLocaleDateString('en-PH') : '-'}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-800 font-semibold text-sm">₱{payment.amount?.toLocaleString() ?? '0'}</span>
                <span className="text-green-700 text-xs font-medium">{payment.mode}</span>
              </div>
            </div>
          ))
        )}

        {paidPayments.length > 3 && (
          <p
            className="text-gray-400 text-xs mt-1 text-center cursor-pointer"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            View all payments
          </p>
        )}
      </div>
    </div>
  );
}
