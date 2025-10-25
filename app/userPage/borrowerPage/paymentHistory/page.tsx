'use client';

import React from 'react';
import Borrower from '../page';
import useBorrowerDashboard from '../dashboard/hooks';
import { Payment } from '@/app/commonComponents/utils/Types/collection';
import { format } from 'date-fns';

export default function PaymentHistoryPage() {
  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;
  const { paidPayments = [], collections = [], loading, error } = useBorrowerDashboard(borrowersId);

  // Summary Calculations
  const totalPayments = paidPayments.length;
  const totalAmount = paidPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const latestPayment = paidPayments.length
    ? new Date(paidPayments[paidPayments.length - 1].datePaid ?? '')
    : null;
  const averagePayment = totalPayments ? totalAmount / totalPayments : 0;

  const nextPayment = collections
    .filter(c => c.status !== 'Paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-gray-500 text-lg">Loading payments...</span>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-red-600 text-lg">{error}</span>
    </div>
  );

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card title="Total Payments" value={totalPayments} />
            <Card title="Total Amount Paid" value={`₱${totalAmount.toLocaleString()}`}/>
            <Card title="Latest Payment" value={latestPayment ? format(latestPayment, 'MMM dd, yyyy') : '-'} />
            <Card title="Next Payment" value={nextPayment ? format(new Date(nextPayment.dueDate), 'MMM dd, yyyy') : 'All Paid'} />
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            {paidPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No payments made yet.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Reference Number</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Payment Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Amount Paid</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Mode</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paidPayments.map((payment: Payment, index: number) => {
                    const totalCollectionAmount = collections.reduce((sum, c) => sum + c.periodAmount, 0);
                    const progressPercent = totalCollectionAmount
                      ? Math.round((payment.amount ?? 0) / totalCollectionAmount * 100)
                      : 0;

                    return (
                      <tr key={payment._id || index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800">{payment.referenceNumber}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {payment.datePaid ? format(new Date(payment.datePaid), 'MMM dd, yyyy') : '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          ₱{payment.amount?.toLocaleString() ?? '0'}
                        </td>
                        <td className="px-6 py-4 text-green-700 font-medium">{payment.mode}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Borrower>
  );
}

// Reusable summary card
const Card = ({ title, value, highlight }: { title: string; value: string | number; highlight?: boolean }) => (
  <div className={`bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center ${highlight ? 'border-l-4 border-green-500' : ''}`}>
    <span className="text-gray-500 text-sm">{title}</span>
    <span className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</span>
  </div>
);
