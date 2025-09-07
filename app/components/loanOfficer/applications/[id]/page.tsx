  'use client';

  import { useState, useEffect } from 'react';
  import { FiUser, FiDollarSign, FiFileText, FiPaperclip, FiArrowLeft } from 'react-icons/fi';
  import Link from 'next/link';
  import LoanOfficerNavbar from "../../loNavbar/page";

  import WithCollateral from './withCollateral';
  import OpenTerm from './openTerm';

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

  interface Note {
    text: string;
    date: string;
  }

  interface CharacterReference {
    name: string;
    contact: string;
    relation: string;
  }
  

  export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Note[]>([]);

    // Schedule modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');

    const application = applications.find(app => app.applicationId === params.id);

    // Fetch applications
    useEffect(() => {
      const fetchApplications = async () => {
        try {
          const response = await authFetch(API_URL);
          if (!response.ok) throw new Error("Unauthorized");
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

    const handleScheduleInterview = async () => {
      if (!interviewDate || !interviewTime) {
        alert("Please select both date and time.");
        return;
      }
      try {
        const id = application?.applicationId;
        if (!id) throw new Error("Missing application id");

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
        alert("Interview scheduled. Status is now Pending.");
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

    const handleCommentSubmit = () => {
      if (comment.trim()) {
        const newComment: Note = {
          text: comment,
          date: new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        setComments([newComment, ...comments]);
        setComment('');
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <Link href="/components/loanOfficer/applications" className="inline-flex items-center text-black hover:text-gray-600 mb-2 transition-colors">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{params.id} - {application?.loanType}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {application?.status === "Applied" && (
                <>
                  <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Set Schedule</button>
                  <button onClick={handleDenyApplication} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Dismiss</button>
                </>
              )}
              {application?.status === "Pending" && (
                <>
                  <button onClick={handleClearedLoan} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Clear</button>
                  <button onClick={handleDenyApplication} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Dismiss</button>
                </>
              )}
              {application?.status === "Approved" && (
                <Link href={`/LoanAgreementPage/${application.applicationId}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Generate Loan Agreement</Link>
              )}
              {["Cleared", "Denied", "Denied by LO", "Endorsed", "Accepted"].includes(application?.status || "") && (
                <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed">{application?.status}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">

            {/* Basic Information */}   
              <section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                </div>
                <div className=" mb-6">
                <div className="w-32 h-32 rounded-lg flex items-center justify-center border border-gray-400 overflow-hidden bg-gray-50">
                {application?.documents?.find(doc => doc.mimeType?.startsWith("image/")) ? (
                  <img
                    src={`http://localhost:3001/${
                      application.documents.find(doc => doc.mimeType?.startsWith("image/"))?.filePath
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-12 h-12 text-gray-400" />
                )}
              </div>
              </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><p className="text-sm font-medium text-gray-500">Name</p><p className="text-base text-gray-800 mt-1">{application?.appName || '—'}</p></div>
                  <div><p className="text-sm font-medium text-gray-500">Date of Birth</p><p className="text-base text-gray-800 mt-1">{application?.appDob || '—'}</p></div>
                  <div><p className="text-sm font-medium text-gray-500">Contact Number</p><p className="text-base text-gray-800 mt-1">{application?.appContact || '—'}</p></div>
                  <div><p className="text-sm font-medium text-gray-500">Email Address</p><p className="text-base text-gray-800 mt-1">{application?.appEmail || '—'}</p></div>
                  <div><p className="text-sm font-medium text-gray-500">Marital Status</p><p className="text-base text-gray-800 mt-1">{application?.appMarital || '—'}</p></div>
                  <div><p className="text-sm font-medium text-gray-500">Number of Children</p><p className="text-base text-gray-800 mt-1">{application?.appChildren || '—'}</p></div>
                  <div className="sm:col-span-2"><p className="text-sm font-medium text-gray-500">Home Address</p><p className="text-base text-gray-800 mt-1">{application?.appAddress || '—'}</p></div>
                </div>
              </section>

              {/* Source of Income */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Source of Income</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type of Income</p>
                    <p className="text-base text-gray-800 mt-1">
                      {application?.sourceOfIncome?.toLowerCase() === 'employed'
                        ? 'Employed'
                        : application?.sourceOfIncome?.toLowerCase() === 'business'
                        ? 'Business Owner'
                        : capitalizeWords(application?.sourceOfIncome)}
                    </p>
                  </div>

                  {application?.sourceOfIncome?.toLowerCase() === 'employed' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Occupation</p>
                        <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.appOccupation || '—')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Employment Status</p>
                        <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.appEmploymentStatus || '—')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Company Name</p>
                        <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.appCompanyName || '—')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                        <p className="text-base text-gray-800 mt-1">{formatCurrency(application?.appMonthlyIncome)}</p>
                      </div>
                    </>
                  )}

                  {application?.sourceOfIncome?.toLowerCase() === 'business' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Type of Business</p>
                        <p className="text-base text-gray-800 mt-1">{application?.appTypeBusiness || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Started</p>
                        <p className="text-base text-gray-800 mt-1">{application?.appDateStarted || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Location</p>
                        <p className="text-base text-gray-800 mt-1">{application?.appBusinessLoc || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                        <p className="text-base text-gray-800 mt-1">{formatCurrency(application?.appMonthlyIncome)}</p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Character References */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Character References</h2>
                </div>
                
                {application?.characterReferences && application.characterReferences.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {application.characterReferences.map((ref, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-base text-gray-800 mt-1 font-bold">Reference {i + 1}</p>
                        <p className="text-sm text-gray-500">Name: {ref.name}</p>
                        <p className="text-sm text-gray-500">Contact: {ref.contact}</p>
                        <p className="text-sm text-gray-500">Relation: {ref.relation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No character references provided.</p>
                )}
              </section>

            {/* Loan Details */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Loan Computation</h2>
              </div>

              {/* Loan Purpose */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                <p className="text-gray-800  mt-1">{application?.appLoanPurpose || '—'}</p>
              </div>

              <div className="space-y-2">

                <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Monthly Interest</p>
                <p className="text-gray-800  mt-1">{application?.appInterest || '—'}%</p>
                </div>

                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 text-sm">Loan Amount</span>
                  <span className="text-gray-800 font-semibold">{formatCurrency(application?.appLoanAmount)}</span>
                </div>

                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 text-sm">Interest Amount</span>
                  <span className="text-gray-800 font-semibold">
                    {formatCurrency((Number(application?.appLoanAmount) * Number(application?.appInterest || 0)) / 100)}
                  </span>
                </div>

                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 text-sm">Due Period (months)</span>
                  <span className="text-gray-800 font-semibold">{application?.appLoanTerms || '—'}</span>
                </div>

                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 text-sm">Total Interest</span>
                  <span className="text-gray-800 font-semibold">
                    {formatCurrency(
                      Number(application?.appLoanAmount || 0) *
                      Number(application?.appInterest || 0) *
                      Number(application?.appLoanTerms || 0) / 100
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600 text-sm">Total Payable</span>
                  <span className="text-gray-800 font-semibold">
                    {formatCurrency(
                      (Number(application?.appLoanAmount || 0)) +
                      (Number(application?.appLoanAmount || 0) *
                      Number(application?.appInterest || 0) *
                      Number(application?.appLoanTerms || 0) / 100)
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-b py-2">
              <span className="text-gray-600 text-sm">Monthly Due</span>
              <span className="text-gray-800 font-semibold">
                {formatCurrency(
                  (
                    (Number(application?.appLoanAmount || 0)) +
                    (Number(application?.appLoanAmount || 0) *
                    Number(application?.appInterest || 0) *
                    Number(application?.appLoanTerms || 0) / 100)
                  ) / (Number(application?.appLoanTerms || 1))
                )}
              </span>
            </div>


              

              </div>
            </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Loan Type */}
              {(application?.loanType === "Regular Loan With Collateral" ||
                application?.loanType === "Open-Term Loan") && (
                <section className="bg-white rounded-lg shadow-sm p-6 text-black">
                  {application?.loanType === "Regular Loan With Collateral" && (
                    <WithCollateral application={application} formatCurrency={formatCurrency} />
                  )}
                  {application?.loanType === "Open-Term Loan" && (
                    <OpenTerm application={application} formatCurrency={formatCurrency} />
                  )}
                </section>
              )}

              {/* Uploaded Documents */}
              <section className="bg-white rounded-lg shadow-sm p-6 text-black">
                <div className="flex items-center mb-4">
                  <FiPaperclip className="w-5 h-5 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Uploaded Documents</h2>
                </div>
                {application?.documents && application.documents.length > 0 ? (
                  <ul>
                    {application.documents.map((doc, i) => (
                      <li key={i} className="flex justify-between items-center py-1">
                        <span>{doc.fileName}</span>
                        <a href={`http://localhost:3001/${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                      </li>
                    ))}
                  </ul>
                ) : <p>No documents uploaded.</p>}
              </section>
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 text-black">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Schedule Interview</h2>
              <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
              <input type="date" className="w-full border rounded px-3 py-2 mb-4" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
              <label className="block mb-2 text-sm font-medium text-gray-700">Time</label>
              <input type="time" className="w-full border rounded px-3 py-2 mb-4" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleScheduleInterview} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Schedule</button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }
