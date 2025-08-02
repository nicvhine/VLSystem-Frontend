'use client';

import { useState, useEffect } from "react";
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
  reloanData?: any;
  onLanguageChange?: (lang: 'en' | 'ceb') => void;
}

export default function WithoutCollateralForm({ language, reloanData, onLanguageChange }: WithoutCollateralFormProps) {
  const [appLoanPurpose, setAppLoanPurpose] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [appReloanType, setAppReloanType] = useState("");
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

  useEffect(() => {
    if (reloanData) {
      const { personalInfo, characterReferences } = reloanData;
      
      // Set personal information
      if (personalInfo) {
        setAppName(personalInfo.appName || personalInfo.name || "");
        setAppDob(personalInfo.appDob || personalInfo.dob || "");
        setAppContact(personalInfo.appContact || personalInfo.contact || "");
        setAppEmail(personalInfo.appEmail || personalInfo.email || "");
        setAppMarital(personalInfo.appMarital || personalInfo.maritalStatus || "");
        setAppChildren(personalInfo.appChildren || personalInfo.children || 0);
        setAppSpouseName(personalInfo.appSpouseName || personalInfo.spouseName || "");
        setAppSpouseOccupation(personalInfo.appSpouseOccupation || personalInfo.spouseOccupation || "");
        setAppAddress(personalInfo.appAddress || personalInfo.address || "");
        
        // Set source of income related fields
        setSourceOfIncome(personalInfo.sourceOfIncome || "");
        setAppMonthlyIncome(personalInfo.appMonthlyIncome || 0);
        
        // Set business fields if source of income is business
        if (personalInfo.sourceOfIncome === "business") {
          setAppTypeBusiness(personalInfo.appTypeBusiness || "");
          setAppDateStarted(personalInfo.appDateStarted || "");
          setAppBusinessLoc(personalInfo.appBusinessLoc || "");
        }
        
        // Set employment fields if source of income is employed
        if (personalInfo.sourceOfIncome === "employed") {
          setAppOccupation(personalInfo.appOccupation || "");
          setAppEmploymentStatus(personalInfo.appEmploymentStatus || "");
          setAppCompanyName(personalInfo.appCompanyName || "");
        }
      }
      
      // Set character references if available
      if (characterReferences && characterReferences.length > 0) {
        // Ensure we have exactly 3 references, filling with empty objects if needed
        const references = [...characterReferences];
        while (references.length < 3) {
          references.push({ name: "", contact: "", relation: "" });
        }
        setAppReferences(references.slice(0, 3));
      }
      
      // Set loan details (but only if not in reloan mode)
      // Note: We intentionally don't set loan purpose or selected loan for reloan
    }
  }, [reloanData]);

  // Translations for select options
  const loanAmountPlaceholder = language === 'en' ? 'Select amount' : 'Pilia ang kantidad';

const handleSubmit = async () => {
  if (!appLoanPurpose || !selectedLoan) {
    alert(language === 'en'
      ? "Please fill in all required fields."
      : "Palihug pun-a ang tanang kinahanglan nga field.");
    return;
  }

  const payload: any = {
    appLoanPurpose,
    appLoanAmount: selectedLoan.amount,
    appLoanTerms: selectedLoan.months,
    appInterest: selectedLoan.interest,
  };

  let url = API_URL;

  // Check if it's a reloan case
  if (reloanData?.borrowersId || typeof window !== 'undefined') {
    const borrowerIdFromStorage = localStorage.getItem("borrowersId");
    const borrowersId = reloanData?.borrowersId || borrowerIdFromStorage;

    if (!borrowersId) {
      alert(language === 'en'
        ? "Borrower ID missing. Please log in again."
        : "Wala ang Borrower ID. Palihug pag-login pag-usab.");
      return;
    }

    // Use reloan URL
    url = `http://localhost:3001/loan-applications/without/reloan/${borrowersId}`;

    // Include it in the payload (if backend wants it in body)
    payload.borrowersId = borrowersId;
    payload.appReloanType = appReloanType;

  } else {
    // New application (not reloan) — include all data
    Object.assign(payload, {
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
      appReferences,
    });

    // Also include borrowersId here too (for new apps)
    const borrowersId = localStorage.getItem("borrowersId");
    if (borrowersId) {
      payload.borrowersId = borrowersId;
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(language === 'en'
        ? "Loan application submitted successfully!"
        : "Malampusong napasa ang aplikasyon!");

      setAppLoanPurpose("");
      setSelectedLoan(null);
    } else {
      const errorText = await res.text();
      alert(language === 'en'
        ? "Failed to submit application. Server says: " + errorText
        : "Napakyas ang pagpasa sa aplikasyon. Sulti sa server: " + errorText);
    }
  } catch (error) {
    alert(language === 'en'
      ? "An error occurred. Please try again."
      : "Adunay sayop. Palihug sulayi pag-usab.");
  }
};



  return (
    <>
      {/* Language Toggle - Only show in reloan modal */}
      {reloanData && (
        <div className="flex justify-end mb-4">
          <label className="flex items-center cursor-pointer select-none text-xs">
            <span className="mr-2 font-medium text-gray-600">{language === 'en' ? 'English' : 'Cebuano'}</span>
            <input
              type="checkbox"
              checked={language === 'ceb'}
              onChange={() => onLanguageChange ? onLanguageChange(language === 'en' ? 'ceb' : 'en') : null}
              className="sr-only"
            />
            <span className="w-10 h-5 flex items-center bg-gray-200 rounded-full p-1 duration-300 ease-in-out">
              <span
                className={
                  `bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${language === 'ceb' ? 'translate-x-5' : ''}`
                }
              />
            </span>
          </label>
        </div>
      )}

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
        reloanData={reloanData}
      />

      {/* Loan Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Loan Details' : 'Detalye sa Pahulam'}
        </h4>

       <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">
            {language === 'en' ? 'Reloan Type:' : 'Klase sa Reloan:'}
          </label>
          <select
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            onChange={(e) => setAppReloanType(e.target.value)}
            value={appReloanType}
          >
            <option value="">{language === 'en' ? 'Select reloan type' : 'Pilia ang klase sa reloan'}</option>
            <option value="add-to-principal">
              {language === 'en' ? 'Add-to-Principal' : 'Idugang sa Prinsipal'}
            </option>
            <option value="net-proceeds">
              {language === 'en' ? 'Net-Proceeds' : 'Iminus sa Madawat'}
            </option>
          </select>

          {/* Definition below dropdown */}
          {appReloanType === "add-to-principal" && (
            <p className="text-sm text-gray-500 mt-1">
              {language === 'en'
                ? "Remaining balance will be added to your new loan principal."
                : "Ang nabiling utang idugang sa bag-ong prinsipal."}
            </p>
          )}

          {appReloanType === "net-proceeds" && (
            <p className="text-sm text-gray-500 mt-1">
              {language === 'en'
                ? "Remaining balance will be deducted from the amount you receive."
                : "Ang nabiling utang kuhaan sa kantidad nga imong madawat."}
            </p>
          )}
        </div>


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
