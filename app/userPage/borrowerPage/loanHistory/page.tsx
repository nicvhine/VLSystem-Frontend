'use client';

import React, { useEffect, useState } from 'react';
import { Loan } from '@/app/commonComponents/utils/Types/loan';
import { LoadingSpinner } from '@/app/commonComponents/utils/loading';
import { formatDate, formatCurrency } from '@/app/commonComponents/utils/formatters';
import Borrower from '../page';

export default function LoanHistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

  const borrowersId =
    typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;

  useEffect(() => {
    if (!borrowersId) return;

    const fetchLoans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/loans/all/${borrowersId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch loans');
        const data: Loan[] = await res.json();
        // Sort descending by date
        setLoans(
          data.sort(
            (a, b) =>
              new Date(b.dateDisbursed ?? 0).getTime() -
              new Date(a.dateDisbursed ?? 0).getTime()
          )
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [borrowersId]);

  // Correct total calculations
  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.appLoanAmount ?? 0),
    0
  );
  
  
  return (
    <Borrower>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Loan History</h1>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard label="Total Loans" value={loans.length} color="blue" />
          <MetricCard label="Total Loan Amount" value={formatCurrency(totalLoanAmount)} color="green" />
        </div>

        {/* Loan Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : loans.length === 0 ? (
          <p>No past loans found.</p>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
            {loans.map((loan) => {
              const isExpanded = expandedLoanId === loan.loanId;
              return (
                <div key={loan.loanId} className="border-b last:border-b-0">
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                    onClick={() =>
                      setExpandedLoanId(isExpanded ? null : loan.loanId)
                    }
                  >
                    <div>
                      <p className="text-gray-800 font-semibold">{loan.loanId}</p>
                      <p className="text-gray-500 text-sm">
                        {loan.dateDisbursed ? formatDate(loan.dateDisbursed) : '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          loan.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : loan.status === 'Inactive'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {loan.status}
                      </p>
                      <p className="text-gray-700 mt-1">{formatCurrency(loan.appLoanAmount)}</p>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 py-4 bg-gray-50 text-gray-700 text-sm space-y-2">
                      <p>
                        <span className="font-medium">Loan Type:</span> {loan.loanType}
                      </p>
                      <p>
                        <span className="font-medium">Total Payable:</span> {formatCurrency(loan.appTotalPayable)}
                      </p>
                      <p>
                        <span className="font-medium">Interest Rate:</span> {loan.appInterestRate ?? 0}%
                      </p>
                      <p>
                        <span className="font-medium">Total Interest:</span> {formatCurrency(loan.appTotalInterestAmount)}
                      </p>
                      <p>
                        <span className="font-medium">Terms:</span> {loan.appLoanTerms} months
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Borrower>
  );
}

// Metric Card Component
const MetricCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple';
}) => {
  const bgColor =
    color === 'blue'
      ? 'bg-blue-50 text-blue-800'
      : color === 'green'
      ? 'bg-green-50 text-green-800'
      : 'bg-purple-50 text-purple-800';

  return (
    <div className={`p-6 rounded-xl shadow ${bgColor} flex flex-col items-center`}>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
};
