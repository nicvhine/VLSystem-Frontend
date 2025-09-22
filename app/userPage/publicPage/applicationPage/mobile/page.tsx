'use client';

import { useState, useEffect } from "react";
import Navbar from "../navbar";
import WithCollateralLoanForm from "../forms/withCollateral/withCollateral";
import WithoutCollateralLoanForm from "../forms/withoutCollateral/withoutCollateral";
import OpenTermLoanForm from "../forms/openTerm";
import LoginModal from "../../loginForm/page";
import { FiX } from "react-icons/fi";

export default function ApplicationPage() {
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try { return JSON.parse(reloanInfo).language || 'en'; } 
        catch { return 'en'; }
      }
    }
    return 'en';
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [loanType, setLoanType] = useState<string>('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [address, setAddress] = useState('');

  const loanTypes = [
    language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)',
    language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)',
    language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam',
  ];

  const getRequirements = (type: string) => {
    switch(type) {
      case loanTypes[0]:
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
        ];
      case loanTypes[1]:
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
      case loanTypes[2]:
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
      default: return [];
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
    <div className="h-screen bg-white text-black flex flex-col">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isModalOpen={false} 
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Floating Info Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
        onClick={() => setShowInfoOverlay(!showInfoOverlay)}
        title={language === 'en' ? 'Loan Info' : 'Impormasyon sa Pahulam'}
      >
        !
      </button>

      {/* Info Overlay */}
      {showInfoOverlay && (
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {/* Application Form Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 mb-2 break-words">
            {loanType}
          </h1>
          <div className="w-16 h-1 bg-red-600 rounded"></div>
        </div>

        {/* Loan Type Selection */}
        <div className="mb-6">
          <select
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="w-full p-3 text-center font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">{language === 'en' ? '-- SELECT LOAN TYPE --' : '-- PILI SA KLASE SA PAHULAM --'}</option>
            {loanTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Form */}
        {loanType === loanTypes[0] && <WithoutCollateralLoanForm language={language} />}
        {loanType === loanTypes[1] && (
          <WithCollateralLoanForm
            maritalStatus={maritalStatus}
            setMaritalStatus={setMaritalStatus}
            incomeSource={incomeSource}
            setIncomeSource={setIncomeSource}
            address={address}
            setAddress={setAddress}
            employmentStatus={employmentStatus}
            setEmploymentStatus={setEmploymentStatus}
            language={language}
          />
        )}
        {loanType === loanTypes[2] && (
          <OpenTermLoanForm
            maritalStatus={maritalStatus}
            setMaritalStatus={setMaritalStatus}
            incomeSource={incomeSource}
            setIncomeSource={setIncomeSource}
            address={address}
            setAddress={setAddress}
            employmentStatus={employmentStatus}
            setEmploymentStatus={setEmploymentStatus}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
