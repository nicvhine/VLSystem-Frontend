'use client';

import React, { useEffect, useState } from 'react';
import { FiPrinter, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';

interface ReceiptModalProps {
  payment: {
    referenceNumber: string;
    amount: number;
    datePaid: string;
    loanId: string;
    borrowersId: string;
    collector?: string;
    mode?: string;
    paidToCollection?: number;
  };
  borrowerName?: string;
  showPrint?: boolean; // Optional: defaults to true for collectors, false for borrowers
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, borrowerName, showPrint = true, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') handleClose(); 
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Animation timing on mount
  useEffect(() => {
    setShowModal(true);
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setShowModal(false);
      onClose();
    }, 300);
  };

  const handlePrint = () => {
    setTimeout(() => window.print(), 100);
  };

  const formattedDate = new Date(payment.datePaid).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(payment.datePaid).toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!showModal) return null;

  const modalContent = (
    <>
      {/* Print Styles - 57mm thermal receipt */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #receiptPrintSection,
          #receiptPrintSection * {
            visibility: visible !important;
          }
          #receiptPrintSection {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 57mm !important;
            margin: 0 !important;
            padding: 3mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: 57mm auto;
            margin: 0;
          }
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full relative transform transition-all duration-300 ease-out ${
          animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}>
          {/* Header - No Print */}
          <div className="flex justify-between items-center px-6 py-4 border-b no-print">
            <h2 className="text-xl font-semibold text-gray-800">Payment Receipt</h2>
            <div className="flex gap-3">
              {showPrint && (
                <button
                  onClick={handlePrint}
                  className="flex items-center bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition"
                  title="Print Receipt"
                >
                  <FiPrinter className="mr-2" /> Print
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-800 transition"
                title="Close"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Receipt Content - 57mm width */}
          <div className="p-6 flex justify-center no-print">
            <div
              id="receiptPrintSection"
              className="bg-white border border-gray-300 shadow-sm"
              style={{ width: '57mm', padding: '3mm', fontSize: '9pt', fontFamily: 'monospace' }}
            >
              {/* Header */}
              <div className="text-center mb-2 border-b border-dashed border-gray-400 pb-2">
                <h3 className="font-bold text-sm">VISTULA LENDING CORP.</h3>
                <p className="text-xs">BG Business Center</p>
                <p className="text-xs">Cantecson, Gairan</p>
                <p className="text-xs">Bogo City, Cebu</p>
                <p className="text-xs mt-1">Tel: (032) 123-4567</p>
              </div>

              <div className="text-center mb-2">
                <p className="font-bold text-xs">PAYMENT RECEIPT</p>
              </div>

              {/* Receipt Details */}
              <div className="text-xs space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Receipt No:</span>
                  <span className="font-semibold">{payment.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formattedTime}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-400 my-2"></div>

              {/* Customer Details */}
              <div className="text-xs space-y-1 mb-2">
                {borrowerName && (
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-semibold">{borrowerName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Borrower ID:</span>
                  <span>{payment.borrowersId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan ID:</span>
                  <span>{payment.loanId}</span>
                </div>
                {payment.paidToCollection && (
                  <div className="flex justify-between">
                    <span>Collection #:</span>
                    <span>{payment.paidToCollection}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-400 my-2"></div>

              {/* Payment Details */}
              <div className="text-xs space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-semibold">{payment.mode || 'Cash'}</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2">
                  <span>AMOUNT PAID:</span>
                  <span>₱{payment.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-400 my-2"></div>

              {/* Collector Info */}
              {payment.collector && (
                <div className="text-xs mb-2">
                  <div className="flex justify-between">
                    <span>Collected By:</span>
                    <span>{payment.collector}</span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs mt-3 pt-2 border-t border-gray-400">
                <p className="italic">This is a system-generated receipt.</p>
                <p className="italic mt-1">Thank you for your payment!</p>
              </div>

              <div className="text-center text-xs mt-2">
                <p>For inquiries, please contact us.</p>
                <p>vistulaLending@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Close Button - No Print */}
          <div className="px-6 pb-4 flex justify-end no-print">
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default ReceiptModal;
