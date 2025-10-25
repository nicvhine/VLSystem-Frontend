'use client';

import React from 'react';
import { Collection } from '@/app/commonComponents/utils/Types/collection';
import { useReloan } from '../function';

interface PaymentProgressCardProps {
  collections: Collection[];
  paymentProgress: number;
  borrowerId: string;
}

export default function CreditScoreCard({
  collections,
  paymentProgress,
  borrowerId,
}: PaymentProgressCardProps) {
  const { handleReloan } = useReloan();
  const isReloanAllowed = paymentProgress >= 70;

  const paidCount = collections.filter(c => c.status === 'Paid').length;
  const remainingCount = collections.filter(c => c.status !== 'Paid').length;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - paymentProgress / 100);

  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center relative hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-m font-semibold text-gray-900 mb-6">Credit Score</h2>

      {/* Circular Progress */}
      <div className="relative w-44 h-44 md:w-52 md:h-52">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="14"
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-800 ease-out"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />  
              <stop offset="50%" stopColor="#10b981" /> 
              <stop offset="100%" stopColor="#059669" /> 
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold text-gray-900">{paymentProgress}%</span>
          <span className="text-sm md:text-base text-gray-500 mt-1">Completed</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 w-full flex justify-around">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-green-600">{paidCount}</span>
          <span className="text-sm text-gray-500">Paid</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-red-500">{remainingCount}</span>
          <span className="text-sm text-gray-500">Remaining</span>
        </div>
      </div>

      {/* Reloan Button */}
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={() => handleReloan(paymentProgress, borrowerId)}
          disabled={!isReloanAllowed}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            isReloanAllowed
              ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-300'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Reloan
        </button>
        {!isReloanAllowed && (
          <span className="text-xs md:text-sm text-gray-400 mt-2 text-center">
            You may only reloan once progress reaches 70%
          </span>
        )}
      </div>
    </div>
  );
}
