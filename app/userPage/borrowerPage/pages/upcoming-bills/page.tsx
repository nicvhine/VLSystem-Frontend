"use client";
import React, { useEffect, useState } from 'react';
import BorrowerNavbar from '../../navbar/page';

interface Collection {
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  status: string;
  referenceNumber: string;
}

interface Loan {
  loanId: string;
  dateDisbursed?: string;
  totalPayable?: number;
  borrowersId: string;
  paymentProgress?: number;
}

export default function UpcomingBillsPage() {
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!activeLoan?.loanId || !borrowersId) return; // <-- optional chaining ensures null safety
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
    <div className="min-h-screen bg-gray-50">
      <BorrowerNavbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => window.location.href = "/userPage/borrowerPage/dashboard"}
            className="mr-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none border border-gray-200"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Upcoming Bills</h2>
        </div>

        {activeLoan ? (
          collections.length > 0 ? (
            <div className="flex flex-col gap-5">
              {collections.map((c) => (
                <div
                  key={c.referenceNumber}
                  className={`group p-6 rounded-2xl border shadow-sm transition cursor-pointer relative overflow-hidden ${
                    c.status === 'Paid' ? 'bg-gray-50 border-gray-200' : 'bg-white hover:bg-green-50 border-green-200'
                  }`}
                  onClick={() => handlePay(c)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-base sm:text-lg">Collection {c.collectionNumber}</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${c.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{c.status}</span>
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
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">No upcoming collections for this loan.</p>
          )
        ) : (
          <p className="text-gray-500 text-center mt-10">You have no active loans.</p>
        )}

        {/* Removed Back to Dashboard button, replaced by top left arrow */}
      </main>
    </div>
  );
}
