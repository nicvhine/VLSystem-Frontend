'use client';

import { useState, useEffect } from "react";
import Common from "./common";

// API endpoint for loan applications with collateral
const API_URL = "http://localhost:3001/loan-applications/with";

// Type definition for loan options
type LoanOption = {
  amount: number;
  months: number;
  interest: number;
};

// Available loan options for with collateral loans
const loanOptions: LoanOption[] = [
  { amount: 20000, months: 8, interest: 7 },
  { amount: 50000, months: 10, interest: 5 },
  { amount: 100000, months: 18, interest: 4 },
  { amount: 200000, months: 24, interest: 3 },
  { amount: 300000, months: 36, interest: 2 },
  { amount: 500000, months: 60, interest: 1.5 },
];

// Props interface for WithCollateralForm component
interface WithCollateralFormProps {
  language: 'en' | 'ceb';
  maritalStatus?: string;
  setMaritalStatus?: any;
  incomeSource?: string;
  setIncomeSource?: any;
  address?: string;
  setAddress?: any;
  employmentStatus?: string;
  setEmploymentStatus?: any;
  reloanData?: any;
}

/**
 * Form component for loan applications with collateral
 * Handles form state management and submission for collateral-based loans
 * @param props - Component props including language and form state handlers
 * @returns JSX element containing the with collateral loan application form
 */
export default function WithCollateralForm(props: WithCollateralFormProps) {
  const { language = 'en', reloanData, ...rest } = props;
  
  // Common form states for applicant information
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
      
      // Note: We intentionally don't set loan purpose, selected loan, or collateral details for reloan
    }
  }, [reloanData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!appLoanPurpose || !selectedLoan || !collateralType || !collateralValue || !collateralDescription || !ownershipStatus) {
      alert(language === 'en' ? "Please fill in all required fields including collateral information." : "Palihug pun-a ang tanang kinahanglan nga field lakip ang impormasyon sa kolateral.");
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
      // Collateral information
      collateralType,
      collateralValue,
      collateralDescription,
      ownershipStatus,
      isReloan: reloanData !== null,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(language === 'en' ? "Loan application with collateral submitted successfully!" : "Malampusong napasa ang aplikasyon nga adunay kolateral!");
        // Reset form
        setAppLoanPurpose("");
        setSelectedLoan(null);
        setCollateralType("");
        setCollateralValue(0);
        setCollateralDescription("");
        setOwnershipStatus("");
      } else {
        const errorText = await res.text();
        alert(language === 'en' ? "Failed to submit application. Server says: " : "Napakyas ang pagpasa sa aplikasyon. Sulti sa server: " + errorText);
      }
    } catch (error) {
      alert(language === 'en' ? "An error occurred. Please try again." : "Adunay sayop. Palihug sulayi pag-usab.");
    }
  };

  // Translations for select options
  const collateralTypeOptions = [
    { value: '', label: language === 'en' ? 'Select collateral type' : 'Pilia ang klase sa kolateral' },
    { value: 'real-estate', label: language === 'en' ? 'Real Estate' : 'Yuta/Balay' },
    { value: 'vehicle', label: language === 'en' ? 'Vehicle' : 'Sakyanan' },
    { value: 'equipment', label: language === 'en' ? 'Equipment' : 'Kagamitan' },
    { value: 'others', label: language === 'en' ? 'Others' : 'Uban pa' },
  ];

  return (
    <>
      <Common {...rest} language={language}
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
        reloanData={reloanData}
      />

      {/* Collateral Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Collateral Information' : 'Impormasyon sa Kolateral'}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Collateral Type:' : 'Klase sa Kolateral:'}</label>
            <select 
              value={collateralType}
              onChange={(e) => setCollateralType(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {collateralTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Estimated Value:' : 'Gibanabanang Kantidad:'}</label>
            <input 
              type="number" 
              value={collateralValue}
              onChange={(e) => setCollateralValue(parseFloat(e.target.value))}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder={language === 'en' ? 'Enter estimated value' : 'Isulod ang gibanabanang kantidad'} 
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Collateral Description:' : 'Deskripsyon sa Kolateral:'}</label>
            <textarea 
              value={collateralDescription}
              onChange={(e) => setCollateralDescription(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder={language === 'en' ? 'Provide detailed description of your collateral' : 'Isulat ang detalyadong deskripsyon sa imong kolateral'}
            ></textarea>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Ownership Status:' : 'Kahimtang sa Pagpanag-iya:'}</label>
            <input
              type="text"
              value={ownershipStatus}
              onChange={(e) => setOwnershipStatus(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter ownership status' : 'Isulod ang kahimtang sa pagpanag-iya'}
            />
          </div>
        </div>
      </div>

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
              <option value="">{language === 'en' ? 'Select amount' : 'Pilia ang kantidad'}</option>
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
              title={language === 'en' ? 'Choose files' : 'Pilia ang mga file'}
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