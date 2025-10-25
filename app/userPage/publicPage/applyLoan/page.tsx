'use client';

import { useState, useEffect, useMemo } from "react";
import { FiX, FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import FormArea from "./formArea/formArea";
import LandingNavbar from "../navbar/landingNavbar";
import LoginModal from "../loginForm/page";
import useIsMobile from "../../../commonComponents/utils/useIsMobile";
import { translateLoanType, getRequirements, getLoanProcessSteps } from "@/app/commonComponents/utils/formatters";
import { useTrackerSections } from "./formArea/hooks/useTrackerSections";
import translationData from '@/app/commonComponents/translation';

export default function ApplicationPage() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loanType, setLoanType] = useState<string>('');
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [formProgress, setFormProgress] = useState<Record<string, boolean>>({});
  const [formMissingCounts, setFormMissingCounts] = useState<Record<string, number>>({});
  const [formMissingDetails, setFormMissingDetails] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  // Base loan types (English only, used as keys)
  const baseLoanTypes = [
    'Regular Loan Without Collateral',
    'Regular Loan With Collateral',
    'Open-Term Loan',
  ];

  const loanProcessSteps = useMemo(() => getLoanProcessSteps(language), [language]);
  const pub = translationData.applicationTranslation[language];

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

  // Tracker sections depend on selected loan type. Include Agent, Loan Details and a 2x2 Photo item
  // for Regular Loan Without Collateral per the product request.
  const trackerSections = useTrackerSections(loanType, language);


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
          title={pub.loanInfo}
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
                  {pub.loanRequirements}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {getRequirements(loanType, language).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center mb-4">
                {pub.selectLoanTypeToViewRequirements}
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
                  {pub.typeOfLoan}
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <select 
                    value={loanType} 
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full p-3 text-center font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">{pub.typeOfLoanPlaceholder}</option>
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
                  {pub.loanRequirements}
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
                  {pub.applicationProcess}
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
                    <option value="">{pub.typeOfLoanPlaceholder}</option>
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
                onProgressUpdate={(progress) => {
                  setFormProgress(progress.done || {});
                  setFormMissingCounts(progress.missingCounts || {});
                  setFormMissingDetails(progress.missingDetails || {});
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
                {pub.pleaseSelectLoanType}
              </div>
            )}
          </div>

          {/* Right Sidebar Tracker */}
          {!isMobile && pageLoaded && loanType && (
            <div className="w-74 p-6 space-y-4 overflow-y-auto rounded-lg ">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                {pub.progressTracker}
              </h3>
              <ul className="space-y-3 text-sm">
                {trackerSections.map(section => {
                  const done = !!formProgress[section.key];
                  const missing = formMissingCounts[section.key] || 0;
                  const isExpanded = !!expandedSections[section.key];
                  const details = formMissingDetails[section.key] || [];

                  return (
                    <li key={section.key} className="flex flex-col w-full">
                      <div className="flex items-start gap-3 w-full">
                        <button
                          onClick={() => {
                            const special = section.key === 'photo2x2' || section.key === 'documents';
                            const el = document.getElementById(special ? 'photo2x2_and_documents' : section.key);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="flex items-start gap-3 w-full text-left"
                        >
                          <span
                            className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full border ${
                              done
                                ? 'bg-green-50 text-green-600 border-green-600'
                                : 'border-gray-300 text-gray-300'
                            }`}
                          >
                            {done ? <FiCheck /> : null}
                          </span>
                          <span className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-600'}`}>
                            {section.label}
                          </span>
                        </button>

                        {!done && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedSections(prev => ({ ...prev, [section.key]: !prev[section.key] })); }}
                            className="ml-2 p-1 rounded hover:bg-gray-100"
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                            title={isExpanded ? pub.collapse : pub.expand}
                          >
                            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                        )}

                        {missing > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                            {missing}
                          </span>
                        )}
                      </div>

                      {isExpanded && details.length > 0 && (
                        <ul className="mt-2 ml-9 text-xs text-gray-600 space-y-1">
                          {details.map((d, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-500 text-xs font-bold mt-1">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
