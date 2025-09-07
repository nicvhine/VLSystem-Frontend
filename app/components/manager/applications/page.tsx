"use client";

import { useState, useEffect} from 'react';
import { FiSearch, FiChevronDown, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import emailjs from 'emailjs-com';
import ManagerNavbar from '../managerNavbar/page';
import Manager from '../page';

const API_URL = "http://localhost:3001/loan-applications";

interface Application {
  applicationId: string;
  appName: string;
  appEmail: string;
  dateApplied: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string; 
  status: string;
  appLoanTerms: number;
  totalPayable: number;
  isReloan?: boolean;
  borrowersId: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

const sendEmail = async ({
  to_name,
  email,
  borrower_username,
  borrower_password,
}: {
  to_name: string;
  email: string;
  borrower_username: string;
  borrower_password: string;
}) => {
  try {
    const result = await emailjs.send(
      "service_eph6uoe",
      "template_tjkad0u",
      {
        to_name,
        email,
        borrower_username,
        borrower_password,
      },
      "-PgL14MSf1VScXI94"
    );
    console.log("Email sent:", result?.text || result);
  } catch (error: any) {
    console.error("EmailJS error:", error);
    alert("Email failed: " + (error?.text || error.message || "Unknown error"));
  }
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeFilter, setActiveFilter] = useState('Pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [collectors, setCollectors] = useState<string[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [tempPassword, setTempPassword] = useState('');

  const generateUsername = (fullName: string) => {
    const parts = fullName.trim().toLowerCase().split(' ');
    if (parts.length < 2) return ''; 
    return parts[0].slice(0, 3) + parts[parts.length - 1];
  };

  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found in localStorage");
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
  

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await authFetch(API_URL);
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
  const fetchCollectors = async () => {
    try {
      const res = await authFetch("http://localhost:3001/users/collectors");
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected array but got: " + JSON.stringify(data));
      }

      setCollectors(data);
    } catch (error) {
      console.error("Error fetching collectors:", error);
    }
  };

  fetchCollectors();
}, []);

const handleCreateAccount = async () => {
  if (!selectedApp) return;
  if (!selectedCollector) {
    alert("Please select a collector.");
    return;
  }

  try {
    // 1. Create borrower account
    const borrowerRes = await authFetch("http://localhost:3001/borrowers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: generatedUsername,
        name: selectedApp.appName,
        role: "borrower",
        applicationId: selectedApp.applicationId,
        assignedCollector: selectedCollector,
      }),
    });
    const borrowerData = await borrowerRes.json();
    if (!borrowerRes.ok) throw new Error(borrowerData?.error);

    // 2. Update application status to Active BEFORE generating loan
    const updateRes = await authFetch(`${API_URL}/${selectedApp.applicationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Active" }), // update status first
    });
    const updatedApp = await updateRes.json();

    // 3. Generate loan (backend now sees status "Active")
    const loanResponse = await fetch(`http://localhost:3001/loans/generate-loan/${selectedApp.applicationId}`, {
      method: "POST",
    });
    const loanData = await loanResponse.json();
    if (!loanResponse.ok) throw new Error(loanData?.error);

    // 4. Send email
    await sendEmail({
      to_name: selectedApp.appName,
      email: selectedApp.appEmail,
      borrower_username: generatedUsername,
      borrower_password: borrowerData.tempPassword,
    });

    // 5. Update frontend applications list
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === updatedApp.applicationId ? updatedApp : app
      )
    );

    setShowModal(false);
    setSelectedApp(null);
    setSelectedCollector('');
    alert("Account created and loan generated successfully.");
  } catch (error: any) {
    console.error(error);
    alert(`Error: ${error.message}`);
  }
};




  const filteredApplications = applications
  .filter((application) => !['Pending', 'Denied by LO'].includes(application.status))
  .map((application) => ({
    ...application,
    displayStatus: application.status === 'Endorsed' ? 'Pending' : application.status,
  }))
  .filter((application) => {
    const matchesSearch = Object.values({
      ...application,
      status: application.displayStatus,
    }).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;

    return application.displayStatus === activeFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const collectableAmount = (principal: number, interestRate: number, termMonths: number) => {
  const termYears = termMonths / 12;
  const total = principal + (principal * (interestRate / 100) * termYears);
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(total);
};


  return (
    <Manager blurNavbar={showModal && !!selectedApp}>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
            <h1 className="text-2xl font-semibold text-gray-800">Loan Applications</h1>
          </div>
        </div>

        {/* Filter - Responsive */}
          <div className="mb-6">
        {/* Dropdown for mobile */}
        <div className="block sm:hidden relative">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
          >
            {['All', 'Cleared', 'Disbursed'].map((status) => (
              <option key={status} value={status}>
                {status === 'Onhold' ? 'On Hold' : status}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Desktop buttons */}
            <div className="hidden w-110 sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm">
              {['All', 'Cleared', 'Approved', 'Disbursed', 'Denied'].map((status) => (
               <button
               key={status}
               onClick={() => setActiveFilter(status)}
               className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                 activeFilter === status
                   ? "bg-blue-50 text-blue-600 shadow-sm"
                   : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               {status === "Onhold" ? "On Hold" : status}
             </button>
             
              ))}
            </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, ID or amount..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-[200px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
            >
              <option value="">Sort by</option>
              <option value="date">Release Date</option>
              <option value="amount">Amount</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr>
                {['ID', 'Name', 'Loan Type', 'Application Date', 'Principal Amount', 'Interest Rate', 'Collectable Amount', 'Status', 'Action'].map((heading) => (
                  <th
                    key={heading}
                    className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredApplications.map((application) => (
                <tr 
                  key={application.applicationId}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{application.applicationId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{application.appName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{application.loanType}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(application.dateApplied)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(application.appLoanAmount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{application.appInterest}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{application.totalPayable}</td>
                  <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black">
                        {application.status === 'Onhold' ? 'On Hold' : application.status}
                      </span>
                    </td>


                  <td className="px-6 py-4 space-x-2">

                      {/* If Pending → Show View Application */}
                      {application.status === 'Cleared' || application.status === 'Denied' && (
                          <Link
                            href={`/components/manager/applications/${application.applicationId}`}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block"
                          >
                            View 
                          </Link>
                        )}

                  {application.displayStatus === 'Pending' && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700"
                      onClick={async () => {
                        try {
                          const response = await authFetch(`${API_URL}/${application.applicationId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'Approved' }),
                          });

                          if (!response.ok) throw new Error("Failed to endorse application");

                          const updated = await response.json();
                          setApplications((prev) =>
                            prev.map((app) =>
                              app.applicationId === updated.applicationId ? updated : app
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          alert("Failed to endorse for disbursement.");
                        }
                      }}
                    >
                      Approve
                    </button>
                  )}

                  {application.displayStatus === 'Disbursed' && !application.isReloan && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                      onClick={() => {
                        setSelectedApp(application);
                        setGeneratedUsername(generateUsername(application.appName));
                        setShowModal(true);
                      }}
                    >
                      Create Account
                    </button>
                  )}


              {application.displayStatus === 'Disbursed' && application.isReloan && (
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700"
                  onClick={async () => {
  try {
    const response = await authFetch(`${API_URL}/${application.applicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Accepted' }),
    });

    if (!response.ok) throw new Error("Failed to accept reloan");
    const updated = await response.json();

    // Generate loan
    const loanRes = await fetch(
      `http://localhost:3001/loans/generate-reloan/${application.borrowersId}`,
      { method: 'POST' }
    );

    if (!loanRes.ok) {
      const err = await loanRes.json();
      throw new Error(err?.error || "Failed to generate loan");
    }

    
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === updated.applicationId ? updated : app
      )
    );

    alert("Reloan accepted and loan generated successfully.");
  } catch (error) {
    console.error(error);
    alert("Failed to accept and generate reloan");
  }
}}
                >
                  Accept Reloan
                </button>
              )}


                </td>


                </tr>
              ))}
            </tbody>
          </table>

                  {/* Modal */}
                  <ModalWithAnimation isOpen={showModal && !!selectedApp} onClose={() => setShowModal(false)}>
                    {selectedApp && <>
                      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
                      <p className="mb-2"><strong>Name:</strong> {selectedApp.appName}</p>
                      <p className="mb-4">
                        <strong>Generated Username:</strong>{" "}
                        <span className="text-blue-600">{generatedUsername}</span>
                      </p>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign Collector:</label>
                      <select
                        value={selectedCollector}
                        onChange={(e) => setSelectedCollector(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a collector</option>
                        {collectors.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={handleCreateAccount}
                        >
                          Create Account
                        </button>
                      </div>
                    </>}
                  </ModalWithAnimation>
        </div>
      </div>
    </div>
  </Manager>
  );


interface ModalWithAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalWithAnimation({ isOpen, onClose, children }: ModalWithAnimationProps) {
  const [show, setShow] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 10);
    } else if (show) {
      setAnimateIn(false);
      // Wait for animation to finish before unmounting
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          onClick={() => {
            setAnimateIn(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
}