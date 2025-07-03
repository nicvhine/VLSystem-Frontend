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
  { amount: 10000, months: 5, interest: 10 },
  { amount: 15000, months: 6, interest: 10 },
  { amount: 20000, months: 8, interest: 10 },
  { amount: 30000, months: 10, interest: 10 },
];

interface WithoutCollateralFormProps {
  language: 'en' | 'ceb';
}

export default function WithoutCollateralForm({ language }: WithoutCollateralFormProps) {
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
  const [appReferences, setAppReferences] = useState([
   { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" }
  ]); 

  // Translations for select options
  const loanAmountPlaceholder = language === 'en' ? 'Select amount' : 'Pilia ang kantidad';

  const handleSubmit = async () => {
    if (!appLoanPurpose || !selectedLoan) {
      alert(language === 'en' ? "Please fill in all required fields." : "Palihug pun-a ang tanang kinahanglan nga field.");
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
      appReferences,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(language === 'en' ? "Loan application submitted successfully!" : "Malampusong napasa ang aplikasyon!");
        setAppLoanPurpose("");
        setSelectedLoan(null);
      } else {
        const errorText = await res.text();
        alert(language === 'en' ? "Failed to submit application. Server says: " : "Napakyas ang pagpasa sa aplikasyon. Sulti sa server: " + errorText);
      }
    } catch (error) {
      alert(language === 'en' ? "An error occurred. Please try again." : "Adunay sayop. Palihug sulayi pag-usab.");
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
        appReferences={appReferences}
        setAppReferences={setAppReferences}
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
        language={language}
      />

      {/* Loan Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Loan Details' : 'Detalye sa Pahulam'}
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Loan Purpose:' : 'Katuyoan sa Pahulam:'}</label>
            <input
              value={appLoanPurpose}
              onChange={(e) => setAppLoanPurpose(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter Loan Purpose' : 'Isulod ang Katuyoan sa Pahulam'}
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Loan Amount:' : 'Kantidad sa Pahulam:'}</label>
            <select
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onChange={(e) => {
                const selected = loanOptions.find((opt) => opt.amount === parseInt(e.target.value));
                setSelectedLoan(selected || null);
              }}
              value={selectedLoan?.amount || ""}
            >
              <option value="">{loanAmountPlaceholder}</option>
              {loanOptions.map((opt) => (
                <option key={opt.amount} value={opt.amount}>
                  ₱{opt.amount.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Loan Terms (months):' : 'Panahon sa Pahulam (buwan):'}</label>
            <input
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
              value={selectedLoan?.months || ""}
              readOnly
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Monthly Interest Rate (%):' : 'Bulan nga Interest Rate (%):'}</label>
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
        {language === 'en' ? 'Submit Application' : 'Isumite ang Aplikasyon'}
      </button>
    </>
  );
}
