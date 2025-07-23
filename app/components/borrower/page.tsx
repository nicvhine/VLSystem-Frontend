'use client';

import { useState, useEffect, Suspense } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/borrower/navbar';
import Link from 'next/link';
import ReceiptModal from './components/receipt';
import ChangePasswordModal from './components/forceChange';

// Translation mappings
const translations = {
  en: {
    welcome: 'Welcome',
    creditScore: 'Your Credit Score',
    creditScoreDesc: 'Based on your repayment history',
    goodStanding: 'Good Standing',
    fairStanding: 'Fair Standing',
    poorStanding: 'Poor Standing',
    loanDetails: 'Loan Details',
    loanId: 'Loan ID',
    releaseDate: 'Release Date',
    principalAmount: 'Principal Amount',
    loanPeriod: 'Loan Period',
    months: 'Months',
    interestRate: 'Interest Rate',
    totalPayable: 'Total Payable',
    totalPayments: 'Total Payments',
    remainingBalance: 'Remaining Balance',
    paymentProgress: 'Payment Progress',
    paid: 'Paid',
    payNow: 'Pay Now',
    reloan: 'Re-Loan',
    notEligibleReloan: 'You are not yet eligible for Reloan.',
    paymentHistory: 'Payment History',
    referenceNumber: 'Reference #',
    date: 'Date',
    periodAmount: 'Period Amount',
    paidAmount: 'Paid Amount',
    mode: 'Mode',
    eReceipt: 'E-Receipt',
    download: 'Download',
    noPaymentHistory: 'No payment history available',
    balance: 'Balance',
    downloadEReceipt: 'Download E-Receipt',
    loading: 'Loading...',
    of: 'of',
    noActiveLoanFound: 'No active loan found',
    english: 'English',
    cebuano: 'Cebuano'
  },
  ceb: {
    welcome: 'Maayong Pag-abot',
    creditScore: 'Imong Credit Score',
    creditScoreDesc: 'Base sa imong payment history',
    goodStanding: 'Maayong Kahimtang',
    fairStanding: 'Kasarangan nga Kahimtang',
    poorStanding: 'Dili Maayong Kahimtang',
    loanDetails: 'Detalye sa Utang',
    loanId: 'ID sa Utang',
    releaseDate: 'Petsa sa Paghatag',
    principalAmount: 'Kantidad sa Principal',
    loanPeriod: 'Panahon sa Utang',
    months: 'mga Buwan',
    interestRate: 'Interest Rate',
    totalPayable: 'Kinatibuk-ang Bayrunon',
    totalPayments: 'Kinatibuk-ang Bayad',
    remainingBalance: 'Nahabilin nga Balanse',
    paymentProgress: 'Progreso sa Pagbayad',
    paid: 'Nabayad',
    payNow: 'Bayad Karon',
    reloan: 'Bag-ong Utang',
    notEligibleReloan: 'Dili ka pa eligible para sa bag-ong utang.',
    paymentHistory: 'Kasaysayan sa Pagbayad',
    referenceNumber: 'Reference #',
    date: 'Petsa',
    periodAmount: 'Kantidad sa Panahon',
    paidAmount: 'Kantidad nga Nabayad',
    mode: 'Paagi',
    eReceipt: 'E-Receipt',
    download: 'I-download',
    noPaymentHistory: 'Walay kasaysayan sa pagbayad',
    noActiveLoanFound: 'Wala pay utang nga nakit-an',
    balance: 'Balanse',
    downloadEReceipt: 'I-download ang E-Receipt',
    loading: 'Nag-load...',
    of: 'sa',
    noActiveLoanFound: 'Wala pay utang nga nakit-an',
    english: 'English',
    cebuano: 'Cebuano'
  }
};

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
  paymentHistory: Payment[];
  paymentProgress: number;
}

interface Payment {
  loanId: string;
  referenceNumber: string;
  borrowersId: string;
  collector: string;
  amount: number;
  datePaid: string;
}

export default function BorrowerDashboard() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [allLoans, setAllLoans] = useState<LoanDetails[]>([]);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(0);
  const [loanInfo, setLoanInfo] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        localStorage.clear();
        router.push('/');
        return;
      }

      const mustChange = localStorage.getItem('forcePasswordChange');
      if (mustChange === 'true') {
        setShowChangePasswordModal(true);
      }

      const borrowersId = localStorage.getItem('borrowersId');
      if (!borrowersId) {
        router.push('/');
        return;
      }

      fetch(`http://localhost:3001/loans/borrower-loans/${borrowersId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch loans');
          return res.json();
        })
        .then(data => {
          setAllLoans(data);
          if (data.length > 0) {
            setLoanInfo(data[0]); 
          }
        })
        .catch(err => {
          console.error('Loan fetch error:', err);
          router.push('/');
        })
        .finally(() => setLoading(false));

    } catch (error) {
      localStorage.clear();
      router.push('/');
    }
  }, [router]);

   useEffect(() => {
  const fetchPayments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/payments`);
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
    }
  };

  fetchPayments();
}, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handlePreviousLoan = () => {
    if (currentLoanIndex > 0) {
      const newIndex = currentLoanIndex - 1;
      setCurrentLoanIndex(newIndex);
      setLoanInfo(allLoans[newIndex]);
    }
  };

  const handleNextLoan = () => {
    if (currentLoanIndex < allLoans.length - 1) {
      const newIndex = currentLoanIndex + 1;
      setCurrentLoanIndex(newIndex);
      setLoanInfo(allLoans[newIndex]);
    }
  };

  const handleReloan = async () => {
    if (loanInfo) {
      const token = localStorage.getItem('token');
      const borrowersId = localStorage.getItem('borrowersId');
      const currentLanguage = language; // Get current language
      try {
        const [borrowerResponse, applicationsResponse] = await Promise.all([
          fetch(`http://localhost:3001/borrowers/${borrowersId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:3001/loan-applications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        if (!borrowerResponse.ok) throw new Error('Failed to fetch borrower data');
        if (!applicationsResponse.ok) throw new Error('Failed to fetch loan applications');

        const borrowerData = await borrowerResponse.json();
        const allApplications = await applicationsResponse.json();
        
        const previousApplications = allApplications
          .filter((app: any) => app.borrowersId === borrowersId && app.status === 'Accepted')
          .sort((a: any, b: any) => 
            new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
          );

        const previousApplication = previousApplications[0];

        const reloanInfo = {
          isReloan: true,
          language: currentLanguage, // Include current language in reloan info
          personalInfo: {
            ...borrowerData,
            ...(previousApplication && {
              appName: previousApplication.appName,
              appDob: previousApplication.appDob,
              appContact: previousApplication.appContact,
              appEmail: previousApplication.appEmail,
              appMarital: previousApplication.appMarital,
              appChildren: previousApplication.appChildren,
              appSpouseName: previousApplication.appSpouseName,
              appSpouseOccupation: previousApplication.appSpouseOccupation,
              appAddress: previousApplication.appAddress,
              sourceOfIncome: previousApplication.sourceOfIncome,
              // Business fields
              appTypeBusiness: previousApplication.appTypeBusiness,
              appDateStarted: previousApplication.appDateStarted,
              appBusinessLoc: previousApplication.appBusinessLoc,
              // Employment fields
              appOccupation: previousApplication.appOccupation,
              appEmploymentStatus: previousApplication.appEmploymentStatus,
              appCompanyName: previousApplication.appCompanyName,
              // Income
              appMonthlyIncome: previousApplication.appMonthlyIncome,
            })
          },
          loanDetails: {
            amount: loanInfo.principal,
            term: parseInt(loanInfo.termsInMonths),
          },
          ...(previousApplication && {
            characterReferences: previousApplication.appReferences || []
          })
        };

        localStorage.setItem('reloanInfo', JSON.stringify(reloanInfo));
        router.push(`/components/borrower/ApplicationPage/${borrowersId}`);
      } catch (error) {
        console.error("Failed to fetch data for reloan:", error);
      }
    }
  };

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


  // Calculate payment progress percentage
  const calculatePaymentProgress = () => {
    if (!loanInfo) return 0;
    const totalLoan = loanInfo.totalPayable;
    const remaining = loanInfo.balance;
    const paid = totalLoan - remaining;
    return Math.round((paid / totalLoan) * 100);
  };
  
  const paymentProgress = calculatePaymentProgress();

  if (loading) return <div className="p-6 text-center">{translations[language].loading}</div>;
  if (!loanInfo) return <div className="p-6 text-center text-red-500">{translations[language].noActiveLoanFound}</div>;

  const {
    loanId, name, interestRate, dateDisbursed, principal,
    startDate, endDate, termsInMonths, numberOfPeriods, monthlyDue, totalPayable,
    status, balance, paidAmount,
    creditScore, paymentHistory
  } = loanInfo;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar 
        key={typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : ''} 
        language={language} 
        setLanguage={setLanguage} 
      />

      <main className="max-w-10xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          {translations[language].welcome}, <span className="text-red-600">{name}</span>!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Credit Score */}
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col items-center text-gray-800 hover:shadow-lg transition">
            <div className="text-lg sm:text-xl font-semibold mb-1">{translations[language].creditScore}</div>
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

          {/* Loan Details */}
          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 text-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">{translations[language].loanDetails}</h2>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <span>{translations[language].loanId}:</span>
                <button 
                  onClick={handlePreviousLoan}
                  disabled={currentLoanIndex === 0}
                  className={`px-3 py-1 rounded-md border ${currentLoanIndex === 0 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-600 border-blue-300 hover:text-white hover:bg-blue-600 hover:border-blue-600'} transition-all`}
                >
                  ←
                </button>
                <span className="font-medium text-red-500">{loanId}</span>
                <button 
                  onClick={handleNextLoan}
                  disabled={currentLoanIndex === allLoans.length - 1}
                  className={`px-3 py-1 rounded-md border ${currentLoanIndex === allLoans.length - 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-blue-600 border-blue-300 hover:text-white hover:bg-blue-600 hover:border-blue-600'} transition-all`}
                >
                  →
                </button>
                {allLoans.length > 1 && (
                  <span className="text-xs text-gray-500">({currentLoanIndex + 1} {translations[language].of} {allLoans.length})</span>
                )}
              </div>
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
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col items-center text-gray-800 hover:shadow-lg transition w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{translations[language].paymentProgress}</h2>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3 sm:mb-6">
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
                  strokeDasharray={`${paymentProgress}, 100`}
                  stroke="currentColor"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold">
                <span className="text-xl sm:text-2xl text-gray-800">{paymentProgress}%</span>
                <span className="text-gray-500">{translations[language].paid}</span>
              </div>
            </div>
            
            {/* Buttons Container - Centered */}
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <button className="bg-green-600 text-white px-4 py-3 sm:px-6 rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base w-full sm:w-auto">
                  <Link href="/borrower/upcoming-bills" className="block w-full">{translations[language].payNow}</Link>
                </button>
                {paymentProgress >= 0 ? (
                  <button 
                    onClick={handleReloan}
                    className="bg-blue-600 text-white px-4 py-3 sm:px-6 rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    {translations[language].reloan}
                  </button>
                ) : (
                  <p className='text-xs sm:text-sm text-center text-gray-600 w-full'>{translations[language].notEligibleReloan}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 sm:mt-10">
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{translations[language].paymentHistory}</h3>
          </div>
          <Suspense fallback={<div className="p-4 text-center">{translations[language].loading}</div>}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].referenceNumber}</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].date}</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].periodAmount}</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].paidAmount}</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">{translations[language].mode}</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">{translations[language].eReceipt}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments && payments.length > 0 ? (
                    Object.values(
                    payments
                      .filter(payment => payment.loanId === loanId)
                      .reduce((acc, payment) => {
                        if (!acc[payment.referenceNumber]) {
                          acc[payment.referenceNumber] = { ...payment };
                        } else {
                          acc[payment.referenceNumber].amount += payment.amount;
                        }
                        return acc;
                      }, {} as Record<string, Payment>)
                    ).map((payment, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{payment.referenceNumber}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{formatDate(payment.datePaid)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600">{formatCurrency(monthlyDue)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{formatCurrency(payment.amount)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell">-</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <button
                            onClick={() => {
                              setSelectedReceipt(payment);
                              setShowReceipt(true);
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {translations[language].download}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        {translations[language].noPaymentHistory}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Mobile-specific info cards for hidden columns */}
              <div className="sm:hidden">
                {payments && payments.length > 0 && payments
                  .filter(payment => payment.loanId === loanId)
                  .map((payment, idx) => (
                    <div key={`mobile-${idx}`} className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><span className="font-medium">{translations[language].balance}:</span> {formatCurrency(loanInfo.balance)}</p>
                        <p><span className="font-medium">{translations[language].mode}:</span> -</p>
                        <button
                          onClick={() => {
                            setSelectedReceipt(payment);
                            setShowReceipt(true);
                          }}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {translations[language].downloadEReceipt}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Suspense>
        </div>

        {showReceipt && selectedReceipt && (
          <ReceiptModal
            isOpen={showReceipt}
            onClose={() => setShowReceipt(false)}
            payment={selectedReceipt}
          />
        )}

      </main>

      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}
      
    </div>
  );
}

