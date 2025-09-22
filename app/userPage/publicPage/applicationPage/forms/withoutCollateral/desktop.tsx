
'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

type SuccessModalWithAnimationProps = { language: string; loanId: string | null; onClose: () => void };
function SuccessModalWithAnimation({ language, loanId, onClose }: SuccessModalWithAnimationProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setAnimateIn(true);
    return () => setAnimateIn(false);
  }, []);
  const handleClose = () => {
    onClose();
    router.push('/');
  };
  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {language === 'en' ? 'Application Submitted Successfully!' : 'Malampusong Napasa ang Aplikasyon!'}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'en'
              ? 'Your loan application has been received and is being processed.'
              : 'Nadawat na ang imong aplikasyon ug gi-proseso na.'}
          </p>
          {loanId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'en' ? 'Your Application ID:' : 'Imong Application ID:'}
              </p>
              <p className="text-lg font-semibold text-red-600">{loanId}</p>
            </div>
          )}
          <span className="block text-xs text-gray-500 mb-6">
            {language === 'en'
              ? 'We will soon notify you for the next step of your application through your provided contact details. Stay tuned for the updates.'
              : 'Amo kang pahibaw-an sa sunod nga lakang sa imong aplikasyon pinaagi sa imong gihatag nga contact details. Pabilin sa pagpaminaw para sa mga update.'}
          </span>
          <button
            onClick={handleClose}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
          >
            {language === 'en' ? 'Close' : 'Sirado'}
          </button>
        </div>
      </div>
    </div>
  );
}

import Common from "../common/common";

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
  onLanguageChange?: (lang: 'en' | 'ceb') => void;
}

export default function WithoutCollateralForm({ language, onLanguageChange }: WithoutCollateralFormProps) {
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
  const [appBusinessName, setAppBusinessName] = useState("");
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

  // Success Modal State
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [loanId, setLoanId] = useState<string | null>(null);

// Close Modal Function
const closeModal = () => {
  setShowSuccessModal(false);
  setLoanId(null);
};

  // Translations for select options
  const loanAmountPlaceholder = language === 'en' ? 'Select amount' : 'Pilia ang kantidad';

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

    // Remove file by index
    const removeFile = (index: number) => {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };  

      //2x2 upload state
    const [photo2x2, setPhoto2x2] = useState<File[]>([]);

  
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
    
        files.forEach((file) => {
          const validTypes = ["image/jpeg", "image/png", "image/jpg"];
          if (!validTypes.includes(file.type)) {
            alert(language === "en" ? "Only JPG and PNG are allowed for 2x2 photo." : "JPG ug PNG lang ang madawat para sa 2x2 nga litrato.");
            return;
          }
    
          if (file.size > 2 * 1024 * 1024) {
            alert(language === "en" ? "2x2 photo must be less than 2MB." : "Ang 2x2 nga litrato kinahanglan dili molapas og 2MB.");
            return;
          }
    
          const img = new Image();
          img.onload = () => {
            const { width, height } = img;
            const aspectRatio = width / height;
    
            if (aspectRatio < 0.9 || aspectRatio > 1.1) {
              alert(language === "en" ? "2x2 photo must be square (equal width and height)." : "Ang 2x2 nga litrato kinahanglan square (parehas ang gilapdon ug gitas-on).");
              return;
            }
    
            setPhoto2x2((prev) => [...prev, file]);
          };
          img.src = URL.createObjectURL(file);
        });
      }
    };
    

    const removeProfile = (index: number) => {
      setPhoto2x2((prev) => prev.filter((_, i) => i !== index));
    };
    
  
    
    const handleSubmit = async () => {
      
      if (!appLoanPurpose || !selectedLoan) {
        alert(language === 'en'
          ? "Please fill in all required fields."
          : "Palihug pun-a ang tanang kinahanglan nga field."
        );
        return;
      }

      if (uploadedFiles.length === 0) {
        alert(language === 'en'
          ? "Please upload at least one document."
          : "Palihug i-upload ang usa ka dokumento."
        );
        return;
      }

      if (photo2x2.length === 0) {
        alert(language === "en"
          ? "Please upload your 2x2 photo."
          : "Palihug i-upload ang imong 2x2 nga litrato."
        );
        return;
      }
    
      try {
        const formData = new FormData();
        formData.append("appName", appName);
        formData.append("appDob", appDob);
        formData.append("appContact", appContact);
        formData.append("appEmail", appEmail);
        formData.append("appMarital", appMarital);
        formData.append("appChildren", String(appChildren));
        formData.append("appSpouseName", appSpouseName);
        formData.append("appSpouseOccupation", appSpouseOccupation);
        formData.append("appAddress", appAddress);
        formData.append("appTypeBusiness", appTypeBusiness);
        formData.append("appBusinessName", appBusinessName);
        formData.append("appDateStarted", appDateStarted);
        formData.append("appBusinessLoc", appBusinessLoc);
        formData.append("appMonthlyIncome", String(appMonthlyIncome));
        formData.append("appOccupation", appOccupation);
        formData.append("appEmploymentStatus", appEmploymentStatus);
        formData.append("appCompanyName", appCompanyName);
        formData.append("sourceOfIncome", sourceOfIncome);
        formData.append("appLoanAmount", String(selectedLoan.amount));
        formData.append("appLoanTerms", String(selectedLoan.months));
        formData.append("appInterest", String(selectedLoan.interest));
        formData.append("appLoanPurpose", appLoanPurpose);
        appReferences.forEach((ref, i) => {
          formData.append(`appReferences[${i}][name]`, ref.name);
          formData.append(`appReferences[${i}][contact]`, ref.contact);
          formData.append(`appReferences[${i}][relation]`, ref.relation);
        });
        
    
        // Append multiple document files
        uploadedFiles.forEach(file => {
          formData.append("documents", file);
        });
    
        // Append profile picture (2x2 photo) correctly
        if (photo2x2[0]) {
          formData.append("profilePic", photo2x2[0]);
        }
    
        const res = await fetch(API_URL, { method: "POST", body: formData });
    
        if (res.ok) {
          const data = await res.json();
          setLoanId(data.application?.applicationId);
          setShowSuccessModal(true);
    
          // Reset form
          setAppLoanPurpose("");
          setSelectedLoan(null);
          setUploadedFiles([]);
          setPhoto2x2([]);
        } else {
          const errorText = await res.text();
          alert(language === 'en' ? "Failed to submit application. Server says: " + errorText : "Napakyas ang pagpasa sa aplikasyon. Sulti sa server: " + errorText);
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
        appBusinessName={appBusinessName}
        setAppBusinessName={setAppBusinessName}
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

       {/* 2x2 Upload */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? '2x2 Photo Upload' : 'I-upload ang 2x2 nga Litrato'}
        </h4>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleProfileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0 file:text-sm file:font-medium
                      file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
          />
        </div>
        {photo2x2.length > 0 && (
          <div className="mt-4 text-center">
            {photo2x2.map((file, index) => (
              <div key={index} className="flex justify-center items-center gap-4 py-1">
                <p className="text-sm text-gray-600">{file.name}</p>
                <button
                  onClick={() => removeProfile(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
                  {language === 'en' ? 'Remove' : 'Tangtangon'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

       {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Document Upload' : 'Iupload ang mga kinahanglanon nga dokumento'}
        </h4>
        <div>
        <label className="block text-sm mb-3 text-gray-500">{language === 'en' ? 'Refer to the sidebar for the list of required documents.' : 'Tan-awa ang sidebar para sa listahan sa mga kinahanglan nga dokumento.'}</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                        file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
              title={language === 'en' ? 'Choose files' : 'Pilia ang mga file'}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">{language === 'en' ? 'Accepted: PDF, JPG, PNG. You can upload multiple files.' : 'Dawaton: PDF, JPG, PNG. Pwede ka mag-upload og daghang files.'}</p>
        </div>

        {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h5 className="font-medium mb-3 text-gray-700">
            {language === "en" ? "Uploaded Files:" : "Mga File nga Na-upload:"}
          </h5>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-4 py-1"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
                  {language === 'en' ? 'Remove' : 'Tangtangon'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors shadow-sm"
      >
        {language === 'en' ? 'Submit Application' : 'Isumite ang Aplikasyon'}
      </button>

    {/* Success Modal */}
    {showSuccessModal && (
      <SuccessModalWithAnimation
        language={language}
        loanId={loanId}
        onClose={closeModal}
      />
    )}


    </>
  );
}