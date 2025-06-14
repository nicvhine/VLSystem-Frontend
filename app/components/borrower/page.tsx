'use client';

import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface LoanDetails {
  loanId: string;
  interestType: string;
  interestRate: number;
  releaseDate: string;
  startDate: string;
  endDate: string;
  loanPeriod: string;
  numberOfPeriods: number;
  status: string;
  remainingBalance: number;
  totalPayment: number;
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
  const [creditScore] = useState(10);
  const [loanDetails] = useState<LoanDetails>({
    loanId: '2283',
    interestType: 'SIMPLE',
    interestRate: 4,
    releaseDate: '03-22-28',
    startDate: '04-22-28',
    endDate: '03-22-29',
    loanPeriod: 'Month',
    numberOfPeriods: 12,
    status: 'Active',
    remainingBalance: 90000,
    totalPayment: 30000,
  });

  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      reference: 'VL091232434',
      date: '04-22-2025',
      balance: 90000,
      periodAmount: 10000,
      paidAmount: 10000,
      mode: 'PayMongo',
    },
    {
      reference: 'VL091232435',
      date: '03-22-2025',
      balance: 100000,
      periodAmount: 10000,
      paidAmount: 10000,
      mode: 'Cash',
    },
    {
      reference: 'VL091232436',
      date: '02-22-2025',
      balance: 110000,
      periodAmount: 10000,
      paidAmount: 10000,
      mode: 'Paymongo',
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">
        Welcome, <span className="text-red-600">Nichole Vine Alburo</span>!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Score Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Credit Score</h2>
          <p className="text-sm text-gray-600 mb-4">Based on your repayment history</p>
          <div className="w-32 h-32 mx-auto">
            <CircularProgressbar
              value={creditScore}
              maxValue={10}
              text={`${creditScore}`}
              styles={buildStyles({
                pathColor: '#22c55e',
                textColor: '#111827',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <p className="text-center mt-4 text-gray-700">Good Standing</p>
        </div>

        {/* Current Loan Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Loan Details</h2>
            <span className="text-sm text-gray-500">Loan ID: {loanDetails.loanId}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Interest Type:</p>
              <p className="font-medium">{loanDetails.interestType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status:</p>
              <p className="font-medium text-green-600">{loanDetails.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate:</p>
              <p className="font-medium">{loanDetails.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date:</p>
              <p className="font-medium">{loanDetails.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Release Date:</p>
              <p className="font-medium">{loanDetails.releaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining Balance:</p>
              <p className="font-medium">₱{loanDetails.remainingBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date:</p>
              <p className="font-medium">{loanDetails.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payment:</p>
              <p className="font-medium">₱{loanDetails.totalPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date:</p>
              <p className="font-medium">{loanDetails.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Period:</p>
              <p className="font-medium">{loanDetails.loanPeriod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Number of Periods:</p>
              <p className="font-medium">{loanDetails.numberOfPeriods}</p>
            </div>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Payment Progress</h2>
          <div className="w-32 h-32 mx-auto mb-4">
            <CircularProgressbar
              value={10}
              text={`10%`}
              styles={buildStyles({
                pathColor: '#22c55e',
                textColor: '#111827',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">Paid</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            Pay Now
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            You are not yet eligible for Reloan
          </p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-Receipt
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentHistory.map((payment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{payment.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{payment.periodAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{payment.paidAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.mode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-800">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 