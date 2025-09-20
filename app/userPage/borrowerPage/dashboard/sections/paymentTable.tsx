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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {translations[language].paymentHistory}
        </h3>
      </div>
      
      <Suspense fallback={<div className="p-4 text-center">{translations[language].loading}</div>}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].referenceNumber}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].date}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].periodAmount}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].paidAmount}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].mode}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations[language].eReceipt}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.referenceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.datePaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(monthlyDue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button
                        onClick={() => {
                          setSelectedReceipt(payment);
                          setShowReceipt(true);
                        }}
                        className="hover:text-blue-800 underline"
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
