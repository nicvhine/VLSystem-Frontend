'use client';

import { useState } from "react";
import Common from "./common";

const API_URL = "http://localhost:3001/loan-applications/without";

type LoanOption = {
  amount: number;
  months: number;
  interest: number;
};

const loanOptions: LoanOption[] = [
  { amount: 10000, months: 6, interest: 1.5 },
  { amount: 20000, months: 12, interest: 1.2 },
  { amount: 50000, months: 24, interest: 1.0 },
];

export default function WithoutCollateralForm() {
  const [appLoanPurpose, setAppLoanPurpose] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);

  const [appName, setAppName] = useState("");
  const [appDob, setAppDob] = useState("");
  const [appContact, setAppContact] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [appMarital, setAppMarital] = useState("");
  const [appChildren, setAppChildren] = useState<number>(0);
  const [appSpouseName, setAppSpouseName] = useState("");
  const [appSpouseOccupation, setAppSpouseOccupation] = useState("");
  const [appAddress, setAppAddress] = useState("");
  const [appTypeBusiness, setAppTypeBusiness] = useState("");
  const [appDateStarted, setAppDateStarted] = useState("");
  const [appBusinessLoc, setAppBusinessLoc] = useState("");
  const [appMonthlyIncome, setAppMonthlyIncome] = useState<number>(0);
  const [appOccupation, setAppOccupation] = useState("");
  const [appEmploymentStatus, setAppEmploymentStatus] = useState("");
  const [appCompanyName, setAppCompanyName] = useState("");
  const [sourceOfIncome, setSourceOfIncome] = useState("");

  const handleSubmit = async () => {
    if (!appLoanPurpose || !selectedLoan) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      appName,
      appDob,
      appContact,
      appEmail,
      appMarital,
      appChildren,
      appSpouseName,
      appSpouseOccupation,
      appAddress,
      appTypeBusiness,
      appDateStarted,
      appBusinessLoc,
      appMonthlyIncome,
      appOccupation,
      appEmploymentStatus,
      appCompanyName,
      sourceOfIncome,
      appLoanAmount: selectedLoan.amount,
      appLoanTerms: selectedLoan.months,
      appInterest: selectedLoan.interest,
      appLoanPurpose,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Loan application submitted successfully!");
        setAppLoanPurpose("");
        setSelectedLoan(null);
      } else {
        const errorText = await res.text();
        console.error("Error from server:", errorText);
        alert("Failed to submit application. Server says: " + errorText);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Common
        appName={appName}
        setAppName={setAppName}
        appDob={appDob}
        setAppDob={setAppDob}
        appContact={appContact}
        setAppContact={setAppContact}
        appEmail={appEmail}
        setAppEmail={setAppEmail}
        appMarital={appMarital}
        setAppMarital={setAppMarital}
        appChildren={appChildren}
        setAppChildren={setAppChildren}
        appSpouseName={appSpouseName}
        setAppSpouseName={setAppSpouseName}
        appSpouseOccupation={appSpouseOccupation}
        setAppSpouseOccupation={setAppSpouseOccupation}
        appAddress={appAddress}
        setAppAddress={setAppAddress}
        appTypeBusiness={appTypeBusiness}
        setAppTypeBusiness={setAppTypeBusiness}
        appDateStarted={appDateStarted}
        setAppDateStarted={setAppDateStarted}
        appBusinessLoc={appBusinessLoc}
        setAppBusinessLoc={setAppBusinessLoc}
        appMonthlyIncome={appMonthlyIncome}
        setAppMonthlyIncome={setAppMonthlyIncome}
        appOccupation={appOccupation}
        setAppOccupation={setAppOccupation}
        appEmploymentStatus={appEmploymentStatus}
        setAppEmploymentStatus={setAppEmploymentStatus}
        appCompanyName={appCompanyName}
        setAppCompanyName={setAppCompanyName}
        sourceOfIncome={sourceOfIncome}
        setSourceOfIncome={setSourceOfIncome}
      />

      {/* Loan Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          Loan Details
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Loan Purpose:</label>
            <input
              value={appLoanPurpose}
              onChange={(e) => setAppLoanPurpose(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter Loan Purpose"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Loan Amount:</label>
            <select
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onChange={(e) => {
                const selected = loanOptions.find((opt) => opt.amount === parseInt(e.target.value));
                setSelectedLoan(selected || null);
              }}
              value={selectedLoan?.amount || ""}
            >
              <option value="">Select amount</option>
              {loanOptions.map((opt) => (
                <option key={opt.amount} value={opt.amount}>
                  ₱{opt.amount.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Loan Terms (months):</label>
            <input
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
              value={selectedLoan?.months || ""}
              readOnly
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Monthly Interest Rate (%):</label>
            <input
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
              value={selectedLoan?.interest || ""}
              readOnly
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors shadow-sm"
      >
        Submit Application
      </button>
    </>
  );
}
