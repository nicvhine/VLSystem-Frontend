'use client';

import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangePasswordModal from './components/forceChange';

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


  useEffect(() => {
  const mustChange = localStorage.getItem('forcePasswordChange');
  if (mustChange === 'true') {
    setShowChangePasswordModal(true);
  }
}, []);

  useEffect(() => {
    const borrowersId = localStorage.getItem('borrowersId');
    if (!borrowersId) {
      console.warn('No borrower ID found — logged out?');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch loan');
        return res.json();
      })
      .then(data => setLoanInfo(data))
      .catch(err => console.error('Loan fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading loan info...</div>;
  if (!loanInfo) return <div className="p-6 text-center text-red-500">No active loan found.</div>;

  const {
    loanId, name, interestRate, releaseDate,
    startDate, endDate, loanPeriod, numberOfPeriods,
    status, remainingBalance, totalPayment,
    creditScore, paymentHistory
  } = loanInfo;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">
        Welcome, <span className="text-red-600">{name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Score Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Credit Score</h2>
          <div className="w-32 h-32 mx-auto mb-4">
            <CircularProgressbar
              value={creditScore}
              maxValue={10}
              text={`${creditScore}`}
              styles={buildStyles({
                pathColor:
                  creditScore >= 7.5 ? '#22c55e' :
                  creditScore >= 5 ? '#eab308' :
                  '#dc2626',
                textColor: '#111827',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <p className="text-center mt-2 text-gray-700">
            {creditScore >= 7.5 ? 'Good Standing' :
             creditScore >= 5 ? 'Fair Standing' :
             'Poor Standing'}
          </p>
        </div>

        {/* Current Loan Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Loan Details</h2>
            <span className="text-sm text-gray-500">ID: {loanId}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Status:</strong> <span className="text-green-600">{status}</span></div>
            <div><strong>Interest Rate:</strong> {interestRate}%</div>
            <div><strong>Due Date:</strong> {endDate}</div>
            <div><strong>Release Date:</strong> {releaseDate}</div>
            <div><strong>Start Date:</strong> {startDate}</div>
            <div><strong>Loan Period:</strong> {loanPeriod}</div>
            <div><strong>Number of Payments:</strong> {numberOfPeriods}</div>
          </div>
        </div>

      </div>

    {showChangePasswordModal && (
  <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
)}

    </div>
  );
}
