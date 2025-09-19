'use client';

interface Props {
  translations: any;
  language: 'en' | 'ceb';
  loanInfo: LoanDetails;
}

interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  dateDisbursed: string;
  principal: number;
  startDate: string;
  endDate: string;
  monthlyDue: number;
  totalPayable: number;
  termsInMonths: string;
  numberOfPeriods: number;
  status: string;
  balance: number;
  paidAmount: number;
  creditScore: number;
  paymentHistory: any[];
  paymentProgress: number;
  releasedAmount: number;
}

import { useRouter } from 'next/navigation';

interface LoanDetailsProps extends Props {}

export default function LoanDetails({
  translations,
  language,
  loanInfo
}: LoanDetailsProps) {
  const router = useRouter();

  const {
    loanId, interestRate, dateDisbursed, principal,
    termsInMonths, totalPayable, paidAmount, balance, status, releasedAmount
  } = loanInfo;

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col text-gray-800">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{translations[language].loanDetails}</h2>
        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
          onClick={() => router.push('/userPage/borrowerPage/loan-history')}
        >
          {translations[language].loanHistory || 'Loan History'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm">
        <div className="space-y-2">
          <p><span className="font-medium">{translations[language].releaseDate}:</span> {formatDate(dateDisbursed)}</p>
          <p><span className="font-medium">{translations[language].principalAmount}:</span> {formatCurrency(principal)}</p>
          <p><span className="font-medium">Released Amount:</span>{formatCurrency(releasedAmount)}</p>
          <p><span className="font-medium">{translations[language].loanPeriod}:</span> {termsInMonths} {translations[language].months}</p>
          <p><span className="font-medium">{translations[language].interestRate}:</span> {interestRate}%</p>
          <p><span className="font-medium">{translations[language].totalPayable}:</span> {formatCurrency(totalPayable)}</p>
          <p><span className="font-medium">{translations[language].totalPayments}:</span> {formatCurrency(paidAmount)}</p>
          <p><span className="font-medium">{translations[language].remainingBalance}:</span> {formatCurrency(balance)}</p>
          <p><span className="font-medium">{translations[language].loanStatus || 'Loan Status'}:</span> 
            <span className={`font-semibold ${status === 'Closed' ? 'text-blue-600' : (status === 'In Progress' || status === 'Active') ? 'text-green-600' : status === 'Overdue' ? 'text-red-600' : 'text-gray-600'}`}>
              {status === 'Closed' ? (translations[language].completed || 'Closed') : status === 'In Progress' ? (translations[language].inProgress || 'In Progress') : status}
            </span>
          </p>
        </div>
        
        {/* Loan ID Display */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="text-gray-600 text-sm">{translations[language].loanId}:</span>
          <span className="font-semibold text-red-500">{loanId}</span>
        </div>
      </div>
    </div>
  );
}
