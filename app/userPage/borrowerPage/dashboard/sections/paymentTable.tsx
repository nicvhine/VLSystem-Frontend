'use client';

import { useState, Suspense } from 'react';
import ReceiptModal from '../../modals/receipt';

interface Payment {
  loanId: string;
  referenceNumber: string;
  borrowersId: string;
  collector: string;
  amount: number;
  datePaid: string;
}

interface PaymentTableProps {
  payments: Payment[];
  loanId: string;
  monthlyDue: number;
  balance: number;
  translations: any;
  language: 'en' | 'ceb';
}

export default function PaymentTable({
  payments,
  loanId,
  monthlyDue,
  balance,
  translations,
  language
}: PaymentTableProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredPayments = Object.values(
    payments
      .filter(payment => payment.loanId === loanId)
      .reduce((acc, payment) => {
        if (!acc[payment.referenceNumber]) {
          acc[payment.referenceNumber] = { ...payment };
        } else {
          acc[payment.referenceNumber].amount += payment.amount;
        }
        return acc;
      }, {} as Record<string, Payment>)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 sm:mt-10">
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{translations[language].paymentHistory}</h3>
      </div>
      <Suspense fallback={<div className="p-4 text-center">{translations[language].loading}</div>}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].referenceNumber}</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].date}</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].periodAmount}</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600">{translations[language].paidAmount}</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">{translations[language].mode}</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 hidden sm:table-cell">{translations[language].eReceipt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{payment.referenceNumber}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{formatDate(payment.datePaid)}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600">{formatCurrency(monthlyDue)}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 hidden sm:table-cell">-</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <button
                        onClick={() => {
                          setSelectedReceipt(payment);
                          setShowReceipt(true);
                        }}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {translations[language].download}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {translations[language].noPaymentHistory}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile-specific UI */}
          <div className="sm:hidden">
            {filteredPayments.map((payment, idx) => (
              <div key={`mobile-${idx}`} className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">{translations[language].balance}:</span> {formatCurrency(balance)}</p>
                  <p><span className="font-medium">{translations[language].mode}:</span> -</p>
                  <button
                    onClick={() => {
                      setSelectedReceipt(payment);
                      setShowReceipt(true);
                    }}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {translations[language].downloadEReceipt}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Suspense>

      {showReceipt && selectedReceipt && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          payment={selectedReceipt}
        />
      )}
    </div>
  );
}
