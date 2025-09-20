'use client';

import React, { useState, useEffect } from 'react';
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
}

export default function BorrowerDashboard() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProgress, setPaymentProgress] = useState(0);


  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') || '' : '';

  // Fetch active loan
  useEffect(() => {
    if (!borrowersId) return;
    async function fetchActiveLoan() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`);
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

   // Fetch collections
   useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return; 
    async function fetchCollections() {
      setLoading(true);
      setError('');
      try {
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
    alert('This collection has no amount due.');
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


  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 flex p-6 gap-6 text-black">
        {/* Left side */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Top box */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Loan ID</span>
                <span className="text-gray-900">{activeLoan?.loanId || 'N/A'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Date Disbursed</span>
                <span className="text-gray-900">
                  {activeLoan?.dateDisbursed ? new Date(activeLoan.dateDisbursed).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Principal Amount</span>
                <span className="text-gray-900">₱{activeLoan?.principal?.toLocaleString() ?? '0'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Total Payable</span>
                <span className="text-gray-900">₱{activeLoan?.totalPayable?.toLocaleString() ?? '0'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Interest Rate</span>
                <span className="text-gray-900">{activeLoan?.interestRate ?? 0}%</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Due Date</span>
                <span className="text-gray-900">
                  {activeLoan?.dateDisbursed
                    ? new Date(activeLoan.dateDisbursed).toLocaleDateString()
                    : 'N/A'}
                </span>
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
              <div className="mt-4">
              </div>
            </div>

            {/* Right two small boxes */}
            <div className="flex flex-col gap-6 w-1/2">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative">
              <h2 className="font-semibold text-lg text-gray-800 mb-6">Loan Progress</h2>

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
          <h3 className="font-semibold text-xl mb-4">Upcoming Bills</h3>

          {activeLoan ? (
            (() => {
              const upcoming = collections.filter(
                c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status !== 'Paid'
              );
              const paid = collections.filter(
                c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status === 'Paid'
              );

              return (
                <div className="flex flex-col gap-4">
                  {/* Upcoming bills */}
                  {upcoming.length > 0 ? upcoming.map(collection => (
                    <div
                      key={collection.collectionNumber}
                      onClick={() => handlePay(collection)}
                      className="cursor-pointer p-4 rounded-xl shadow-md bg-white hover:bg-red-600 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-lg text-gray-900 group-hover:text-white">
                          Collection #{collection.collectionNumber}
                        </p>
                        <span className={`text-sm font-medium text-red-600 group-hover:text-white`}>
                          {collection.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-700 group-hover:text-white">
                        <p className="text-sm">
                          <span className="font-medium">Due:</span> {new Date(collection.dueDate).toLocaleDateString('en-PH')}
                        </p>
                        <p className="font-semibold text-lg">
                          ₱{collection.periodAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) : <p className="text-gray-500">No upcoming bills.</p>}

                  {/* Paid bills */}
                  {paid.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Paid Collections</h4>
                      <div className="flex flex-col gap-2">
                        {paid.map(collection => (
                          <div
                            key={collection.collectionNumber}
                            className="p-4 rounded-xl shadow bg-gray-100 cursor-not-allowed"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-semibold text-lg text-gray-600">
                                Collection #{collection.collectionNumber}
                              </p>
                              <span className="text-sm font-medium text-green-700">
                                Paid
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                              <p className="text-sm">
                                <span className="font-medium">Due:</span> {new Date(collection.dueDate).toLocaleDateString('en-PH')}
                              </p>
                              <p className="font-semibold text-lg">
                                ₱{collection.periodAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <p className="text-gray-500">No active loan found.</p>
          )}
        </div>

        {/* Payment History Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="space-y-2">
              </div>
            </div>
          </div>
        )}
      </div>
    </Borrower>
  );
}
