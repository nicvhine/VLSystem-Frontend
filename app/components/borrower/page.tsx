'use client';

import { useState, useEffect, Suspense } from 'react';
import { jwtDecode } from 'jwt-decode';
import ChangePasswordModal from './components/forceChange';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/borrower/navbar';
import Link from 'next/link';

interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  releaseDate: string;
  startDate: string;
  endDate: string;
  loanPeriod: string;
  numberOfPeriods: number;
  status: string;
  remainingBalance: number;
  totalPayment: number;
  creditScore: number;
  paymentHistory: PaymentHistory[];
}

interface PaymentHistory {
  reference: string;
  date: string;
  balance: number;
  periodAmount: number;
  paidAmount: number;
  mode: string;
}

export default function BorrowerDashboard() {
  const [loanInfo, setLoanInfo] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false); 
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

      fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch loan');
          return res.json();
        })
        .then(data => {
          setLoanInfo(data);
          setAuthenticated(true); 
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

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  // Calculate payment progress percentage
  const calculatePaymentProgress = () => {
    if (!loanInfo) return 0;
    const totalLoan = loanInfo.totalPayment;
    const remaining = loanInfo.remainingBalance;
    const paid = totalLoan - remaining;
    return Math.round((paid / totalLoan) * 100);
  };

  if (loading) return <div className="p-6 text-center">Loading loan info...</div>;
  if (!loanInfo) return <div className="p-6 text-center text-red-500">No active loan found.</div>;

  const {
    loanId, name, interestRate, releaseDate,
    startDate, endDate, loanPeriod, numberOfPeriods,
    status, remainingBalance, totalPayment,
    creditScore, paymentHistory
  } = loanInfo;

  const paymentProgress = calculatePaymentProgress();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar/>

      <main className="max-w-10xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          Welcome, <span className="text-red-600">{name}</span>!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Credit Score */}
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col items-center text-gray-800 hover:shadow-lg transition">
            <div className="text-lg sm:text-xl font-semibold mb-1">Your Credit Score</div>
            <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">Based on your repayment history</div>

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
                creditScore >= 7.5 ? 'Good Standing' :
                creditScore >= 5 ? 'Fair Standing' :
                'Poor Standing'
              }
            </span>
          </div>

          {/* Loan Details */}
          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 text-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Current Loan Details</h2>
              <span className="text-xs sm:text-sm text-gray-600">
                Loan ID: <span className="font-medium text-red-500">{loanId}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <p><span className="font-medium">Interest Rate:</span> {interestRate}%</p>
                <p><span className="font-medium">Release Date:</span> {releaseDate}</p>
                <p><span className="font-medium">Start Date:</span> {startDate}</p>
                <p><span className="font-medium">End Date:</span> {endDate}</p>
                <p><span className="font-medium">Loan Period:</span> {loanPeriod}</p>
                <p><span className="font-medium">Number of Periods:</span> {numberOfPeriods}</p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600 font-semibold">{status}</span></p>
                <p><span className="font-medium">Remaining Balance:</span> {formatCurrency(remainingBalance)}</p>
                <p><span className="font-medium">Total Payments:</span> {formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-gray-800 hover:shadow-lg transition">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Progress</h2>
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
                  strokeDasharray={`${paymentProgress}, 100`}
                  stroke="currentColor"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold">
                <span className="text-xl sm:text-2xl text-gray-800">{paymentProgress}%</span>
                <span className="text-gray-500">Paid</span>
              </div>
            </div>
            <button className="bg-green-600 text-white px-4 py-3 sm:p-4 rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base w-full sm:w-auto">
              <Link href="/borrower/upcoming-bills">Pay Now</Link>
            </button>
            <p className='mt-3 sm:mt-5 text-xs sm:text-sm text-center text-gray-600'>You are not yet eligible for Reloan.</p>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 sm:mt-10">
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
          </div>
          <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">Reference #</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">Date</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Balance</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">Period Amount</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">Paid Amount</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Mode</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">E-Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory && paymentHistory.length > 0 ? (
                    paymentHistory.map((payment, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{payment.reference}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{payment.date}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden sm:table-cell">{formatCurrency(payment.balance)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600">{formatCurrency(payment.periodAmount)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{formatCurrency(payment.paidAmount)}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell">{payment.mode}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <a
                            href="#"
                            className="text-blue-600 underline hover:text-blue-800"
                            download
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 sm:px-6 py-8 text-center text-gray-500">
                        No payment history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Mobile-specific info cards for hidden columns */}
            <div className="sm:hidden">
              {paymentHistory && paymentHistory.length > 0 && paymentHistory.map((payment, idx) => (
                <div key={`mobile-${idx}`} className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><span className="font-medium">Balance:</span> {formatCurrency(payment.balance)}</p>
                    <p><span className="font-medium">Mode:</span> {payment.mode}</p>
                    <a href="#" className="text-blue-600 underline hover:text-blue-800" download>
                      Download E-Receipt
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </main>

      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}
    </div>
  );
}

// const handleLogout = () => {
//   localStorage.clear();
//   router.push('/');
// };


//  <button
//       onClick={handleLogout}
//       className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//     >
//       Logout
// </button>