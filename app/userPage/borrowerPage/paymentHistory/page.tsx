'use client';

import React, { useState } from 'react';
import Borrower from '../page';
import useBorrowerDashboard from '../dashboard/hooks';
import { Payment, Collection } from '@/app/commonComponents/utils/Types/collection';
import { formatDate } from '@/app/commonComponents/utils/formatters';
import ReceiptModal from '../modals/receipt';

export default function PaymentHistoryPage() {
  const [modalReceipt, setModalReceipt] = useState<string | null>(null);

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;
  const { paidPayments = [], collections = [], loading, error } = useBorrowerDashboard(borrowersId);

  // Sort payments by date ascending
  const sortedPayments = [...paidPayments].sort(
    (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime()
  );

  const totalPayable = collections.reduce((sum, c) => sum + (c.periodAmount ?? 0), 0);
  const totalPayments = paidPayments.length;
  const totalAmount = paidPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const latestPayment = paidPayments.length
    ? new Date(paidPayments[paidPayments.length - 1].datePaid ?? '')
    : null;

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

  let runningBalance = totalPayable;

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card title="Total Payments" value={totalPayments} />
            <Card title="Total Amount Paid" value={`₱${totalAmount.toLocaleString()}`} />
            <Card
              title="Latest Payment"
              value={latestPayment ? formatDate(latestPayment.toISOString()) : '-'}
            />            
            <Card
              title="Next Payment"
              value={nextPayment ? formatDate(new Date(nextPayment.dueDate).toISOString()) : 'All Paid'}
            />
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
            {sortedPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No payments made yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Reference Number</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Payment Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Loan Balance</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Amount Paid</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Mode</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPayments.map((payment: Payment, index: number) => {
                    const balanceBeforePayment = runningBalance; 
                    runningBalance -= payment.amount ?? 0;     
                    return (
                      <tr key={payment._id || index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800">{payment.referenceNumber}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(payment.datePaid)}</td>
                        <td className="px-6 py-4 text-red-700">
                          ₱{balanceBeforePayment.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-green-700">
                          ₱{(payment.amount ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{payment.mode}</td>
                        <td className="px-6 py-4">
                          {payment.receipt ? (
                            <button
                              onClick={() => setModalReceipt(payment.receipt!)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                            >
                              View Receipt
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Receipt Modal */}
          {modalReceipt && (
            <ReceiptModal
              receiptUrl={modalReceipt}
              onClose={() => setModalReceipt(null)}
            />
          )}
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
