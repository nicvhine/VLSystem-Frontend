"use client";

import React, { useState, useEffect } from "react";
import BorrowerCreditScoreCard from "@/app/userPage/borrowerPage/dashboard/cards/creditScoreCard";
import { useLoanDetails } from "./hooks";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

import EndorseInputModal from "./components/EndorseInputModal";
import EndorseLetterModal from "./components/EndorseLetterModal";
import ErrorModal from "../../modals/errorModal";

const COLLECTION_URL = process.env.NEXT_PUBLIC_COLLECTION_URL 

// ------------------- Progress Circle -------------------
interface ProgressCircleProps {
  value: number; // 0-100
  label: string;
  subLabel?: string;
  displayValue?: string;
  centerSubLabel?: string;
}

const ProgressCircle = ({ value, label, subLabel, displayValue, centerSubLabel }: ProgressCircleProps) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  const getGradientId = () => (value < 50 ? "redGradient" : value < 75 ? "yellowGradient" : "greenGradient");

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg font-semibold text-red-700 mb-6">{label}</h2>
      <div className="relative w-44 h-44 md:w-52 md:h-52">
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
            stroke="#f3f4f6"
            strokeWidth="14"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-extrabold text-gray-800">
            {displayValue || `${value}%`}
          </span>
          {centerSubLabel && (
            <span className="text-xs text-gray-500 mt-1">{centerSubLabel}</span>
          )}
        </div>
      </div>
      {subLabel && <div className="mt-3 text-sm text-gray-600 text-center">{subLabel}</div>}
    </div>
  );
};

// Removed local CreditScoreCard in favor of BorrowerCreditScoreCard from Borrower dashboard

const PaymentProgressCard = ({ paidAmount, balance }: { paidAmount: number; balance: number }) => {
  const total = paidAmount + balance;
  const percentage = total > 0 ? (paidAmount / total) * 100 : 0;
  return (
    <ProgressCircle
      value={Number(percentage.toFixed(2))}
      label="Payment Progress"
      displayValue={`${Number(percentage.toFixed(0))}%`}
      centerSubLabel="out of 100"
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
    <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">{label}</p>
    <p className="text-gray-800 text-sm font-medium">{value}</p>
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
  const { loan, loading, role } = useLoanDetails(id);

  const [collections, setCollections] = useState<any[]>([]);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [endorsementData, setEndorsementData] = useState<{ reason: string; date: string } | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [closureStatus, setClosureStatus] = useState<string | null>(null);


  useEffect(() => {
    if (!loan) return;
    const token = localStorage.getItem("token");
  
    // Fetch collections
    fetch(`${COLLECTION_URL}/${loan.loanId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCollections(data.collections || []))
      .catch(err => console.error("Failed to load collections:", err));
  
    // ✅ Fetch closure info by loanId
    fetch(`${process.env.NEXT_PUBLIC_CLOSURE_URL}/by-loan/${loan.loanId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.hasClosure) {
          setClosureStatus(data.status); 
        } else {
          setClosureStatus(null);
        }
      })
      .catch(err => console.error("Failed to check closure status:", err));
  }, [loan]);
  

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading loan details...</div>;
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
        {/* Page Header */}
        <div className="mx-auto max-w-7xl px-4 mb-6">
          <div className="flex items-start justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)}
                className="mt-1 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Go back"
              >
                {/* Left chevron icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  {loan.name}
                  <span className="text-red-700">|</span>
                  <span className="text-red-700">{loan.loanId}</span>
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase ${loan.status === 'Active' ? 'bg-green-100 text-green-700' : loan.status === 'Closed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {loan.status}
                  </span>
                  <span className="text-sm text-gray-900 font-medium">{loan.loanType}</span>
                </div>
              </div>
            </div>
            {/* Right: Action */}
            <div className="flex items-center">
              {role === "loan officer" && loan.status === "Active" && closureStatus !== "Pending" && (
                <button
                  onClick={() => setInputModalOpen(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 shadow transition"
                >
                  Endorse for closure
                </button>
              )}

              {closureStatus === "Pending" && (
                <p className="text-sm text-gray-500 italic">
                  A closure endorsement for this loan is currently pending.
                </p>
              )}
            </div>
          </div>
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
  <div className="mx-auto max-w-7xl px-4 space-y-10">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BorrowerCreditScoreCard creditScore={loan.creditScore || 0} showTip={false} />
            <PaymentProgressCard
              paidAmount={loan.currentLoan?.paidAmount ?? 0}
              balance={loan.currentLoan?.remainingBalance ?? 0}
            />
          </div>

          {/* Loan Details + Payment Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Loan Details */}
            <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition">
              <h2 className="text-lg font-bold text-red-700 mb-4 border-b border-red-100 pb-2">Loan Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <Info label="Loan ID" value={loan.loanId} />
                <Info label="Amount" value={`₱${Number(loan.appLoanAmount).toLocaleString()}`} />
                <Info label="Loan Type" value={loan.loanType} />
                <Info label="Terms" value={`${loan.currentLoan?.termsInMonths ?? '—'} months`} />
                <Info label="Interest Rate" value={`${loan.currentLoan?.interestRate ?? '—'}%`} />
                <Info label="Date Disbursed" value={loan.dateDisbursed || "—"} />
              </div>
            </div>

            {/* Payment Tracker */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 h-[55vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-red-700 mb-4 border-b border-red-100 pb-2 sticky top-0 bg-white z-10">Payment Tracker</h2>
                <PaymentTrackerCards collections={collections} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
