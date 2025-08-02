'use client';

import { useRouter } from 'next/navigation';
import ReceiptModal from '../components/receipt';
import PaymentProgress from '../components/paymentProgress';
import translations from '../components/translation';
import Borrower from '../page';
import CreditScore from '../components/creditScore';
import LoanDetails from '../components/loanDetails';

import PaymentTable from '../components/paymentTable';
import { useBorrowerDashboard } from '../components/handlers';


export default function BorrowerDashboard() {
  const router = useRouter();

  const {
    language,
    setLanguage,
    loanInfo,
    allLoans,
    loading,
    showChangePasswordModal,
    payments,
    showReceipt,
    selectedReceipt,
    setShowReceipt,
    setSelectedReceipt,
    currentLoanIndex,
    handleNextLoan,
    handlePreviousLoan,
    handleLogout,
    handleReloan,
    calculatePaymentProgress,
    formatCurrency,
    formatDate,
  } = useBorrowerDashboard();

  const paymentProgress = calculatePaymentProgress();


  if (loading)
    return <div className="p-6 text-center">{translations[language].loading}</div>;

  if (!loanInfo)
    return (
      <div className="p-6 text-center text-red-500">
        {translations[language].noActiveLoanFound}
      </div>
    );

  const {
    loanId,
    name,
    interestRate,
    dateDisbursed,
    principal,
    startDate,
    endDate,
    termsInMonths,
    numberOfPeriods,
    monthlyDue,
    totalPayable,
    status,
    balance,
    paidAmount,
    creditScore,
    paymentHistory,
  } = loanInfo;

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 relative">
        <main className="max-w-10xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            {translations[language].welcome},{' '}
            <span className="text-red-600">{name}</span>!
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <CreditScore
              creditScore={creditScore}
              translations={translations}
              language={language}
            />

            <LoanDetails
              translations={translations}
              language={language}
              loanInfo={loanInfo}
            />

            <PaymentProgress
              progress={paymentProgress}
              canReloan={paymentProgress >= 0}
              onReloanClick={handleReloan}
              translations={translations}
              language={language}
            />
          </div>

          <PaymentTable
            payments={payments}
            loanId={loanId}
            monthlyDue={monthlyDue}
            balance={balance}
            translations={translations}
            language={language}
          />



          {showReceipt && selectedReceipt && (
            <ReceiptModal
              isOpen={showReceipt}
              onClose={() => setShowReceipt(false)}
              payment={selectedReceipt}
            />
          )}
        </main>
      </div>
    </Borrower>
  );
}
