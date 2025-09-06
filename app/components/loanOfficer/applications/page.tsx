"use client";

import { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import LoanOfficer from '../page';

const API_URL = "http://localhost:3001/loan-applications";

interface Application {
  applicationId: string;
  appName: string;
  dateApplied: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  totalPayable: number;
  borrowersId: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeFilter, setActiveFilter] = useState('Applied');

  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in localStorage");
  
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
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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

  const filteredApplications = applications
  .filter(application => {
    const matchesSearch = Object.values(application).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    return application.status === activeFilter;
  })
  .sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime(); 
    }
    if (sortBy === "amount") {
      return b.appLoanAmount - a.appLoanAmount; 
    }
    return 0; 
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

  const handleAction = async (id: string, status: 'Disbursed') => {
  try {
    const response = await authFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updated = await response.json();
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === updated.applicationId ? updated : app
        )
      );
    }
  } catch (error) {
    console.error('Failed to update application:', error);
  }
}

  return (
    <LoanOfficer>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Loan Applications</h1>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            {/* Mobile dropdown */}
            <div className="block sm:hidden relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                {['All', 'Applied', 'Pending', 'Approved', 'Denied', 'Accepted'].map((status) => (
                  <option key={status} value={status}>
                    {status === 'Onhold' ? 'On Hold' : status}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Desktop buttons */}
            <div className="hidden w-140 sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm">
              {['All', 'Applied', 'Pending', 'Approved', 'Denied', 'Active'].map((status) => (
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
                <option value="date">Application Date</option>
                <option value="amount">Amount</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{application.applicationId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{application.appName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{application.loanType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(application.dateApplied)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(application.appLoanAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{application.appInterest}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {application.loanType === "Open-Term Loan"
                        ? "----"
                        : formatCurrency(application.totalPayable)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black">
                        {application.status === 'Onhold' ? 'On Hold' : application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">

                   {/* If Pending OR Approved → Show View Application */}
                  {(application.status === 'Pending' || application.status === 'Approved' || application.status === 'Active') && (
                    <Link
                      href={`/components/loanOfficer/applications/${application.applicationId}`}
                      className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block"
                    >
                      View
                    </Link>
                  )}

                      {/* If status = Applied → Show Schedule Interview */}
            {application.status === 'Applied' && (
              <Link
                href={`/components/loanOfficer/applications/${application.applicationId}`}
                className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700 inline-block"
              >
                Schedule
              </Link>
            )}

     

  {application.status !== 'Accepted' && application.status !== 'Disbursed' && application.status === 'Ready for Disbursement' && (
    <button
      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
      onClick={() => handleAction(application.applicationId, 'Disbursed')}
    >
      Disbursed
    </button>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <LoadingSpinner />}
          </div>
        </div>
      </div>
    </LoanOfficer>
  );
}
