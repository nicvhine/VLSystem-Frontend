'use client';

import { useState, useEffect } from "react";
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

interface OpenTermLoanFormProps {
  language: 'en' | 'ceb';
  reloanData?: any;
}

export default function OpenTermForm({ language, reloanData }: OpenTermLoanFormProps) {
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

  const [appReferences, setAppReferences] = useState([
   { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" }
  ]); 

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

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
      
      // Note: We intentionally don't set loan purpose, selected loan, or other loan-specific fields for reloan
    }
  }, [reloanData]);

  // Translations for select options
  const repaymentOptions = [
    { value: '', label: language === 'en' ? 'Select schedule' : 'Pilia ang iskedyul' },
    { value: 'monthly', label: language === 'en' ? 'Monthly' : 'Matag Buwan' },
    { value: 'bi-weekly', label: language === 'en' ? 'Bi-weekly' : 'Matag Duha ka Semana' },
    { value: 'weekly', label: language === 'en' ? 'Weekly' : 'Matag Semana' },
    { value: 'quarterly', label: language === 'en' ? 'Quarterly' : 'Matag Quarter' },
    { value: 'flexible', label: language === 'en' ? 'Flexible' : 'Flexible' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!appLoanPurpose) {
      alert(language === 'en' ? 'Please fill in all required fields.' : 'Palihug pun-a ang tanang kinahanglan nga field.');
      return;
    }

    // Determine loan details based on whether custom terms are used
    let loanAmount, loanTerms, interestRate;
    
    if (useCustomTerms) {
      if (!customLoanAmount || !customLoanTerms || !customInterestRate) {
        alert(language === 'en' ? 'Please fill in all custom loan details.' : 'Palihug pun-a ang tanang detalye sa custom nga loan.');
        return;
      }
      loanAmount = customLoanAmount;
      loanTerms = customLoanTerms;
      interestRate = customInterestRate;
    } else {
      if (!selectedLoan) {
        alert(language === 'en' ? 'Please select a loan option or use custom terms.' : 'Palihug pili og loan option o gamita ang custom nga terms.');
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
      appReferences,
      isCustomTerms: useCustomTerms,
      isReloan: reloanData !== null,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(language === 'en' ? 'Open-term loan application submitted successfully!' : 'Malampusong napasa ang open-term nga aplikasyon!');
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
        alert(language === 'en' ? 'Failed to submit application. Server says: ' : 'Napakyas ang pagpasa sa aplikasyon. Sulti sa server: ' + errorText);
      }
    } catch (error) {
      alert(language === 'en' ? 'An error occurred. Please try again.' : 'Adunay sayop. Palihug sulayi pag-usab.');
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
          appReferences={appReferences}
        setAppReferences={setAppReferences}
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

      {/* Open-Term Loan Specific Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Open-Term Loan Details' : 'Detalye sa Open-Term nga Pahulam'}
        </h4>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useCustomTerms}
              onChange={(e) => setUseCustomTerms(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-700">{language === 'en' ? 'Use custom loan terms' : 'Gamiton ang custom nga terms sa loan'}</span>
          </label>
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

          {!useCustomTerms ? (
            <>
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
                  <option value="">{language === 'en' ? 'Select amount' : 'Pilia ang kantidad'}</option>
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
                <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Custom Loan Amount:' : 'Custom nga Kantidad sa Pahulam:'}</label>
                <input 
                  type="number"
                  value={customLoanAmount}
                  onChange={(e) => setCustomLoanAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder={language === 'en' ? 'Enter custom amount' : 'Isulod ang custom nga kantidad'} 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Custom Loan Terms (months):' : 'Custom nga Panahon (buwan):'}</label>
                <input 
                  type="number"
                  value={customLoanTerms}
                  onChange={(e) => setCustomLoanTerms(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder={language === 'en' ? 'Enter number of months' : 'Isulod ang ihap sa buwan'} 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Custom Interest Rate (%):' : 'Custom nga Interest Rate (%):'}</label>
                <input 
                  type="number"
                  step="0.1"
                  value={customInterestRate}
                  onChange={(e) => setCustomInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                  placeholder={language === 'en' ? 'Enter interest rate' : 'Isulod ang interest rate'} 
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Preferred Repayment Schedule:' : 'Gipili nga Iskedyul sa Pagbayad:'}</label>
            <select 
              value={repaymentSchedule}
              onChange={(e) => setRepaymentSchedule(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {repaymentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Special Conditions or Requests:' : 'Espesyal nga mga Kahimtang o Hangyo:'}</label>
            <textarea 
              value={specialConditions}
              onChange={(e) => setSpecialConditions(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder={language === 'en' ? 'Enter any special conditions, flexible terms, or requests' : 'Isulod ang mga espesyal nga kahimtang, flexible nga terms, o hangyo'}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Document Upload' : 'Iupload ang mga kinahanglanon nga dokumento'}
        </h4>
        <div>
          <label className="block font-medium mb-3 text-gray-700">{language === 'en' ? 'Upload Required Documents:' : 'Iupload ang mga Kinahanglanon nga Dokumento:'}</label>
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
          <p className="text-xs text-gray-500 mt-2 text-center">{language === 'en' ? 'Accepted: PDF, JPG, PNG. You can upload multiple files.' : 'Dawaton: PDF, JPG, PNG. Pwede ka mag-upload og daghang files.'}</p>
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