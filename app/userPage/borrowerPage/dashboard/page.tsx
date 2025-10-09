'use client';

import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";

type Payment = {
  _id?: string;
  referenceNumber: string;
  datePaid?: string;
  amount?: number;
  mode: string;
};

interface PaymentHistoryModalProps {
  isOpen: boolean;
  animateIn: boolean;
  onClose: () => void;
  paidPayments: Payment[];
}

function PaymentHistoryModal({ isOpen, animateIn, onClose, paidPayments }: PaymentHistoryModalProps) {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  React.useEffect(() => {
    if (isOpen) setShouldRender(true);
    else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  if (!shouldRender) return null;
  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative text-black transform transition-all duration-300 ease-out overflow-y-auto max-h-[80vh] ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        {paidPayments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No paid payments yet.</p>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Reference Number</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Payment Date</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Amount Paid</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Mode</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.map((payment: Payment, index: number) => (
                  <tr
                    key={payment._id || index}
                    className="bg-white transition-colors"
                  >
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-800">{payment.referenceNumber}</td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {payment.datePaid ? new Date(payment.datePaid).toLocaleDateString('en-PH') : '-'}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-800">₱{payment.amount?.toLocaleString() ?? '0'}</td>
                    <td className="px-4 py-3 border-b border-gray-200 text-green-700 font-medium">{payment.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, act } from 'react';
import { FiMaximize } from 'react-icons/fi';
import Borrower from '../page';

interface Collection {
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  status: string;
  referenceNumber: string;
  borrowersId: string;
  loanId: string;
}

interface Loan {
  loanId: string;
  dateDisbursed?: string;
  totalPayable?: number;
  borrowersId: string;
  paymentProgress?: number;
  principal: number;
  interestRate: number;
  termsInMonths: number;
  loanType: string;
  interestAmount: string; 
  totalInterest: string;
  monthlyDue: string;
}

interface Payments {
  referenceNumber: string;
  datePaid: string;
  amount: number;
  mode: string;
}

export default function BorrowerDashboard() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalAnimateIn, setPaymentModalAnimateIn] = useState(false);

  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProgress, setPaymentProgress] = useState(0);

  const [paidPayments, setPaidPayments] = useState<any[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') || '' : '';

  // Fetch active loan
  useEffect(() => {
    if (!borrowersId) return;
    async function fetchActiveLoan() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/borrower-loans-details/${borrowersId}`);
        if (!res.ok) throw new Error('No active loan found');
        const data: Loan = await res.json();
        setActiveLoan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching active loan');
      } finally {
        setLoading(false);
      }
    }
    fetchActiveLoan();
  }, [borrowersId]);
  
// Fetch all payments for the borrower
useEffect(() => {
  if (!borrowersId) return;

  async function fetchPayments() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/payments/${borrowersId}`);
      if (!res.ok) throw new Error('Failed to fetch payments');

      const data: Payments[] = await res.json();

      // Remove duplicates based on referenceNumber
      const uniquePayments = data.filter(
        (payment, index, self) =>
          index === self.findIndex(p => p.referenceNumber === payment.referenceNumber)
      );

      setPaidPayments(uniquePayments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching payments');
    } finally {
      setLoading(false);
    }
  }

  fetchPayments();
}, [borrowersId]);



   // Fetch collections
   useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return; 
    async function fetchCollections() {
      setLoading(true);
      setError('');
      try {
  if (!activeLoan) return;
  const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${activeLoan.loanId}`);
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data: Collection[] = await res.json();
        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching collections');
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [activeLoan, borrowersId]);

  useEffect(() => {
    if (!activeLoan) return;
  
    if (collections.length > 0) {
      const totalAmount = collections.reduce((sum, c) => sum + c.periodAmount, 0);
      const paidAmount = collections
        .filter(c => c.status === 'Paid')
        .reduce((sum, c) => sum + c.periodAmount, 0);
  
      const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
      setPaymentProgress(Math.round(progress));
    } else {
      setPaymentProgress(0);
    }
  }, [activeLoan, collections]);

  

    // PayMongo handler
async function handlePay(collection: Collection) {
  if (!activeLoan) return;

  const amountToPay = collection.periodAmount ?? 0;

  if (amountToPay <= 0) {
    setErrorMsg('This collection has no amount due.');
    setShowErrorModal(true);
    return;
  }

  try {
    console.log('Paying collection:', {
      amount: amountToPay,
      collectionNumber: collection.collectionNumber,
      referenceNumber: collection.referenceNumber,
      borrowersId: activeLoan.borrowersId
    });

    const res = await fetch(`http://localhost:3001/payments/paymongo/gcash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountToPay,
        collectionNumber: collection.collectionNumber,
        referenceNumber: collection.referenceNumber,
        borrowersId: activeLoan.borrowersId
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Backend error:', errorData);
      setErrorMsg(`Payment failed: ${errorData.error || 'Unknown error'}`);
      setShowErrorModal(true);
      return;
    }

    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      setErrorMsg('Failed to create payment.');
      setShowErrorModal(true);
    }
  } catch (err) {
    console.error(err);
    setErrorMsg('Error connecting to payment gateway.');
    setShowErrorModal(true);
  }
}


  // Animate Payment Modal like Login Modal
  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentModalAnimateIn(false);
      const timer = setTimeout(() => setPaymentModalAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setPaymentModalAnimateIn(false);
    }
  }, [isPaymentModalOpen]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 flex p-6 gap-6 text-black">
        {/* Left side */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Top box */}
         {/* Loan Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-6   relative overflow-hidden">
          <h2 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2 z-10">
            <span>Loan Details</span>
          </h2>
          <div className="grid grid-cols-2 gap-6 text-gray-700 z-10">
            {/* Left Column */}
            <div className="flex flex-col gap-4 pr-4 border-r border-gray-200">
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Loan ID</span>
                <span className="ml-auto font-semibold text-gray-800">{activeLoan?.loanId || 'N/A'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Loan Type</span>
                <span className="ml-auto font-semibold text-gray-800">{activeLoan?.loanType || 'N/A'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Date Disbursed</span>
                <span className="ml-auto font-semibold text-gray-800">{formatDate(activeLoan?.dateDisbursed)}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Interest Rate</span>
                <span className="ml-auto font-semibold text-gray-800">{activeLoan?.interestRate}%</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 pl-4">
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Principal</span>
                <span className="ml-auto font-bold text-gray-800 text-lg">₱{activeLoan?.principal?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Interest Amount</span>
                <span className="ml-auto font-semibold text-gray-800">₱{activeLoan?.interestAmount?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Total Interest</span>
                <span className="ml-auto font-semibold text-gray-800">₱{activeLoan?.totalInterest?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Total Payable</span>
                <span className="ml-auto font-bold text-gray-800 text-lg">₱{activeLoan?.totalPayable?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex items-center group transition">
                <span className="font-medium text-gray-500">Monthly Due</span>
                <span className="ml-auto font-bold text-gray-800 text-lg">₱{activeLoan?.monthlyDue?.toLocaleString() ?? '0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
          <div className="flex gap-6">
            {/* Left large box: Payment History */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow relative">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-m mb-4">Payment History</h2>
                <FiMaximize
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                  size={20}
                  onClick={() => setIsPaymentModalOpen(true)}
                />
              </div>

              {/* Small content preview */}
              <div className="mt-2 flex flex-col gap-2 max-h-48 overflow-y-auto">
                {paidPayments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No payments made yet.</p>
                ) : (
                  paidPayments
                    .slice(0, 3) 
                    .map((payment, index) => (
                      <div
                        key={payment._id || index}
                        className="flex justify-between items-center px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-800 text-sm truncate">{payment.referenceNumber}</span>
                          <span className="text-gray-500 text-xs">{payment.datePaid ? new Date(payment.datePaid).toLocaleDateString('en-PH') : '-'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-gray-800 font-semibold text-sm">₱{payment.amount?.toLocaleString() ?? '0'}</span>
                          <span className="text-green-700 text-xs font-medium">{payment.mode}</span>
                        </div>
                      </div>
                    ))
                )}

                {paidPayments.length > 3 && (
                  <p className="text-gray-400 text-xs mt-1 text-center cursor-pointer" onClick={() => setIsPaymentModalOpen(true)}>
                    View all payments
                  </p>
                )}
              </div>
            </div>

            {/* Right two small boxes */}
            <div className="flex flex-col gap-6 w-1/2">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative">
              <h2 className="font-semibold text-lg text-gray-800 mb-6">Payment Progress</h2>

              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="60"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="60"
                    stroke="#10b981"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 60}`} 
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - paymentProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{paymentProgress}%</span>
                  <span className="text-sm text-gray-500 mt-1">Completed</span>
                </div>
              </div>

              <div className="mt-6 w-full flex justify-around text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{collections.filter(c => c.status === 'Paid').length}</span>
                  <span>Paid</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{collections.filter(c => c.status !== 'Paid').length}</span>
                  <span>Remaining</span>
                </div>
              </div>
            </div>


              <div className="bg-white p-6 rounded-lg shadow h-20">
              <h2 className="font-semibold text-m mb-4">Credit Score</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow flex flex-col gap-4 overflow-y-auto max-h-[100vh]">
          <h3 className="font-semibold text-2xl mb-6 text-gray-800">Upcoming Bills</h3>

          {activeLoan ? (() => {
            const upcoming = collections.filter(
              c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status !== 'Paid'
            );
            const paid = collections.filter(
              c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status === 'Paid'
            );

            return (
              <div className="flex flex-col gap-5">

                {/* Upcoming bills */}
                {upcoming.length > 0 ? upcoming.map((collection, index) => {
                  const canPay = index === 0 || upcoming[index - 1].status === "Paid";

                  return (
                    <div
                      key={collection.collectionNumber}
                      onClick={() => canPay && handlePay(collection)}
                      className={`transition-all duration-200 rounded-xl shadow-md p-5 flex flex-col gap-3
                        ${canPay ? "bg-white hover:bg-red-50 cursor-pointer" : "bg-gray-100 cursor-not-allowed opacity-70"}`}
                    >
                      <div className="flex justify-between items-center">
                        <p className={`font-semibold text-lg ${canPay ? "text-gray-900" : "text-gray-500"}`}>
                          Collection #{collection.collectionNumber}
                        </p>
                        <span className={`px-2 py-1 text-sm font-medium rounded-full 
                          ${canPay ? " text-red-600" : " text-gray-500"}`}>
                          {collection.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-gray-700">
                        <p className="text-sm">
                          <span className="font-medium">Due:</span> {new Date(collection.dueDate).toLocaleDateString('en-PH')}
                        </p>
                        <p className="font-semibold text-lg">₱{collection.periodAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-gray-500">No upcoming bills.</p>
                )}

                {/* Paid bills */}
                {paid.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Paid Collections</h4>
                    <div className="flex flex-col gap-3">
                      {paid.map(collection => (
                        <div
                          key={collection.collectionNumber}
                          className="p-4 rounded-xl shadow bg-gray-100 flex justify-between items-center opacity-80 cursor-not-allowed"
                        >
                          <div>
                            <p className="font-semibold text-gray-600">
                              Collection #{collection.collectionNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Due:</span> {new Date(collection.dueDate).toLocaleDateString('en-PH')}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-gray-800">₱{collection.periodAmount.toLocaleString()}</span>
                            <span className="text-sm font-medium text-green-700 px-2 py-1 rounded-full mt-1">Paid</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })() : (
            <p className="text-gray-500">No active loan found.</p>
          )}
        </div>


        {/* Payment History Modal */}
      {/* Payment History Modal with closing animation */}
      <PaymentHistoryModal
        isOpen={isPaymentModalOpen}
        animateIn={paymentModalAnimateIn}
        onClose={() => setIsPaymentModalOpen(false)}
        paidPayments={paidPayments}
      />

      {/* Error modal */}
      {showErrorModal && (
        <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />
      )}

      </div>
    </Borrower>
  );
}