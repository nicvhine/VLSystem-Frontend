'use client';

interface Props {
  creditScore: number;
  translations: any;
  language: 'en' | 'ceb';
}

export default function CreditScore({ creditScore, translations, language }: Props) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col items-center text-gray-800 hover:shadow-lg transition">
      <h2 className="text-lg sm:text-xl font-semibold mb-1">{translations[language].creditScore}</h2>
      <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">{translations[language].creditScoreDesc}</div>

      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-300"
            stroke="currentColor"
            strokeWidth="3.8"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={
              creditScore >= 7.5
                ? 'text-green-500'
                : creditScore >= 5
                ? 'text-yellow-500'
                : 'text-red-500'
            }
            stroke="currentColor"
            strokeWidth="3.8"
            strokeDasharray={`${(creditScore / 10) * 100}, 100`}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="text-3xl sm:text-5xl font-bold z-10">
          {creditScore}
        </span>
      </div>

      <span className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-600 text-center">
        {
          creditScore >= 7.5 ? translations[language].goodStanding :
          creditScore >= 5 ? translations[language].fairStanding :
          translations[language].poorStanding
        }
      </span>
    </div>
  );
}
