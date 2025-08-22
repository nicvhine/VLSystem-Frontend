"use client";
import React, { useEffect, useState } from 'react';
import BorrowerNavbar from '../../components/borrower/borrowerNavbar/page';

// Define the type for a payment schedule entry
interface PaymentScheduleEntry {
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  status: string;
}
interface Loan {
  loanId: string;
  dateDisbursed?: string;
  totalPayable?: number;
  // Add more fields as needed
}

const borrowersId = 'B00001'; // Example value, replace with dynamic/session value as needed

export default function UpcomingBillsPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [payments, setPayments] = useState<PaymentScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchLoans() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/borrower-loans/${borrowersId}`);
        if (!res.ok) throw new Error('Failed to fetch loans');
        const data: Loan[] = await res.json();
        setLoans(data);
        if (data.length > 0) setSelectedLoanId(data[0].loanId); // Default to first loan
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching loans';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  useEffect(() => {
    async function fetchPayments() {
      if (!selectedLoanId) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${selectedLoanId}`);
        if (!res.ok) throw new Error('Failed to fetch payment schedule');
        const data: PaymentScheduleEntry[] = await res.json();
        setPayments(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error fetching payments';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [selectedLoanId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BorrowerNavbar />
      <main className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#ef4444' }}>Upcoming Bills</h2>
        {loans.length > 0 && (
          <div className="mb-6">
            <label htmlFor="loan-select" className="block mb-2 font-semibold text-gray-700">Select Loan:</label>
            <select
              id="loan-select"
              className="border rounded px-3 py-2 text-black bg-white"
              value={selectedLoanId}
              onChange={e => setSelectedLoanId(e.target.value)}
            >
              {loans.map(loan => (
                <option key={loan.loanId} value={loan.loanId} className="text-black bg-white">
                  {loan.loanId} {loan.dateDisbursed ? `- Disbursed: ${new Date(loan.dateDisbursed).toLocaleDateString()}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        <h3 className="text-xl font-bold mb-4 text-gray-800">Payment Schedule for Loan {selectedLoanId}</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <table className="w-full border text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Month</th>
                <th className="py-2 px-4 border">Due Date</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.collectionNumber}>
                  <td className="py-2 px-4 border text-center">{p.collectionNumber}</td>
                  <td className="py-2 px-4 border text-center">{new Date(p.dueDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="py-2 px-4 border text-center">₱{p.periodAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-4 border text-center">{p.status}</td>
                  <td className="py-2 px-4 border text-center">
                    {p.status === 'Unpaid' || p.status === 'Due' ? (
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Pay Now</button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
}
