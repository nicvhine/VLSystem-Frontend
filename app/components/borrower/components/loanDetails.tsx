'use client';

interface Props {
  translations: any;
  language: 'en' | 'ceb';
  loanInfo: LoanDetails;
  allLoans: LoanDetails[];
  currentLoanIndex: number;
  handlePreviousLoan: () => void;
  handleNextLoan: () => void;
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
}

export default function LoanDetails({
  translations,
  language,
  loanInfo,
  allLoans,
  currentLoanIndex,
  handlePreviousLoan,
  handleNextLoan
}: Props) {

  const {
    loanId, interestRate, dateDisbursed, principal,
    termsInMonths, totalPayable, paidAmount, balance
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
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 text-gray-800 hover:shadow-xl transition-all duration-300">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{translations[language].loanDetails}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm">
        <div className="space-y-2">
          <p><span className="font-medium">{translations[language].releaseDate}:</span> {formatDate(dateDisbursed)}</p>
          <p><span className="font-medium">{translations[language].principalAmount}:</span> {formatCurrency(principal)}</p>
          <p><span className="font-medium">{translations[language].loanPeriod}:</span> {termsInMonths} {translations[language].months}</p>
          <p><span className="font-medium">{translations[language].interestRate}:</span> {interestRate}%</p>
          <p><span className="font-medium">{translations[language].totalPayable}:</span> {formatCurrency(totalPayable)}</p>
          <p><span className="font-medium">{translations[language].totalPayments}:</span> {formatCurrency(paidAmount)}</p>
          <p><span className="font-medium">{translations[language].remainingBalance}:</span> {formatCurrency(balance)}</p>
        </div>
        
        {/* Loan Navigation */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="text-gray-600 text-sm">{translations[language].loanId}:</span>
          <button
            onClick={handlePreviousLoan}
            disabled={currentLoanIndex === 0}
            className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${currentLoanIndex === 0 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-600 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
          >
            ←
          </button>
          <span className="font-semibold text-red-500 min-w-[80px] text-center">{loanId}</span>
          <button
            onClick={handleNextLoan}
            disabled={currentLoanIndex === allLoans.length - 1}
            className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${currentLoanIndex === allLoans.length - 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-600 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
          >
            →
          </button>
          {allLoans.length > 1 && (
            <span className="text-xs text-gray-500">({currentLoanIndex + 1} {translations[language].of} {allLoans.length})</span>
          )}
        </div>
      </div>
    </div>
  );
}
