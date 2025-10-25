'use client';

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface LoanPreview {
  principal: number;
  months: number;
  interestRate: number;
  interestAmount: number;
  totalInterestAmount: number;
  totalPayable: number;
  monthlyDue: number;
  serviceFee: number;
  netReleased: number;
}

interface LoanApplication {
  applicationId: string;
  appLoanAmount: number;
  loanType: string;
}

interface EditPrincipalModalProps {
  applicationId: string;
  currentAmount: number;
  onSave: (newAmount: number) => void;
  onClose: () => void;
  loading?: boolean;
}

// Loan options
const loanOptions = {
  "Regular Loan With Collateral": [
    { amount: 20000, months: 8, interest: 7 },
    { amount: 50000, months: 10, interest: 5 },
    { amount: 100000, months: 18, interest: 4 },
    { amount: 200000, months: 24, interest: 3 },
    { amount: 300000, months: 36, interest: 2 },
    { amount: 500000, months: 60, interest: 1.5 },
  ],
  "Regular Loan Without Collateral": [
    { amount: 10000, months: 5, interest: 10 },
    { amount: 15000, months: 6, interest: 10 },
    { amount: 20000, months: 8, interest: 10 },
    { amount: 30000, months: 10, interest: 10 },
  ],
  "Open-Term Loan": [
    { amount: 50000, interest: 6 },
    { amount: 100000, interest: 5 },
    { amount: 200000, interest: 4 },
    { amount: 500000, interest: 3 },
  ],
} as const;

type LoanOptionKey = keyof typeof loanOptions;

export default function EditPrincipalModal({
  applicationId,
  currentAmount,
  onSave,
  onClose,
  loading,
}: EditPrincipalModalProps) {
  const [amount, setAmount] = useState(currentAmount);
  const [loanApp, setLoanApp] = useState<LoanApplication | null>(null);
  const [preview, setPreview] = useState<LoanPreview | null>(null);

  // Fetch application details
  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`http://localhost:3001/loan-applications/${applicationId}`);
        if (!res.ok) throw new Error("Failed to fetch application");
        const data: LoanApplication = await res.json();
        setLoanApp(data);
        setAmount(data.appLoanAmount);
      } catch (err) {
        console.error(err);
        alert("Error fetching loan application");
      }
    };
    fetchApp();
  }, [applicationId]);

  // Compute loan preview
  const computePreview = (principal: number, loanType: string): LoanPreview => {
    const key: LoanOptionKey = loanType as LoanOptionKey;
    const options = loanOptions[key];

    let selectedOption;
    if (key === "Open-Term Loan") {
      selectedOption = options.find(opt => opt.amount >= principal) || options[options.length - 1];
    } else {
      selectedOption = options
        .filter(opt => opt.amount <= principal)
        .sort((a, b) => b.amount - a.amount)[0] || options[0];
    }

    const months = selectedOption.months ?? 12; 
    const interestRate = selectedOption.interest;

    const serviceFee =
      principal <= 20000 ? principal * 0.05 : principal <= 45000 ? 1000 : principal * 0.03;

    const interestAmount = principal * (interestRate / 100);
    const totalInterestAmount = interestAmount * months;
    const totalPayable = principal + totalInterestAmount + serviceFee;
    const monthlyDue = totalPayable / months;
    const netReleased = principal - serviceFee;

    return {
      principal,
      months,
      interestRate,
      interestAmount,
      totalInterestAmount,
      totalPayable,
      monthlyDue,
      serviceFee,
      netReleased,
    };
  };

  // Update preview whenever amount or loanApp changes
  useEffect(() => {
    if (loanApp) {
      setPreview(computePreview(amount, loanApp.loanType));
    }
  }, [amount, loanApp]);

  const handleSave = async () => {
    if (!loanApp) return;
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/loan-applications/${applicationId}/principal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPrincipal: amount }),
      });

      if (!res.ok) throw new Error("Failed to update principal");

      const data = await res.json();
      onSave(Number(data.updatedApp.appLoanAmount));
    } catch (err) {
      console.error(err);
      alert("Error updating principal");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 text-black">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          <FiX />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Edit Principal{" "}
          <span className="text-gray-500 text-sm">
            ({applicationId}, {loanApp?.loanType})
          </span>
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Principal Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={0}
            step={0.01}
          />
        </div>

        {preview && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h3 className="font-medium text-gray-700 mb-2">Loan Preview:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>Principal:</div>
              <div>₱ {preview.principal.toLocaleString()}</div>
              <div>Months:</div>
              <div>{preview.months}</div>
              <div>Interest Rate:</div>
              <div>{preview.interestRate}%</div>
              <div>Interest Amount:</div>
              <div>₱ {preview.interestAmount.toLocaleString()}</div>
              <div>Total Interest:</div>
              <div>₱ {preview.totalInterestAmount.toLocaleString()}</div>
              <div>Service Fee:</div>
              <div>₱ {preview.serviceFee.toLocaleString()}</div>
              <div>Total Payable:</div>
              <div>₱ {preview.totalPayable.toLocaleString()}</div>
              <div>Monthly Due:</div>
              <div>₱ {preview.monthlyDue.toLocaleString()}</div>
              <div>Net Released:</div>
              <div>₱ {preview.netReleased.toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
