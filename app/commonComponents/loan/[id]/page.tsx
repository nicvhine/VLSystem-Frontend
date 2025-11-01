"use client";

import React, { useState, useEffect } from "react";
import { useLoanDetails } from "./hooks";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

import EndorseInputModal from "./components/EndorseInputModal";
import EndorseLetterModal from "./components/EndorseLetterModal";
import ErrorModal from "../../modals/errorModal";

// ------------------- Progress Circle -------------------
interface ProgressCircleProps {
  value: number; // 0-100
  label: string;
  subLabel?: string;
  displayValue?: string;
}

const ProgressCircle = ({ value, label, subLabel, displayValue }: ProgressCircleProps) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  const getGradientId = () => (value < 50 ? "redGradient" : value < 75 ? "yellowGradient" : "greenGradient");

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{label}</h2>
      <div className="relative w-36 h-36 md:w-40 md:h-40">
        <svg className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="redGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-800">
            {displayValue || `${value}%`}
          </span>
          {subLabel && <span className="text-xs text-gray-500 mt-1">{subLabel}</span>}
        </div>
      </div>
    </div>
  );
};

const CreditScoreCard = ({ creditScore }: { creditScore: number }) => (
  <ProgressCircle value={Math.min(Math.max((creditScore / 10) * 100, 0), 100)} label="Credit Score" displayValue={creditScore.toFixed(1)} />
);

const PaymentProgressCard = ({ paidAmount, balance }: { paidAmount: number; balance: number }) => {
  const total = paidAmount + balance;
  const percentage = total > 0 ? (paidAmount / total) * 100 : 0;
  return (
    <ProgressCircle
      value={Number(percentage.toFixed(2))}
      label="Payment Progress"
      displayValue={`${Number(percentage.toFixed(0))}%`}
      subLabel={`₱${paidAmount.toLocaleString()} / ₱${total.toLocaleString()}`}
    />
  );
};

// ------------------- Status Badge -------------------
const StatusBadge = ({ status }: { status: string }) => {
  const colors =
    status === "Paid" ? "bg-green-100 text-green-700" :
    status === "Unpaid" ? "bg-red-100 text-red-700" :
    "bg-yellow-100 text-yellow-700";

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors}`}>{status}</span>;
};

// ------------------- Info Component -------------------
const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-400 text-xs uppercase">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

// ------------------- Payment Tracker -------------------
const PaymentTrackerCard = ({ collection }: { collection: any }) => {
  const paidPercentage = collection.periodAmount > 0 ? (collection.paidAmount / collection.periodAmount) * 100 : 0;
  const progressColor = paidPercentage === 100 ? "bg-green-500" : paidPercentage >= 50 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-2xl transition mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">Ref: {collection.referenceNumber}</p>
          <p className="text-xs text-gray-400">Due: {new Date(collection.dueDate).toLocaleDateString()}</p>
        </div>
        <StatusBadge status={collection.status} />
      </div>
      <p className="text-sm font-bold text-gray-800 mb-2">₱{collection.periodAmount.toLocaleString()}</p>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className={`h-3 ${progressColor}`} style={{ width: `${paidPercentage}%` }}></div>
      </div>
      {collection.note && <p className="text-xs text-gray-500 italic mt-1">{collection.note}</p>}
    </div>
  );
};

const PaymentTrackerCards = ({ collections }: { collections: any[] }) => {
  if (!collections || collections.length === 0)
    return <p className="text-center py-6 text-gray-500 text-sm">No collections found.</p>;

  return (
    <div className="flex flex-col">
      {collections.map((c) => (
        <PaymentTrackerCard key={c.referenceNumber} collection={c} />
      ))}
    </div>
  );
};

// ------------------- Loans Detail Page -------------------
interface Props {
  params: { id: string };
}

export default function LoansDetailPage({ params }: Props) {
  const { id } = params;
  const { loan, loading, error, role } = useLoanDetails(id);

  const [collections, setCollections] = useState<any[]>([]);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [endorsementData, setEndorsementData] = useState<{ reason: string; date: string } | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  // Fetch collections
  useEffect(() => {
    if (!loan) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/collections/${loan.loanId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setCollections(data.collections || []))
      .catch(err => console.error("Failed to load collections:", err));
  }, [loan]);

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading loan details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!loan) return <div className="p-10 text-center text-red-500">Loan not found.</div>;

  const Wrapper: React.ComponentType<{ children: React.ReactNode }> =
    role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  const handleGenerate = (reason: string) => {
    setEndorsementData({ reason, date: new Date().toLocaleDateString() });
    setInputModalOpen(false);
    setLetterModalOpen(true);
  };

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50 py-10">
        {/* Header */}
        <div className="mx-auto max-w-6xl px-4 flex justify-end mb-6">
          {role === "loan officer" && loan.status === "Active" && (
            <button
              onClick={() => setInputModalOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 shadow transition"
            >
              Endorse for closure
            </button>
          )}
        </div>

        {/* Modals */}
        {inputModalOpen && <EndorseInputModal onClose={() => setInputModalOpen(false)} onGenerate={handleGenerate} />}
        {endorsementData && (
          <EndorseLetterModal
            isOpen={letterModalOpen}
            onClose={() => setLetterModalOpen(false)}
            clientName={loan.name}
            reason={endorsementData.reason}
            date={endorsementData.date}
            loanId={loan.loanId}
          />
        )}
        <ErrorModal isOpen={showWarning} message={warningMsg} onClose={() => setShowWarning(false)} />

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 space-y-10">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreditScoreCard creditScore={loan.creditScore || 0} />
            <PaymentProgressCard paidAmount={loan.paidAmount || 0} balance={loan.balance || 0} />
          </div>

          {/* Loan Details + Payment Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Loan Details */}
            <div className="col-span-1 bg-white rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Loan Details</h2>
              <div className="space-y-3">
                <Info label="Loan ID" value={loan.loanId} />
                <Info label="Loan Type" value={loan.loanType} />
                <Info label="Amount" value={`₱${Number(loan.appLoanAmount).toLocaleString()}`} />
                <Info label="Terms" value={`${loan.appLoanTerms} months`} />
                <Info label="Interest Rate" value={`${loan.appInterestRate}%`} />
                <Info label="Monthly Due" value={`₱${Number(loan.appMonthlyDue).toLocaleString()}`} />
                <Info label="Status" value={<StatusBadge status={loan.status} />} />
                <Info label="Agent" value={loan.appAgent?.name || "—"} />
                <Info label="Date Disbursed" value={loan.dateDisbursed || "—"} />
              </div>
            </div>

            {/* Payment Tracker */}
            <div className="col-span-3">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Tracker</h2>
              <PaymentTrackerCards collections={collections} />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
