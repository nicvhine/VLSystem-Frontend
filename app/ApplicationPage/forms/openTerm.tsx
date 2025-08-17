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

interface OpenTermLoanFormProps {
  language: 'en' | 'ceb';
  maritalStatus: string;
  setMaritalStatus: (status: string) => void;
  incomeSource: string;
  setIncomeSource: (source: string) => void;
  address: string;
  setAddress: (address: string) => void;
  employmentStatus: string;
  setEmploymentStatus: (status: string) => void;
}

export default function OpenTermForm({ 
  language, 
  maritalStatus, 
  setMaritalStatus, 
  incomeSource, 
  setIncomeSource, 
  address, 
  setAddress, 
  employmentStatus, 
  setEmploymentStatus 
}: OpenTermLoanFormProps) {
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
  const [repaymentSchedule, setRepaymentSchedule] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");

  // Collateral specific states
  const [collateralType, setCollateralType] = useState("");
  const [collateralValue, setCollateralValue] = useState<number>(0);
  const [collateralDescription, setCollateralDescription] = useState("");
  const [ownershipStatus, setOwnershipStatus] = useState("");

  const [appReferences, setAppReferences] = useState([
   { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" },
    { name: "", contact: "", relation: "" }
  ]); 

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  // Translations for select options
  const repaymentOptions = [
    { value: '', label: language === 'en' ? 'Select schedule' : 'Pilia ang iskedyul' },
    { value: 'monthly', label: language === 'en' ? 'Monthly' : 'Matag Buwan' },
    { value: 'bi-weekly', label: language === 'en' ? 'Bi-weekly' : 'Matag Duha ka Semana' },
    { value: 'weekly', label: language === 'en' ? 'Weekly' : 'Matag Semana' },
    { value: 'quarterly', label: language === 'en' ? 'Quarterly' : 'Matag Quarter' },
    { value: 'flexible', label: language === 'en' ? 'Flexible' : 'Flexible' },
  ];

  const collateralTypeOptions = [
    { value: '', label: language === 'en' ? 'Select collateral type' : 'Pilia ang klase sa kolateral' },
    { value: 'real-estate', label: language === 'en' ? 'Real Estate' : 'Yuta/Balay' },
    { value: 'vehicle', label: language === 'en' ? 'Vehicle' : 'Sakyanan' },
    { value: 'equipment', label: language === 'en' ? 'Equipment' : 'Kagamitan' },
    { value: 'others', label: language === 'en' ? 'Others' : 'Uban pa' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(e.target.files);
      
      // Create preview URLs for uploaded files
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file as Blob));
      setFilePreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    if (uploadedFiles) {
      const dt = new DataTransfer();
      const files = Array.from(uploadedFiles);
      files.splice(index, 1);
      files.forEach(file => dt.items.add(file as File));
      
      const newFileList = dt.files;
      setUploadedFiles(newFileList);
      
      // Update preview URLs
      const newUrls = Array.from(newFileList).map(file => URL.createObjectURL(file as Blob));
      setFilePreviewUrls(newUrls);
    }
  };

  const handleSubmit = async () => {
    if (!appLoanPurpose || !selectedLoan) {
      alert(language === 'en' ? 'Please fill in all required fields.' : 'Palihug pun-a ang tanang kinahanglan nga field.');
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
      appInterest: selectedLoan.interest,
      appLoanPurpose,
      repaymentSchedule,
      specialConditions,
      appReferences,
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
        alert(language === 'en' ? 'Open-term loan application submitted successfully!' : 'Malampusong napasa ang open-term nga aplikasyon!');
        // Reset form
        setAppLoanPurpose("");
        setSelectedLoan(null);
        setRepaymentSchedule("");
        setSpecialConditions("");
        setCollateralType("");
        setCollateralValue(0);
        setCollateralDescription("");
        setOwnershipStatus("");
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

      {/* Open-Term Loan Specific Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Open-Term Loan Details' : 'Detalye sa Open-Term nga Pahulam'}
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
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Interest Rate (%):' : 'Interest Rate (%):'}</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" 
              value={selectedLoan?.interest || ""} 
              readOnly 
            />
          </div>

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

        {/* File Preview */}
        {filePreviewUrls.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium mb-3 text-gray-700">{language === 'en' ? 'Uploaded Files:' : 'Mga File nga Na-upload:'}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filePreviewUrls.map((url, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 relative">
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title={language === 'en' ? 'Remove file' : 'Tangtangon ang file'}
                  >
                    ×
                  </button>
                  {url.toLowerCase().endsWith('.pdf') ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-red-600 font-bold">PDF</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {uploadedFiles?.[index]?.name || `File ${index + 1}`}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {uploadedFiles?.[index]?.name || `File ${index + 1}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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