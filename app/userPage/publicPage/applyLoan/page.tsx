'use client';

import { useState, useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import FormArea from "./formArea/formArea"; 
import LandingNavbar from "../navbar/landingNavbar";
import LoginModal from "../loginForm/page";
import useIsMobile from "../../../commonComponents/utils/useIsMobile";
import { translateLoanType, getRequirements, getLoanProcessSteps } from "@/app/commonComponents/utils/formatters";

export default function ApplicationPage() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loanType, setLoanType] = useState<string>('');
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [formProgress, setFormProgress] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  // Base loan types (English only, used as keys)
  const baseLoanTypes = [
    'Regular Loan Without Collateral',
    'Regular Loan With Collateral',
    'Open-Term Loan',
  ];

  const loanProcessSteps = useMemo(() => getLoanProcessSteps(language), [language]);

  useEffect(() => {
    if (!localStorage.getItem('role')) localStorage.setItem('role', 'public');
    if (!localStorage.getItem('language')) localStorage.setItem('language', 'en');

    const savedLanguage = localStorage.getItem('language') as 'en' | 'ceb';
    if (savedLanguage) setLanguage(savedLanguage);

    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (!localStorage.getItem('role')) localStorage.setItem('role', 'public');

    const savedLanguage = localStorage.getItem('language') as 'en' | 'ceb' | null;
    if (!savedLanguage) {
      localStorage.setItem('language', 'en');
      setLanguage('en');
    } else {
      setLanguage(savedLanguage);
    }

    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Compute translated loan types
  const loanTypes = useMemo(() => {
    return baseLoanTypes.map(type => ({
      key: type,
      label: translateLoanType(type, language),
    }));
  }, [language]);

  // Tracker sections (static labels)
  const trackerSections = useMemo(() => {
    const sections = [
      { key: "basicInfo", label: language === "en" ? "Basic Information" : "Pangunang Impormasyon" },
      { key: "income", label: language === "en" ? "Source of Income" : "Tinubdan sa Kita" },
      { key: "references", label: language === "en" ? "References" : "Mga Referensya" },
      { key: "agent", label: language === "en" ? "Agent Selection" : "Pagpili sa Ahente" },
      { key: "loanDetails", label: language === "en" ? "Loan Details" : "Mga Detalye sa Pahulam" },
      { key: "photo", label: language === "en" ? "2x2 Photo" : "2x2 nga Larawan" },
      { key: "documents", label: language === "en" ? "Supporting Documents" : "Mga Dokumento" },
    ];
    
    // Add collateral section only if loan type requires it
    if (loanType && (loanType.includes("With Collateral") || loanType.includes("Open-Term"))) {
      sections.splice(2, 0, { key: "collateral", label: language === "en" ? "Collateral Information" : "Impormasyon sa Kolateral" });
    }
    
    return sections;
  }, [language, loanType]);

  return (
    <div className={isMobile ? "min-h-screen flex flex-col bg-white text-black" : "h-screen flex flex-col bg-white text-black"}>
      <LandingNavbar 
        language={language}
        setLanguage={setLanguage}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} language={language} />

      {/* Floating info button (mobile) */}
      {isMobile && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
          onClick={() => setShowInfoOverlay(!showInfoOverlay)}
          title={language === 'en' ? 'Loan Info' : 'Impormasyon sa Pahulam'}
        >
          !
        </button>
      )}

      {/* Info overlay modal (mobile) */}
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
                  {getRequirements(loanType, language).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center mb-4">
                {language === 'en'
                  ? 'Select a loan type to view requirements'
                  : 'Pilia ang klase sa pahulam aron makita ang mga kinahanglanon'}
              </p>
            )}
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
                <h3 className="font-semibold text-gray-800 text-center">
                  {language === 'en' ? 'Type of Loan' : 'Klase sa Pahulam'}
                </h3>
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
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loan Requirements Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-center">
                  {language === 'en' ? 'Loan Requirements' : 'Mga Kinahanglanon sa Pahulam'}
                </h3>
              </div>
              <div className="p-4 overflow-y-auto">
                {loanType ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-red-600 mb-3">
                      {translateLoanType(loanType, language)}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {getRequirements(loanType, language).map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-red-500 text-xs font-bold mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm text-center flex items-center justify-center h-full">
                    {language === 'en'
                      ? 'Select a loan type to view requirements'
                      : 'Pilia ang klase sa pahulam aron makita ang mga kinahanglanon'}
                  </div>
                )}
              </div>
            </div>

            {/* Loan Process Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-center">
                  {language === 'en' ? 'Application Process' : 'Proseso sa Aplikasyon'}
                </h3>
              </div>
              <div className="p-4">
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
        )}

        {/* Form Area + Progress Tracker */}
        <div className="flex flex-1 bg-gray-50 overflow-hidden">
          
          {/* Application Form */}
          <div className={isMobile ? "flex-1 overflow-y-auto p-2" : "flex-1 overflow-y-auto p-6"}>
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
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {loanType ? (
              <FormArea 
                loanType={loanType}
                language={language}
                isMobile={isMobile}
                onProgressUpdate={setFormProgress}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
                {language === 'en'
                  ? 'Please select a loan type to start your application.'
                  : 'Palihug pilia ang klase sa pahulam aron makasugod sa aplikasyon.'}
              </div>
            )}
          </div>

          {/* Right Sidebar Tracker */}
          {!isMobile && (
            <div className="w-64 bg-white border-l border-gray-100 shadow-sm p-6 space-y-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-800 text-center mb-4">
                {language === 'en' ? 'Progress Tracker' : 'Tracker sa Aplikasyon'}
              </h3>
              <ul className="space-y-3 text-sm">
                {trackerSections.map(section => (
                  <li
                    key={section.key}
                    className={`flex items-center gap-2 transition-all ${
                      formProgress[section.key]
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {formProgress[section.key] ? (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    )}
                    <span>{section.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}