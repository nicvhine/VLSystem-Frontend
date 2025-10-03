'use client';

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import FormArea from "./formArea/formArea"; 
import Navbar from "./navbar";
import LoginModal from "../loginForm/page";
import useIsMobile from "../../../commonComponents/utils/useIsMobile";

export default function ApplicationPage() {
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          return parsed.language || 'en';
        } catch (e) {
          return 'en';
        }
      }
    }
    return 'en';
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          localStorage.setItem('reloanInfo', JSON.stringify({
            ...parsed,
            language: language
          }));
        } catch (e) {
          console.error('Error updating reloan info with language:', e);
        }
      }
    }
  }, [language]);

  const [address, setAddress] = useState('');
  const [loanType, setLoanType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mockLoanId] = useState("VL-" + Math.floor(100000 + Math.random() * 900000));
  const [maritalStatus, setMaritalStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const handleSubmit = () => setShowSuccessModal(true);
  const closeModal = () => setShowSuccessModal(false);

  // For mobile info overlay
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  const loanTypes = [
    language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)',
    language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)',
    language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam',
  ];

  const getRequirements = (type: string) => {
    switch(type) {
      case (language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
        ];
      case (language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
      case (language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
      default:
        return [];
    }
  };

  const loanProcessSteps = [
    language === 'en' ? 'Application Submission' : 'Pagsumite sa Aplikasyon',
    language === 'en' ? 'Document Verification' : 'Pag-verify sa Dokumento',
    language === 'en' ? 'Credit Assessment' : 'Pagsusi sa Kredito',
    language === 'en' ? 'Approval Process' : 'Proseso sa Pag-apruba',
    language === 'en' ? 'Loan Disbursement' : 'Pagpagawas sa Pahulam',
  ];

  return (
    <div className={isMobile ? "min-h-screen flex flex-col bg-white text-black" : "h-screen flex flex-col bg-white text-black"}>
      <Navbar 
        language={language}
        setLanguage={setLanguage}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isMobile={isMobile}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} language={language} />


      {/* Floating Info Button for mobile */}
      {isMobile && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
          onClick={() => setShowInfoOverlay(!showInfoOverlay)}
          title={language === 'en' ? 'Loan Info' : 'Impormasyon sa Pahulam'}
        >
          !
        </button>
      )}

      {/* Info Overlay Modal for mobile */}
      {isMobile && showInfoOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg border border-gray-200 p-4 w-80 max-w-[90vw] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setShowInfoOverlay(false)}
            >
              <FiX size={24} />
            </button>
            {/* Loan Requirements */}
            {loanType ? (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 text-center mb-2">
                  {language === 'en' ? 'Loan Requirements' : 'Mga Kinahanglanon sa Pahulam'}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {getRequirements(loanType).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center mb-4">
                {language === 'en' ? 'Select a loan type to view requirements' : 'Pilia ang klase sa pahulam aron makita ang mga kinahanglanon'}
              </p>
            )}
            {/* Application Process */}
            <div>
              <h3 className="font-semibold text-gray-800 text-center mb-2">
                {language === 'en' ? 'Application Process' : 'Proseso sa Aplikasyon'}
              </h3>
              <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                {loanProcessSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Main content */}
      <div className={isMobile ? "flex-1 flex flex-col overflow-hidden" : "flex flex-1 overflow-hidden"}>
        {/* Left Sidebar (desktop only) */}
        {!isMobile && (
          <div className="w-80 bg-white shadow-sm p-6 space-y-6 overflow-y-auto">
            {/* Type of Loan Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Type of Loan' : 'Klase sa Pahulam'}</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <select 
                    value={loanType} 
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full p-3 text-center font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? '-- TYPE OF LOAN --' : '-- KLASE SA PAHULAM --'}</option>
                    {loanTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Type of Loan Requirements Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Loan Requirements' : 'Mga Kinahanglanon sa Pahulam'}</h3>
              </div>
              <div className="p-4 overflow-y-auto">
                {loanType ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-red-600 mb-3">{loanType}</h4>
                    <ul className="space-y-2 text-sm">
                      {getRequirements(loanType).map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-red-500 text-xs font-bold mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm text-center flex items-center justify-center h-full">
                    {language === 'en' ? 'Select a loan type to view requirements' : 'Pilia ang klase sa pahulam aron makita ang mga kinahanglanon'}
                  </div>
                )}
              </div>
            </div>
            {/* Loan Process Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Application Process' : 'Proseso sa Aplikasyon'}</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <ul className="space-y-3 text-sm">
                    {loanProcessSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Application Form Area */}
      <div className={isMobile ? "flex-1 overflow-y-auto p-2 bg-gray-50" : "flex-1 overflow-y-auto p-6 bg-gray-50"}>
        {/* Always show loan type dropdown at the top on mobile */}
        {isMobile && (
          <div className="flex justify-center mt-2 mb-0 w-full">
            <div className="w-full max-w-[420px] px-4 mb-2">
              <select
                value={loanType}
                onChange={e => setLoanType(e.target.value)}
                className="w-full pt-3 pb-3 text-center text-base font-medium bg-white border border-gray-200 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{language === 'en' ? '-- TYPE OF LOAN --' : '-- KLASE SA PAHULAM --'}</option>
                {loanTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {loanType ? (
          <FormArea loanType={loanType} language={language} isMobile={isMobile} />
        ) : (
          <div className={isMobile ? "flex flex-col items-center justify-center h-full" : "flex items-center justify-center h-full text-gray-400 text-lg font-medium"}>
            <div className={isMobile ? "text-gray-400 text-base font-medium mb-2 text-center" : "text-gray-400 text-lg font-medium"}>
              {language === 'en'
                ? 'Please select a loan type to start your application.'
                : 'Palihug pilia ang klase sa pahulam aron makasugod sa aplikasyon.'}
            </div>
          </div>
        )}
      </div>


      </div>
    </div>
  );
}
