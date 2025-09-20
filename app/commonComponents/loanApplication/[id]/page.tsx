'use client';

  import { useState, useEffect } from 'react';
  import { useRouter } from "next/navigation";
  import { FiUser, FiDollarSign, FiFileText, FiPaperclip, FiArrowLeft } from 'react-icons/fi';
  import Link from 'next/link';
  import LoanOfficerNavbar from "@/app/userPage/loanOfficerPage/navbar/page";
  import emailjs from "emailjs-com";

  import WithCollateral from './withCollateral';
  import OpenTerm from './openTerm';

  import LoanAgreementModal from '@/app/commonComponents/modals/loanAgreement/modal';

  const API_URL = "http://localhost:3001/loan-applications";

  interface Application {
    applicationId: string;
    loanType: string;
    status: string;
    interviewDate?: string;
    interviewTime?: string;
    documents?: { fileName: string; filePath: string; mimeType: string }[];
    appName?: string;
    appDob?: string;
    appContact?: string;
    appEmail?: string;
    appMarital?: string;
    appSpouseName?: string;
    appSpouseOccupation?: string;
    appChildren?: number;
    appAddress?: string;
    sourceOfIncome?: string;
    appTypeBusiness?: string;
    appDateStarted?: string;
    appBusinessLoc?: string;
    appMonthlyIncome?: number;
    appEmploymentStatus?: string;
    appOccupation?: string;
    appCompanyName?: string;
    companyAddress?: string;
    monthlyIncome?: number;
    lengthOfService?: string;
    otherIncome?: number;
    appLoanPurpose?: string;
    appLoanAmount?: string;
    appLoanTerms?: string;
    appInterest?: number;
    collateralDescription?: string;
    collateralValue?: number;
    collateralType?: string;
    ownershipStatys?: string;
    unsecuredReason?: string;
    openTermConditions?: string;
    paymentSchedule?: string;
    characterReferences?: CharacterReference[];
  }

  interface CharacterReference {
    name: string;
    contact: string;
    relation: string;
  }
  

  export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('income'); // New state for tabs

    // Schedule modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    // Modal animation state
    const [showModal, setShowModal] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
    const storedRole = localStorage.getItem("role"); 
    setRole(storedRole);
    }, []);


    // Handle animation timing for schedule modal
    useEffect(() => {
      if (isModalOpen) {
        setShowModal(true);
        const timer = setTimeout(() => setAnimateIn(true), 10);
        return () => clearTimeout(timer);
      } else {
        setAnimateIn(false);
        const timer = setTimeout(() => setShowModal(false), 300);
        return () => clearTimeout(timer);
      }
    }, [isModalOpen]);

    const application = applications.find(app => app.applicationId === params.id);

    const [isAgreementOpen, setIsAgreementOpen] = useState(false);


    // Fetch applications
    useEffect(() => {
      const fetchApplications = async () => {
        try {
          const response = await authFetch(API_URL);
          if (!response.ok) throw new Error("Unautho  rized");
          const data = await response.json();
  
          const mappedData = data.map((app: any) => ({
            ...app,
            characterReferences: app.appReferences?.map((ref: any) => ({
              name: ref.name,
              contact: ref.contact,
              relation: ref.relation,
            })) || []
          }));
  
          setApplications(mappedData);
        } catch (err) {
          console.error("Failed to fetch applications:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchApplications();
    }, []);

    async function authFetch(url: string, options: RequestInit = {}) {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token in localStorage");

      return fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    }

    function formatTimeTo12Hour(time: string) {
      const [hourStr, minute] = time.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; 
      return `${hour}:${minute} ${ampm}`;
    }

    const handleScheduleInterview = async () => {
      if (!interviewDate || !interviewTime) {
        alert("Please select both date and time.");
        return;
      }
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");
    
        // Save schedule
        const scheduleRes = await authFetch(`${API_URL}/${id}/schedule-interview`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewDate, interviewTime }),
        });
        if (!scheduleRes.ok) throw new Error("Failed to save schedule");
    
        await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Pending" }),
        });
    
        setApplications(prev =>
          prev.map(app =>
            app.applicationId === id
              ? { ...app, interviewDate, interviewTime, status: "Pending" }
              : app
          )
        );
        setIsModalOpen(false);

        console.log({
          email: application.appEmail,
          to_name: application.appName,
          address: application.appAddress,
          interviewDate,
          interviewTime,
        });
        
    
        if (application?.appEmail) {
          try {

            const formattedTime = formatTimeTo12Hour(interviewTime);
            
            await emailjs.send(
              "service_xmh62vd",   
              "template_u19oksn",  
              {
                email: application.appEmail,
                to_name: application.appName,
                address: application.appAddress,
                interviewDate: interviewDate,
                interviewTime: interviewTime,
              },
              "oXk6jvK9nrgWsbn_o"    
            );
            alert("Interview scheduled. Email sent to applicant.");
          } catch (err) {
            console.error("EmailJS error:", err);
            alert("Interview scheduled but failed to send email.");
          }
        } else {
          alert("Interview scheduled, but applicant has no email.");
        }
      } catch (error) {
        console.error(error);
        alert("Could not schedule interview. Try again.");
      }
    };
    

    const handleClearedLoan = async () => {
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");

        await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Cleared" }),
        });

        setApplications(prev =>
          prev.map(app => app.applicationId === id ? { ...app, status: "Cleared" } : app)
        );
        alert("Loan status has been set to Cleared.");
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      }
    };

    const handleDisburse = async () => {
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");
    
        await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Disbursed" }),
        });
    
        setApplications(prev =>
          prev.map(app => app.applicationId === id ? { ...app, status: "Disbursed" } : app)
        );
    
        setIsAgreementOpen(true);
    
      } catch (error) {
        console.error(error);
        alert("Something went wrong while disbursing the loan.");
      }
    };
    

    const handleDenyApplication = async () => {
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");

        await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Denied" }),
        });

        setApplications(prev =>
          prev.map(app => app.applicationId === id ? { ...app, status: "Denied" } : app)
        );
        alert("Loan status changed to 'Denied'.");
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      }
    };

    //STATUS "CLEARED"
    const handleApproveApplication = async () => {
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");

        const response = await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved" }),
        });
        if (!response.ok) throw new Error("Failed to update status");

        setApplications(prev =>
          prev.map(app => (app.applicationId === id ? { ...app, status: "Approved" } : app))
        );

        alert("Application approved.");
      } catch (error) {
        console.error("Failed to approve application:", error);
        alert("Could not approve application. Try again.");
      }
    };

    const handleDenyFromCleared = async () => {
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");

        const response = await authFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Denied by LO" }),
        });
        if (!response.ok) throw new Error("Failed to update status");

        setApplications(prev =>
          prev.map(app => (app.applicationId === id ? { ...app, status: "Denied by LO" } : app))
        );

        alert("Application denied.");
      } catch (error) {
        console.error("Failed to deny application:", error);
        alert("Could not deny application. Try again.");
      }
    };

    const formatCurrency = (amount?: number | string) => {
      if (!amount) return "₱0.00";
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount));
    };

    if (!application && !loading) {
      return (
        <div className="min-h-screen bg-gray-50">
          <LoanOfficerNavbar />
          <div className="p-10 text-center text-gray-600 text-lg">
            Application not found.
          </div>
        </div>
      );
    }

    const capitalizeWords = (text?: string) => {
      if (!text) return "—";
      return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    return (
      <div className="min-h-screen bg-gray-50">
        <LoanOfficerNavbar />
        
        {/* Header Section - Similar to Patient Profile */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
                <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Applicant profile | <span className="text-sm font-normal text-gray-500">{application?.applicationId}</span>
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
                    <span className="text-sm text-gray-500">{application?.loanType}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {application?.status === "Applied" && role === "loan officer" && (
                  <>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium">
                      SET SCHEDULE
                    </button>
                    <button onClick={handleDenyApplication} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      DISMISS
                    </button>
                  </>
                )}
                {application?.status === "Pending" && role === "loan officer" &&(
                  <>
                    <button onClick={handleClearedLoan} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      CLEAR
                    </button>
                    <button onClick={handleDenyApplication} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      DISMISS
                    </button>
                  </>
                )}

                {application?.status === "Cleared" && role === "manager" &&(
                  <>
                    <button onClick={handleApproveApplication} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      APPROVE
                    </button>
                    <button onClick={handleDenyFromCleared} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      DENY
                    </button>
                  </>
                )}
                {application?.status === "Approved" && role === "loan officer" && (
                  <button
                    onClick={handleDisburse}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Disburse
                  </button>
                )}

                {application?.status === "Disbursed" && (
                  <button
                    onClick={() => setIsAgreementOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Loan Agreement
                  </button>
                )}


              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Profile Section */}
            <div className="lg:col-span-1 flex flex-col h-full">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex-shrink-0">
                <div className="p-6 text-center">
                  {/* Profile Image */}
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 border-4 border-white shadow-lg">
                    {application?.documents?.find(doc => doc.mimeType?.startsWith("image/")) ? (
                      <img
                        src={`http://localhost:3001/${
                          application.documents.find(doc => doc.mimeType?.startsWith("image/"))?.filePath
                        }`}
                        alt="Profile"
                        className="w-full h-full object-cover"
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

              {/* General Information Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-grow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of birth:</p>
                    <p className="text-gray-900">{application?.appDob || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address:</p>
                    <p className="text-gray-900">{application?.appAddress || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marital Status:</p>
                    <p className="text-gray-900">{application?.appMarital || '—'}</p>
                  </div>
                  
                  {/* Conditional Spouse Info */}
                  {application?.appMarital === "Married" && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Spouse Name:</p>
                        <p className="text-gray-900">{application?.appSpouseName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Spouse Occupation:</p>
                        <p className="text-gray-900">{application?.appSpouseOccupation || '—'}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Children:</p>
                    <p className="text-gray-900">{application?.appChildren || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Tabbed Content */}
            <div className="lg:col-span-1 flex flex-col h-full">
              {/* Tab Navigation and Content */}
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
                      Income Information
                    </button>
                    <button
                      onClick={() => setActiveTab('references')}
                      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'references'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Character References
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
                        Collateral Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 flex-grow overflow-y-auto">
                  {/* Income Information Tab */}
                  {activeTab === 'income' && (
                    <div className="space-y-4 h-full">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Source of Income:</p>
                        <p className="text-gray-900">{capitalizeWords(application?.sourceOfIncome) || '—'}</p>
                      </div>
                      
                      {application?.sourceOfIncome?.toLowerCase() === 'employed' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Occupation:</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appOccupation) || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Company:</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appCompanyName) || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Employment Status:</p>
                            <p className="text-gray-900">{capitalizeWords(application?.appEmploymentStatus) || '—'}</p>
                          </div>
                        </>
                      )}

                      {application?.sourceOfIncome?.toLowerCase() === 'business' && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Business Type:</p>
                            <p className="text-gray-900">{application?.appTypeBusiness || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date Started:</p>
                            <p className="text-gray-900">{application?.appDateStarted || '—'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Business Location:</p>
                            <p className="text-gray-900">{application?.appBusinessLoc || '—'}</p>
                          </div>
                        </>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Monthly Income:</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(application?.appMonthlyIncome)}</p>
                      </div>
                    </div>
                  )}

                  {/* Character References Tab */}
                  {activeTab === 'references' && (
                    <div className="h-full">
                      {application?.characterReferences && application.characterReferences.length > 0 ? (
                        <div className="space-y-4">
                          {application.characterReferences.map((ref, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  Reference {i + 1}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{ref.name}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{ref.contact}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Relationship:</span> <span className="text-gray-900">{ref.relation}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 h-full flex flex-col justify-center">
                          <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No character references provided</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collateral Details Tab */}
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

              {/* Files Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 flex-shrink-0">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Files</h3>
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
                      <p className="text-gray-500 text-sm">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Loan Details */}
            <div className="lg:col-span-1 flex flex-col h-full">
            {/* Loan Computation Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Loan Computation</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                {/* Loan Details */}
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500">Loan Purpose</span>
                    <span className="text-gray-900 break-words text-sm leading-relaxed">
                      {application?.appLoanPurpose || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Loan Amount</span>
                    <span className="text-gray-900">{formatCurrency(application?.appLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Interest Rate</span>
                    <span className="text-gray-900">{application?.appInterest || '—'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Loan Term</span>
                    <span className="text-gray-900">{application?.appLoanTerms || '—'} months</span>
                  </div>
                </div>

                {/* Computation Details */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {(() => {
                    const principal = Number(application?.appLoanAmount || 0);
                    const interestRate = Number(application?.appInterest || 0);
                    const terms = Number(application?.appLoanTerms || 1);

                    const totalInterest = (principal * interestRate * terms) / 100;
                    const totalPayable = principal + totalInterest;
                    const monthlyDue = totalPayable / terms;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Total Interest</span>
                          <span className="text-gray-900">{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Total Payable</span>
                          <span className="text-gray-900 font-semibold text-lg">{formatCurrency(totalPayable)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Monthly Due</span>
                          <span className="text-gray-900">{formatCurrency(monthlyDue)}</span>
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

        {/* Professional Schedule Modal */}
        {showModal && (
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 text-black p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <FiFileText className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule Interview</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Interview Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                    value={interviewDate} 
                    onChange={(e) => setInterviewDate(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Interview Time</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                    value={interviewTime} 
                    onChange={(e) => setInterviewTime(e.target.value)} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleInterview} 
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        )}

      <LoanAgreementModal
        isOpen={isAgreementOpen}
        onClose={() => setIsAgreementOpen(false)}
        application={application ?? null}
      />
      </div>
    );
  } 