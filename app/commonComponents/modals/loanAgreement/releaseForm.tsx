'use client';

import { FiPrinter, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Application } from "../../utils/Types/application";

interface ReleaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

export default function ReleaseForm({ isOpen, onClose, application }: ReleaseFormProps) {
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

  if (!showModal || !application) return null;

  const handlePrint = () => setTimeout(() => window.print(), 100);

  const disburseDate = application?.dateDisbursed
    ? new Date(application.dateDisbursed).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not yet set";

  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
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
            width: 186mm;
            height: 326mm;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            font-size: 9pt !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: legal portrait;
            margin: 10mm;
          }
        }
      `}</style>

      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col print:w-[216mm] print:h-[356mm] print:rounded-none print:shadow-none transform transition-all duration-300 ease-out ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b no-print">
          <h2 className="text-xl font-semibold text-gray-600">Release Form</h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-6 print:bg-white print:overflow-visible">
          <div
            id="printSection"
            className="bg-white shadow-2xl border border-gray-300 w-[216mm] p-[25mm] text-justify leading-relaxed text-[8pt] text-gray-900 print:shadow-none print:border-none"
          >
            {/* HEADER */}
            <h2 className="text-center text-lg font-bold mb-2">VISTULA LENDING CORPORATION</h2>
            <p className="text-center mb-6">BG Business Center, Cantecson, Gairan, Bogo City, Cebu</p>
            <h3 className="text-center text-l font-semibold mb-6">RELEASE FORM</h3>

            <p className="flex gap-71">
              <span>
                <strong>Name: </strong>{application.appName}
              </span>
              <span>
                <strong>Date: </strong>{formatDate(application.dateDisbursed)}
              </span>
            </p>

            <p className="flex gap-50">
              <span>
                <strong>Approved Loan Amount: </strong>{formatCurrency(application.appLoanAmount)}
              </span>
              <span>
                <strong>Net Released: </strong>{formatCurrency(application.appNetReleased)}
              </span>
            </p>

            <p className="flex gap-50">
              <span>
                <strong>Processing/Service Fee: </strong>{formatCurrency(application.appServiceFee)}
              </span>
            </p>

            {/* SIGNATORIES */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="flex flex-col space-y-6">
                <p className="font-semibold">Received by</p>
                <span className="border-b border-gray-700 w-50"></span>
              </div>
              <div className="flex flex-col space-y-6">
                <p className="font-semibold">Released by</p>
                <span className="border-b border-gray-700 w-50"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
