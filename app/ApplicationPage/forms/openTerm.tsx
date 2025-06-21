'use client';

import { useState } from "react";
import Common from "./common";

const API_URL = "http://localhost:3001/loan-applications/open-term";

type LoanOption = {
  amount: number;
  interest: number;
};

const loanOptions: LoanOption[] = [
  { amount: 50000, interest: 6 },
  { amount: 100000, interest: 5 },
  { amount: 200000, interest: 4 },
  { amount: 500000, interest: 3 },
];

export default function OpenTermForm() {
  // Common form states
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

  // Open-term specific states
  const [appLoanPurpose, setAppLoanPurpose] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [customLoanAmount, setCustomLoanAmount] = useState<number>(0);
  const [customInterestRate, setCustomInterestRate] = useState<number>(0);
  const [customLoanTerms, setCustomLoanTerms] = useState<number>(0);
  const [useCustomTerms, setUseCustomTerms] = useState(false);
  const [repaymentSchedule, setRepaymentSchedule] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!appLoanPurpose) {
      alert("Please fill in all required fields.");
      return;
    }

    // Determine loan details based on whether custom terms are used
    let loanAmount, loanTerms, interestRate;
    
    if (useCustomTerms) {
      if (!customLoanAmount || !customLoanTerms || !customInterestRate) {
        alert("Please fill in all custom loan details.");
        return;
      }
      loanAmount = customLoanAmount;
      loanTerms = customLoanTerms;
      interestRate = customInterestRate;
    } else {
      if (!selectedLoan) {
        alert("Please select a loan option or use custom terms.");
        return;
      }
      loanAmount = selectedLoan.amount;
      interestRate = selectedLoan.interest;
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
      appLoanAmount: loanAmount,
      appLoanTerms: loanTerms,
      appInterest: interestRate,
      appLoanPurpose,
      repaymentSchedule,
      specialConditions,
      isCustomTerms: useCustomTerms,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Open-term loan application submitted successfully!");
        // Reset form
        setAppLoanPurpose("");
        setSelectedLoan(null);
        setCustomLoanAmount(0);
        setCustomInterestRate(0);
        setCustomLoanTerms(0);
        setUseCustomTerms(false);
        setRepaymentSchedule("");
        setSpecialConditions("");
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

      {/* Open-Term Loan Specific Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          Open-Term Loan Details
        </h4>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useCustomTerms}
              onChange={(e) => setUseCustomTerms(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-700">Use custom loan terms</span>
          </label>
        </div>

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

          {!useCustomTerms ? (
            <>
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

            </>
          ) : (
            <>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Custom Loan Amount:</label>
                <input 
                  type="number"
                  value={customLoanAmount}
                  onChange={(e) => setCustomLoanAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder="Enter custom amount" 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Custom Loan Terms (months):</label>
                <input 
                  type="number"
                  value={customLoanTerms}
                  onChange={(e) => setCustomLoanTerms(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder="Enter number of months" 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Custom Interest Rate (%):</label>
                <input 
                  type="number"
                  step="0.1"
                  value={customInterestRate}
                  onChange={(e) => setCustomInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder="Enter interest rate" 
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-2 text-gray-700">Preferred Repayment Schedule:</label>
            <select 
              value={repaymentSchedule}
              onChange={(e) => setRepaymentSchedule(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select schedule</option>
              <option value="monthly">Monthly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block font-medium mb-2 text-gray-700">Special Conditions or Requests:</label>
            <textarea 
              value={specialConditions}
              onChange={(e) => setSpecialConditions(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder="Enter any special conditions, flexible terms, or requests"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          Document Upload
        </h4>
        <div>
          <label className="block font-medium mb-3 text-gray-700">Upload Required Documents:</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                        file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
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