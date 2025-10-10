"use client";
import React, { useEffect, useState } from 'react';
import BorrowerNavbar from '../../components/borrower/borrowerNavbar/page';

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
  return (
    <div className="min-h-screen bg-gray-50">
      <BorrowerNavbar />
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Upcoming Bills</h2>
        {activeLoan ? (
          collections.length > 0 ? (
            <div className="flex flex-col gap-4">
              {collections.map((c) => (
                <div
                  key={c.referenceNumber}
                  className={`p-5 rounded-xl shadow-md border transition ${
                    c.status === 'Paid' ? 'bg-gray-100 border-gray-300' : 'bg-white'
                  }`}
                  onClick={() => {
                    setSuccessMessage(`Pay for collection ${c.referenceNumber}`);
                    setSuccessModalOpen(true);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">Collection {c.collectionNumber}</p>
                    <p className={`font-semibold ${c.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>{c.status}</p>
                  </div>
                  <p className="text-gray-500 mb-1">
                    Due: {new Date(c.dueDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-800 font-medium">₱{c.periodAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming collections for this loan.</p>
          )
        ) : (
          <p className="text-gray-600">You have no active loans.</p>
        )}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            onClick={() => window.location.href = "/borrower/dashboard"}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
      }
    }
    fetchCollections();
  }, [activeLoan, borrowersId]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <BorrowerNavbar />
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Upcoming Bills</h2>

        {activeLoan ? (
          <>

            {collections.length > 0 ? (
              <div className="flex flex-col gap-4">
                {collections.map((c) => (
                  <div
                    key={c.referenceNumber}
                    className={`p-5 rounded-xl shadow-md border transition ${
                      c.status === 'Paid' ? 'bg-gray-100 border-gray-300' : 'bg-white'
                    }`}
                    onClick={() => alert(`Pay for collection ${c.referenceNumber}`)} 
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-800">Collection {c.collectionNumber}</p>
                      <p className={`font-semibold ${c.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>{c.status}</p>
                    </div>
                    <p className="text-gray-500 mb-1">
                      Due: {new Date(c.dueDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-gray-800 font-medium">₱{c.periodAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No upcoming collections for this loan.</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">You have no active loans.</p>
        )}

        <div className="mt-8 flex justify-center">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            onClick={() => window.location.href = "/borrower/dashboard"}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  );
}
