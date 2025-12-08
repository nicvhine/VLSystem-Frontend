"use client";

import { FiPrinter, FiX, FiSave } from "react-icons/fi";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Application } from "../../../utils/Types/application";
import axios from "axios";
import SuccessModal from "../../successModal";

interface ReleaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ReleaseForm({ isOpen, onClose, application }: ReleaseFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentRole = (localStorage.getItem("role") || "").toLowerCase();

  // Calculate service fee based on loan amount
  const calculateServiceFee = (principal: number): number => {
    if (principal >= 10000 && principal <= 20000) return principal * 0.05;
    if (principal > 20000 && principal <= 45000) return 1000;
    if (principal > 45000) return principal * 0.03;
    return 0;
  };

  const getInitialServiceFee = (): string => {
    const storedFee = Number(application?.appServiceFee);
    if (storedFee > 0) return storedFee.toString();

    const principal = Number(application?.appLoanAmount || 0);
    return calculateServiceFee(principal).toString();
  };

  const [serviceFee, setServiceFee] = useState<string>(getInitialServiceFee());

  // Modal animation
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setAnimateIn(true);
      setIsSaved(false);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update fee if application changes
  useEffect(() => {
    if (application) {
      const storedFee = Number(application.appServiceFee);
      if (storedFee > 0) {
        setServiceFee(storedFee.toString());
      } else {
        const principal = Number(application.appLoanAmount || 0);
        setServiceFee(calculateServiceFee(principal).toString());
      }
    }
  }, [application]);

  if (!showModal || !application) return null;

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

  const feeNumber = parseFloat(serviceFee) || 0;
  const netReleased = Number(application.appLoanAmount || 0) - feeNumber;

  // Save service fee + net released
  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      await axios.put(
        `${BASE_URL}/loan-applications/${application.applicationId}/release`,
        {
          serviceFee: feeNumber,
          netReleased: netReleased,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(true);
      setLoading(false);
      setSuccessMessage("Saved successfully! You can now print.");
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      alert(err.response?.data?.error || "Failed to save data. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!isSaved) return alert("Please save first before printing.");
    setTimeout(() => window.print(), 100);
  };

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
            width: 210mm;
            margin: 0 !important;
            padding: 20mm !important;
            background: white !important;
          }
          input {
            border: none !important;
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

      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all duration-300 ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b no-print">
          <h2 className="text-xl font-semibold text-gray-700">Loan Release Form</h2>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
            >
              <FiSave className="mr-2" /> Save
            </button>

            {isSaved && (
              <button
                onClick={handlePrint}
                className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800"
              >
                <FiPrinter className="mr-2" /> Print
              </button>
            )}

            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-6">
          <div
            id="printSection"
            className="bg-white shadow-2xl border border-gray-300 w-[210mm] p-8 text-gray-900"
          >
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold">VISTULA LENDING CORPORATION</h2>
              <p>BG Business Center, Cantecson, Gairan, Bogo City, Cebu</p>
              <h3 className="text-lg font-semibold mt-3">LOAN RELEASE FORM</h3>
            </div>

            {/* Borrower Info */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div>
                <label className="text-sm font-medium">Borrower Name</label>
                <p className="mt-1 font-semibold">{application.appName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Disbursement Date</label>
                <p className="mt-1 font-semibold">
                  {application.dateDisbursed
                    ? formatDate(application.dateDisbursed)
                    : "Not yet set"}
                </p>
              </div>
            </div>

            {/* Loan Amount & Service Fee */}
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <label className="text-sm font-medium">Approved Loan Amount</label>
                <p className="mt-1 font-semibold">
                  {formatCurrency(Number(application.appLoanAmount))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Processing / Service Fee</label>

                <input
                  type="number"
                  min={0}
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  className="mt-1 w-full font-semibold border-b border-gray-400 focus:outline-none"
                  disabled={application.hasServiceFee === "true"}
                  // OPTIONAL: Loan officer override
                  // disabled={application.hasServiceFee === "true" && currentRole !== "loan officer"}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Net Released</label>
                <p className="mt-1 font-semibold">{formatCurrency(netReleased)}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-20">
              <div className="flex flex-col items-center">
                <span className="border-b border-gray-700 w-64 mb-2"></span>
                <p className="text-sm font-medium">Received by</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="border-b border-gray-700 w-64 mb-2"></span>
                <p className="text-sm font-medium">Released by</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
