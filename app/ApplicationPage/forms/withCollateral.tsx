'use client';

import { useState } from "react";
import Common from "./common";

const API_URL = "http://localhost:3001/loan-applications/with";

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

export default function WithCollateralForm() {
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

  // Loan specific states
  const [appLoanPurpose, setAppLoanPurpose] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);

  // Collateral specific states
  const [collateralType, setCollateralType] = useState("");
  const [collateralValue, setCollateralValue] = useState<number>(0);
  const [collateralDescription, setCollateralDescription] = useState("");
  const [ownershipStatus, setOwnershipStatus] = useState("");

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!appLoanPurpose || !selectedLoan || !collateralType || !collateralValue || !collateralDescription || !ownershipStatus) {
      alert("Please fill in all required fields including collateral information.");
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
      // Collateral information
      collateralType,
      collateralValue,
      collateralDescription,
      ownershipStatus,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Loan application with collateral submitted successfully!");
        // Reset form
        setAppLoanPurpose("");
        setSelectedLoan(null);
        setCollateralType("");
        setCollateralValue(0);
        setCollateralDescription("");
        setOwnershipStatus("");
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

      {/* Collateral Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          Collateral Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Collateral Type:</label>
            <select 
              value={collateralType}
              onChange={(e) => setCollateralType(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select collateral type</option>
              <option value="real-estate">Real Estate</option>
              <option value="vehicle">Vehicle</option>
              <option value="equipment">Equipment</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Estimated Value:</label>
            <input 
              type="number" 
              value={collateralValue}
              onChange={(e) => setCollateralValue(parseFloat(e.target.value))}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder="Enter estimated value" 
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium mb-2 text-gray-700">Collateral Description:</label>
            <textarea 
              value={collateralDescription}
              onChange={(e) => setCollateralDescription(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder="Provide detailed description of your collateral"
            ></textarea>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Ownership Status:</label>
            <select 
              value={ownershipStatus}
              onChange={(e) => setOwnershipStatus(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select ownership status</option>
              <option value="sole-owner">Sole Owner</option>
              <option value="joint-owner">Joint Owner</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
      </div>

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