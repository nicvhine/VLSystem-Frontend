'use client';

import Link from 'next/link';

interface Props {
  progress: number;
  canReloan: boolean;
  onReloanClick: () => void;
  translations: any;
  language: 'en' | 'ceb';
}

export default function PaymentProgress({
  progress,
  canReloan,
  onReloanClick,
  translations,
  language
}: Props) {
  return (
    <div className="flex flex-col items-center justify-between text-gray-800">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{translations[language].paymentProgress}</h2>

      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3 sm:mb-4">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-300"
            stroke="currentColor"
            strokeWidth="3.8"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-green-600"
            strokeDasharray={`${progress}, 100`}
            stroke="currentColor"
            strokeWidth="3.8"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold">
          <span className="text-xl sm:text-2xl text-gray-800">{progress}%</span>
          <span className="text-gray-500">{translations[language].paid}</span>
        </div>
      </div>

      <button className="bg-green-600 text-white px-4 py-3 sm:p-4 rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base w-full sm:w-auto">
        <Link href="/userPage/borrowerPage/pages/upcoming-bills">{translations[language].payNow}</Link>
      </button>

      {canReloan ? (
        <button 
          onClick={onReloanClick}
          className="bg-blue-600 text-white px-4 py-3 sm:p-4 rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto mt-3 sm:mt-5"
        >
          {translations[language].reloan}
        </button>
      ) : (
        <p className='mt-3 sm:mt-5 text-xs sm:text-sm text-center text-gray-600'>
          {translations[language].notEligibleReloan}
        </p>
      )}
    </div>
  );
}
