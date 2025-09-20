'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptModal from '../modals/receipt';
import PaymentProgress from './sections/paymentProgress';
import translations from '../components/translation';
import Borrower from '../page';
import CreditScore from './sections/creditScore';
import LoanDetails from './sections/loanDetails';
import PaymentTable from './sections/paymentTable';
import RecentActivityFeed from './sections/recentActivityFeed';
import { useBorrowerDashboard } from '../components/handlers';

interface Collection {
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  status: string;
  referenceNumber: string;
}

export default function BorrowerDashboard() {

  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
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

  // Fetch collections for the payment history section
  useEffect(() => {
    if (!loanInfo || !loanInfo.loanId) return;
    const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') || '' : '';
    if (!borrowersId) return;
    async function fetchCollections() {
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${loanInfo.loanId}`);
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let errorText = await res.text();
          console.error('Fetch failed:', errorText);
          throw new Error('Failed to fetch collections');
        }
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Expected JSON, got:', text);
          throw new Error('Response is not JSON');
        }
        const data: Collection[] = await res.json();
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    }
    fetchCollections();
  }, [loanInfo]);

  // PayMongo handler for collections
  async function handlePay(collection: Collection) {
    const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') || '' : '';
    if (!borrowersId) return;
    const amountToPay = collection.periodAmount ?? 0;
    if (amountToPay <= 0) {
      alert('This collection has no amount due.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/payments/paymongo/gcash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          collectionNumber: collection.collectionNumber,
          referenceNumber: collection.referenceNumber,
          borrowersId: borrowersId
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Payment failed: ${errorData.error || 'Unknown error'}`);
        return;
      }
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Failed to create payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to payment gateway.');
    }
  }

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
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Left Sidebar - User Profile */}
          <div className="w-80 bg-gray-100 text-gray-800 p-6 min-h-screen">
            {/* User Profile Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-500 text-2xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-1">{name || 'User'}</h2>
              <p className="text-gray-600 text-sm">
                {new Date().toLocaleDateString('en-PH', { 
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID number:</span>
                <span className="font-mono">{loanId?.slice(-8) || '--------'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score:</span>
                <span className="font-semibold">{creditScore}/850</span>
              </div>
            </div>

            {/* Loan Information Section */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Loan Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">₱{((loanInfo?.paidAmount || 0) + (loanInfo?.balance || 0)).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Due:</span>
                  <span className="font-semibold">₱{(loanInfo?.monthlyDue || 0).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding:</span>
                  <span className="font-semibold text-red-600">₱{(loanInfo?.balance || 0).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">₱{(loanInfo?.paidAmount || 0).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{loanInfo?.interestRate || 5}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Terms:</span>
                  <span className="font-semibold">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Type:</span>
                  <span className="font-semibold">Personal Loan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold">
                    {loanInfo?.startDate 
                      ? new Date(loanInfo.startDate).toLocaleDateString('en-PH')
                      : new Date().toLocaleDateString('en-PH')
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">
                    {loanInfo?.endDate 
                      ? new Date(loanInfo.endDate).toLocaleDateString('en-PH')
                      : 'TBD'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold text-orange-600">{paymentProgress}%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500">
                Last updated on {new Date().toLocaleDateString('en-PH', { 
                  month: 'short',
                  day: 'numeric', 
                  year: 'numeric'
                })} at {new Date().toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loan Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Loan Stats */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Loan Progress</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${paymentProgress * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-900">{paymentProgress}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Completed:</span>
                    <span className="font-medium">{Math.round(paymentProgress)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Remaining:</span>
                    <span className="font-medium">{100 - Math.round(paymentProgress)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>

              {/* Current Balance */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Outstanding Balance</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    ₱{(loanInfo?.balance || 0).toLocaleString('en-PH')}
                  </div>
                  <div className="text-sm text-gray-500">Remaining Amount</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Monthly Due:</span>
                    <span className="font-medium">₱{(loanInfo?.monthlyDue || 0).toLocaleString('en-PH')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Next Payment:</span>
                    <span className="font-medium text-orange-600">Due Soon</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Summary</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ₱{(loanInfo?.paidAmount || 0).toLocaleString('en-PH')}
                  </div>
                  <div className="text-sm text-gray-500">Total Paid</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Payments Made:</span>
                    <span className="font-medium">{payments?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">• On Time:</span>
                    <span className="font-medium text-green-600">100%</span>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Loan Details</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ₱{((loanInfo?.paidAmount || 0) + (loanInfo?.balance || 0)).toLocaleString('en-PH')}
                  </div>
                  <div className="text-sm text-gray-500">Original Amount</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Interest Rate:</span>
                    <span className="font-medium">{loanInfo?.interestRate || 5}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">• Term:</span>
                    <span className="font-medium">12 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Payment History - Takes 2 columns */}
              <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Bills</h3>
                    <button 
                      onClick={() => window.location.href = "/userPage/borrowerPage/pages/upcoming-bills"}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {collections.length > 0 ? (
                    <div className="space-y-3">
                      {collections.slice(0, 3).map((c) => (
                        <div
                          key={c.referenceNumber}
                          className={`group p-4 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                            c.status === 'Paid' ? 'bg-gray-50 border-gray-200' : 'bg-white hover:bg-green-50 border-green-200'
                          }`}
                          onClick={() => c.status !== 'Paid' && handlePay(c)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 text-base">Collection {c.collectionNumber}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{c.status}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-gray-500 text-sm">Due: {new Date(c.dueDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="text-gray-900 font-bold text-lg">₱{(c.periodAmount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                          </div>
                          {c.status !== 'Paid' && (
                            <span className="absolute top-0 right-0 m-3 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Pay now</span>
                          )}
                        </div>
                      ))}
                      {collections.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-gray-500 text-sm">Showing 3 of {collections.length} bills</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming bills available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Feed - Takes 1 column */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
                </div>
                <div className="p-4">
                  <PaymentTable
                    payments={payments}
                    loanId={loanId}
                    monthlyDue={monthlyDue}
                    balance={balance}
                    translations={translations}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && selectedReceipt && (
          <ReceiptModal
            isOpen={showReceipt}
            onClose={() => setShowReceipt(false)}
            payment={selectedReceipt}
          />
        )}
      </div>
    </Borrower>
  );
}
