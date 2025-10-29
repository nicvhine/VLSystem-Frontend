'use client';

import React from 'react';

interface CreditScoreCardProps {
  creditScore: number; 
}

export default function CreditScoreCard({ creditScore }: CreditScoreCardProps) {
  const percentage = Math.min(Math.max((creditScore / 10) * 100, 0), 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  const getColor = () => {
    if (creditScore >= 8) return '#22c55e';
    if (creditScore >= 5) return '#eab308';
    return '#ef4444'; 
  };

  const getLabel = () => {
    if (creditScore >= 8) return 'Excellent';
    if (creditScore >= 5) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center relative hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Credit Score</h2>

      {/* Circular Gauge */}
      <div className="relative w-44 h-44 md:w-52 md:h-52">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle (gray outline) */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="14"
            fill="none"
          />

          {/* Foreground Circle (progress/score) */}
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
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-4xl md:text-5xl font-bold ${
              creditScore >= 8
                ? 'text-emerald-600'
                : creditScore >= 5
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {creditScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 mt-1">out of 10</span>
        </div>
      </div>

      {/* Rating Label */}
      <div className="mt-5 text-center">
        <p
          className={`text-sm font-semibold ${
            creditScore >= 8
              ? 'text-emerald-600'
              : creditScore >= 5
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {getLabel()}
        </p>

        {/* Optional tip for user */}
        <p className="text-xs text-gray-400 mt-1">
          {creditScore >= 8
            ? 'Keep up your consistent payments!'
            : creditScore >= 5
            ? 'On track — improve by paying on time.'
            : 'Improve by completing payments regularly.'}
        </p>
      </div>
    </div>
  );
}
