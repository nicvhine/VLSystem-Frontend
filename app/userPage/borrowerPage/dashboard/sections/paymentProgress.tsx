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
    <div className="flex flex-col items-center text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {translations[language].paymentProgress}
      </h2>

      <div className="relative w-32 h-32 mb-6">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{progress}%</span>
          <span className="text-gray-500 text-sm">{translations[language].paid}</span>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <Link href="/userPage/borrowerPage/pages/upcoming-bills">
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
            {translations[language].payNow}
          </button>
        </Link>

        {canReloan ? (
          <button 
            onClick={onReloanClick}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {translations[language].reloan}
          </button>
        ) : (
          <p className='text-xs text-center text-gray-600 mt-2'>
            {translations[language].notEligibleReloan}
          </p>
        )}
      </div>
    </div>
  );
}
