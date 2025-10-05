"use client";

import { FiPrinter, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface ReleaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowerName: string;
  loanAmount: number;
  releaseDate: string;
}

// Reusable component for signatures
function SignatureLine({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-60 border-b border-gray-700 mb-2"></div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default function ReleaseFormModal({
  isOpen,
  onClose,
  borrowerName,
  loanAmount,
  releaseDate,
}: ReleaseFormModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  const handlePrint = () => setTimeout(() => window.print(), 100);

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printSection,
          #printSection * {
            visibility: visible !important;
          }
          #printSection {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            font-size: 10pt !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Modal container */}
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all duration-300 ease-out ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b no-print">
          <h2 className="text-xl font-semibold text-gray-700">
            Loan Release Form
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-6 print:bg-white print:overflow-visible">
          <div
            id="printSection"
            className="bg-white shadow-2xl border border-gray-300 w-[210mm] min-h-[297mm] p-[20mm] text-gray-900 print:shadow-none print:border-none"
          >
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold">VISTULA LENDING CORPORATION</h2>
              <p>BG Business Center, Gairan, Bogo City, Cebu</p>
              <p className="mt-2 font-semibold">LOAN RELEASE FORM</p>
            </div>

            <p className="mb-4">
              This is to certify that <strong>{borrowerName}</strong> has received
              the loan proceeds from Vistula Lending Corporation amounting to{" "}
              <strong>₱{loanAmount.toLocaleString()}</strong> on{" "}
              <strong>{new Date(releaseDate).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</strong>.
            </p>

            <p>
              By signing this release form, the borrower acknowledges receipt of
              the loan proceeds in full and agrees to the repayment terms as
              stipulated in the loan agreement.
            </p>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 mt-16">
              <SignatureLine label="Borrower’s Signature" />
              <SignatureLine label="Authorized Officer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
