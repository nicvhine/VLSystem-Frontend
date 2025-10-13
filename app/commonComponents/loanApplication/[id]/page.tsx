"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiDollarSign, FiFileText, FiPaperclip, FiArrowLeft } from "react-icons/fi";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";


// Success modal component
import SuccessModal from '../../modals/successModal/modal';

// Navigation component
import LoanOfficerNavbar from "@/app/userPage/loanOfficerPage/navbar/page";

// Customization components
import WithCollateral from './customization/withCollateral';
import OpenTerm from './customization/openTerm'; 

// Modal components
import LoanAgreementModal from '@/app/commonComponents/modals/loanAgreement/modal';
import SetScheduleModal from "@/app/commonComponents/modals/loanApplication/scheduleModal";
import AccountModal from "@/app/commonComponents/modals/loanApplication/accountModal"; 
import ReleaseForm from "../../modals/loanAgreement/releaseForm";
import ErrorModal from '../../modals/errorModal/modal';

// Custom hooks
import ApplicationButtons from "../hooks/applicationButtons";
import { useApplications } from "../hooks/useApplication";

// Translation module
import secondLoanApplicationTranslation from "../translation/second";

// Role-based page wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

// API endpoint for loan applications
const API_URL = "http://localhost:3001/loan-applications";
/**
 * Application details page component with profile, income, references, collateral, and modals
 * Displays comprehensive application information in a tabbed interface with action buttons
 * @param params - Route parameters containing the application ID
 * @returns JSX element containing the application details interface
 */
export default function ApplicationDetailsPage() {
  const params = useParams();
  const id = params?.id; // id from the route
  // Success modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  /**
   * Show success modal with message
   * @param msg - Success message to display
   */
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setSuccessModalOpen(true);
    setTimeout(() => setSuccessModalOpen(false), 5000);
  };
  
  const router = useRouter();
  const { applications, setApplications, loading } = useApplications(API_URL);

  // Tab and modal state
  const [activeTab, setActiveTab] = useState('income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState<"loan" | "release" | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  const modalRef = useRef<any>(null);


  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in localStorage");

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await authFetch(API_URL);
        const data = await res.json();
        setApplications(data); 
      } catch (err) {
        console.error("Failed to refresh applications:", err);
      }
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [setApplications]);
  

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); 
    setRole(storedRole);
    
    // Initialize language from localStorage
    if (storedRole === "head") {
      const storedLanguage = localStorage.getItem("headLanguage") as 'en' | 'ceb';
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } else if (storedRole === "loan officer") {
      const storedLanguage = localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb';
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } else if (storedRole === "manager") {
      const storedLanguage = localStorage.getItem("managerLanguage") as 'en' | 'ceb';
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if ((role === "head" && event.detail.userType === 'head') || 
          (role === "loan officer" && event.detail.userType === 'loanOfficer') ||
          (role === "manager" && event.detail.userType === 'manager')) {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, [role]);

  // Get translations
  const getTranslations = () => {
    return secondLoanApplicationTranslation[language];
  };

  const t = getTranslations();

  // Function to translate loan types
  const translateLoanType = (loanType: string) => {
    switch (loanType) {
      case "Regular Loan Without Collateral":
        return t.loanType1;
      case "Regular Loan With Collateral":
        return t.loanType2;
      case "Open-Term Loan":
        return t.loanType3;
      default:
        return loanType;
    }
  };

  const application = applications.find(app => app.applicationId === id);

  const formatCurrency = (amount?: number | string) => {
    if (!amount) return "₱0.00";
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount));
  };

  const capitalizeWords = (text?: string) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!application && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoanOfficerNavbar />
        <div className="p-10 text-center text-gray-600 text-lg">{t.applicationNotFound}</div>
      </div>
    );
  }

  let Wrapper;
  if (role === "loan officer") Wrapper = LoanOfficer;
  else if (role === "head") Wrapper = Head;
  else Wrapper = Manager;

  // Portal host for modals
  const [modalContainer, setModalContainer] = useState<Element | null>(null);
  useEffect(() => {
    setModalContainer(document.getElementById('modal-root'));
  }, []);

  // Error modal state
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
    setTimeout(() => setErrorModalOpen(false), 3000);
  };

  return (
  <Wrapper>
    <div className="min-h-screen bg-gray-50">
      {/* Modal Portal Host */}
      <div id="modal-root"></div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">

              {/*BACK BUTTON LOGIC*/}
              <button
                onClick={() => {
                if (role === "head") {
                    router.push("/commonComponents/loanApplication");
                } else if (role === "manager") {
                    router.push("/commonComponents/loanApplication")
                }
                else {
                    router.push("/commonComponents/loanApplication");
                }
                }}
                className="text-gray-400 hover:text-gray-600"
                >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              {/*HEADER*/}
                <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t.applicantProfile} | <span className="text-sm font-normal text-gray-500">{application?.applicationId}</span>
                </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      application?.status === 'Applied' ? 'bg-red-100 text-red-800' :
                      application?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      application?.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      application?.status === 'Denied' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application?.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">{translateLoanType(application?.loanType || '')}</span>
                  </div>
                </div>
              </div>

              {/*BUTTONS*/}
              <div className="flex space-x-3">
                <ApplicationButtons
                  application={application!}
                  role={role}
                  setApplications={setApplications}
                  authFetch={authFetch}
                  API_URL={API_URL}
                  setIsModalOpen={setIsModalOpen}
                  setIsAgreementOpen={setIsAgreementOpen}
                  modalRef={modalRef}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              </div>

            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">    

            {/* PROFILE SECTION */}
            <div className="lg:col-span-1 flex flex-col h-full">

              {/* FIRST CARD*/}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex-shrink-0">
                <div className="p-6 text-center">
                  {/* Profile Image */}
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 border-4 border-white shadow-lg">
                    {application?.profilePic && typeof application.profilePic === 'object' && (application.profilePic as any).filePath ? (
                      <img
                        src={`http://localhost:3001/${(application.profilePic as any).filePath}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-profile.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUser className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {/* Name and Contact */}
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{application?.appName || '—'}</h2>
                  <p className="text-red-600 font-medium mb-1">{application?.appContact || '—'}</p>
                  <p className="text-gray-600 text-sm">{application?.appEmail || '—'}</p>
                </div>
              </div>

              {/* BASIC INFORMATION CARD*/}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-grow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{t.basicInformation}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.dateOfBirth}</p>
                    <p className="text-gray-900">{application?.appDob || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.address}</p>
                    <p className="text-gray-900">{application?.appAddress || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.maritalStatus}</p>
                    <p className="text-gray-900">{application?.appMarital || '—'}</p>
                  </div>
                  
                  {/* SPOUSE INFO */}
                  {application?.appMarital === "Married" && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t.spouseName}</p>
                        <p className="text-gray-900">{application?.appSpouseName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t.spouseOccupation}</p>
                        <p className="text-gray-900">{application?.appSpouseOccupation || '—'}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t.children}</p>
                    <p className="text-gray-900">{application?.appChildren || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="lg:col-span-1 flex flex-col h-full">

              {/* TAB NAVIGATION*/}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-grow flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('income')}
                      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'income'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.incomeInformation}
                    </button>
                    <button
                      onClick={() => setActiveTab('references')}
                      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'references'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.characterReferences}
                    </button>
                    {(application?.loanType === "Regular Loan With Collateral" || application?.loanType === "Open-Term Loan") && (
                      <button
                        onClick={() => setActiveTab('collateral')}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'collateral'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {t.collateralDetails}
                      </button>
                    )}
                  </div>
                </div>

                {/* TAB CONTENT */}
                <div className="p-6 flex-grow overflow-y-auto">

                  {/* INCOME INFORMATION */}
                  {activeTab === 'income' && (
                    <div className="space-y-4 h-full">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t.sourceOfIncome}</p>
                        <p className="text-gray-900">{capitalizeWords(application?.sourceOfIncome) || '—'}</p>
                      </div>
                      
                      {application?.sourceOfIncome?.toLowerCase() === 'employed' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.occupation}</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appOccupation) || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.company}</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appCompanyName) || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.employmentStatus}</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appEmploymentStatus) || '—'}</p>
                          </div>
                        </>
                      )}

                      {application?.sourceOfIncome?.toLowerCase() === 'business' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.businessType}</p>
                            <p className="text-gray-900">{application?.appTypeBusiness || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.businessName}</p>
                            <p className="text-gray-900">{application?.appBusinessName || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.dateStarted}</p>
                            <p className="text-gray-900">{application?.appDateStarted || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">{t.businessLocation}</p>
                            <p className="text-gray-900">{application?.appBusinessLoc || '—'}</p>
                          </div>
                        </>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-500">{t.monthlyIncome}</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(application?.appMonthlyIncome)}</p>
                      </div>
                    </div>
                  )}

                  {/* CHARACTER REFERENCES */}
                  {activeTab === 'references' && (
                    <div className="h-full">
                      {application?.appReferences && application.appReferences.length > 0 ? (
                        <div className="space-y-4">
                          {application.appReferences.map((ref, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  {t.reference} {i + 1}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">{t.name}</span> <span className="text-gray-900">{ref.name}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">{t.contact}</span> <span className="text-gray-900">{ref.contact}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">{t.relationship}</span> <span className="text-gray-900">{ref.relation}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 h-full flex flex-col justify-center">
                          <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">{t.noReferences}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COLLATERAL DETAILS*/}
                  {activeTab === 'collateral' && (
                    <div className="h-full">
                      {application?.loanType === "Regular Loan With Collateral" && (
                        <WithCollateral application={application} formatCurrency={formatCurrency} />
                      )}
                      {application?.loanType === "Open-Term Loan" && (
                        <OpenTerm application={application} formatCurrency={formatCurrency} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* FILES*/}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 flex-shrink-0">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{t.files}</h3>
                </div>
                <div className="p-6">
                  {application?.documents && application.documents.length > 0 ? (
                    <div className="space-y-3">
                      {application.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FiFileText className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 max-w-[180px] break-all whitespace-normal">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">12.3kb</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a 
                              href={`http://localhost:3001/${doc.filePath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FiPaperclip className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">{t.noDocuments}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 flex flex-col h-full">
            {/* LOAN COMPUTATION */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t.loanComputation}</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{t.loanPurpose}</span>
                    <span className="text-gray-900 break-words text-sm leading-relaxed">{application?.appLoanPurpose || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{t.loanAmount}</span>
                    <span className="text-gray-900">{formatCurrency(application?.appLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{t.interestRate}</span>
                    <span className="text-gray-900">{application?.appInterestRate || '—'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{t.loanTerm}</span>
                    <span className="text-gray-900">{application?.appLoanTerms || '—'} {t.months}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {(() => {
                    const principal = Number(application?.appLoanAmount || 0);
                    const interestRate = Number(application?.appInterestRate || 0);
                    const terms = Number(application?.appLoanTerms || 1);


                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">{t.totalInterest}</span>
                          <span className="text-gray-900">{formatCurrency(application?.appTotalInterestAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">{t.totalPayable}</span>
                          <span className="text-gray-900 font-semibold text-lg">{formatCurrency(application?.appTotalPayable)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">{t.monthlyDue}</span>
                          <span className="text-gray-900">{formatCurrency(application?.appMonthlyDue)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* MODALS */}
          <SetScheduleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            application={application}
            setApplications={setApplications}
            authFetch={authFetch}
            showError={showError}
            showSuccess={showSuccess}
          />
          <ErrorModal
            isOpen={errorModalOpen}
            message={errorMessage}
            onClose={() => setErrorModalOpen(false)}
          />
          <SuccessModal
            isOpen={successModalOpen}
            message={successMessage}
            onClose={() => setSuccessModalOpen(false)}
          />
          <ErrorModal
            isOpen={errorModalOpen}
            message={errorMessage}
            onClose={() => setErrorModalOpen(false)}
          />

{isAgreementOpen === "loan" && (
  <LoanAgreementModal
    isOpen={true}
    onClose={() => setIsAgreementOpen(null)}
    application={application ?? null}
  />
)}

{isAgreementOpen === "release" && (
  <ReleaseForm
    isOpen={true}
    onClose={() => setIsAgreementOpen(null)}
    application={application ?? null}
  />
)}

        <AccountModal ref={modalRef} />
      </div>
      </Wrapper>
    );
  }