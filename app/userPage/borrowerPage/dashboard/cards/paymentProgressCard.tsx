import React from 'react';
import { Collection } from '@/app/commonComponents/utils/Types/collection';
import { useReloan } from '../function';

interface PaymentProgressCardProps {
  collections: Collection[];
  paymentProgress: number;
  borrowerId: string; 
}

export default function PaymentProgressCard({ collections, paymentProgress, borrowerId }: PaymentProgressCardProps) {
  const { handleReloan } = useReloan();
  const isReloanAllowed = paymentProgress >= 70;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative">
      <h2 className="font-semibold text-lg text-gray-800 mb-4">Payment Progress</h2>

      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
          <circle cx="50%" cy="50%" r="60" stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle
            cx="50%"
            cy="50%"
            r="60"
            stroke="#10b981"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - paymentProgress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{paymentProgress}%</span>
          <span className="text-sm text-gray-500 mt-1">Completed</span>
        </div>
      </div>

      <div className="mt-4 w-full flex justify-around text-sm text-gray-600">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{collections.filter(c => c.status === 'Paid').length}</span>
          <span>Paid</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{collections.filter(c => c.status !== 'Paid').length}</span>
          <span>Remaining</span>
        </div>
      </div>

      {/* Reloan Button Section */}
      <div className="mt-6 flex flex-col items-center">
      <button
        onClick={() => handleReloan(paymentProgress, borrowerId)}
        disabled={!isReloanAllowed}
        className={`px-6 py-2 rounded-lg font-semibold ${
          isReloanAllowed
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 transition'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Reloan
      </button>

        {!isReloanAllowed && (
          <span className="text-xs text-gray-400 mt-2">
            You may only reloan once progress reaches 70%
          </span>
        )}
      </div>
    </div>
  );
}
