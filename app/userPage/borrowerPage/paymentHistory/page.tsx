"use client";

import React, { useState } from "react";
import Borrower from "../page";
import useBorrowerDashboard from "../dashboard/hooks";
import { Payment, Collection } from "@/app/commonComponents/utils/Types/collection";
import { formatDate } from "@/app/commonComponents/utils/formatters";
import ReceiptModal from "../modals/receipt";
import Pagination from "@/app/commonComponents/utils/pagination";

export default function PaymentHistoryPage() {
  const [modalPayment, setModalPayment] = useState<Payment | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;
  const { paidPayments = [], collections = [], loading, error } = useBorrowerDashboard(borrowersId);

  // Sort payments by date ascending
  const sortedPayments = [...paidPayments].sort(
    (a, b) => new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedPayments.length / pageSize));
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <div className="max-w-screen-2xl mx-auto w-full">

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            {sortedPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No payments made yet.</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    {[
                      'Reference Number',
                      'Payment Date',
                      'Loan Balance',
                      'Amount Paid',
                      'Mode',
                      'Receipt',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedPayments.map((payment: Payment, index: number) => {
                    const balanceBeforePayment = runningBalance;
                    runningBalance -= payment.amount ?? 0;
                    return (
                      <tr
                        key={payment._id || index}
                        className="hover:bg-gray-50 transition-colors cursor-default"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{payment.referenceNumber}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.datePaid)}</td>
                        <td className="px-6 py-4 text-red-700">₱{balanceBeforePayment.toLocaleString()}</td>
                        <td className="px-6 py-4 text-green-700">₱{(payment.amount ?? 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{payment.mode}</td>
                        <td className="px-6 py-4">
                          {payment.receipt ? (
                            <button
                              onClick={() => setModalPayment(payment)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              totalCount={sortedPayments.length}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              language={'en'}
            />
          </div>

          {/* Receipt Modal */}
          {modalPayment && (
            <ReceiptModal
              isOpen={true}
              payment={modalPayment}
              onClose={() => setModalPayment(null)}
            />
          )}
        </div>
      </div>
    </Borrower>
  );
}

// Reusable summary card (subtle, neutral styling — no bright colors)
const Card = ({ title, value, highlight }: { title: string; value: string | number; highlight?: boolean }) => (
  <div className={`relative bg-white shadow-sm rounded-xl p-5 flex items-center space-x-4 border border-gray-100 ${highlight ? 'ring-1 ring-gray-200' : ''}`}>
    {/* Muted vertical accent — keeps visual separation without using bright colors */}
    <div className={`w-1.5 h-10 rounded ${highlight ? 'bg-gray-400' : 'bg-gray-200'}`} />

    <div className="flex-1">
      <div className="text-gray-500 text-sm font-medium tracking-wide">{title}</div>
      <div className="text-lg md:text-xl font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  </div>
);
