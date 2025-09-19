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
  const [activeFilter, setActiveFilter] = useState('All');


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
      if (sortBy === "date") return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
      if (sortBy === "amount") return b.appLoanAmount - a.appLoanAmount;
      return 0;
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "applied":
          return "text-blue-600";
        case "pending":
          return "text-yellow-600";
        case "cleared":
          return "text-green-600";
        case "approved":
          return "text-green-700";
        case "disbursed":
          return "text-indigo-600";
        case "denied":
          return "text-red-600";
        case "all":
        default:
          return "text-gray-600";
      }
    };

  //PAGINATION
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  // Slice applications for current page
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
    

  const handleAction = async (id: string, status: 'Disbursed') => {
    try {
      const response = await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updated = await response.json();
        setApplications(prev =>
          prev.map(app => app.applicationId === updated.applicationId ? updated : app)
        );
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  if (loading) return <LoadingSpinner />;


  return (
    <LoanOfficer>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Loan Applications</h1>

          {/* Filter Tabs */}
          <div className="mb-6">
            {/* Mobile */}
            <div className="block sm:hidden relative mb-2">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                {['All', 'Applied', 'Pending', 'Cleared', 'Approved', 'Disbursed', 'Denied'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm">
              {['All', 'Applied', 'Pending', 'Cleared', 'Approved', 'Disbursed', 'Denied'].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === status ? getStatusColor(status) : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort */}
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

          {/* Applications Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {['ID', 'Name', 'Loan Type', 'Application Date', 'Principal Amount', 'Interest Rate', 'Collectable Amount', 'Status', 'Action'].map(heading => (
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
                {paginatedApplications.map(app => (
                  <tr key={app.applicationId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.applicationId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.appName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.loanType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(app.dateApplied)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(app.appLoanAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.appInterest}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {app.loanType === "Open-Term Loan" ? "----" : formatCurrency(app.totalPayable)}
                    </td>
                    <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status === 'Onhold' ? 'On Hold' : app.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {(app.status === 'Pending' || app.status === 'Approved' || app.status === 'Active') && (
                        <Link
                          href={`/userPage/loanOfficerPage/applications/${app.applicationId}`}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block"
                        >
                          View
                        </Link>
                      )}
                      {app.status === 'Applied' && (
                        <Link
                          href={`/components/loanOfficer/applications/${app.applicationId}`}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 inline-block"
                        >
                          Schedule
                        </Link>
                      )}
                      {app.status === 'Ready for Disbursement' && (
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                          onClick={() => handleAction(app.applicationId, 'Disbursed')}
                        >
                          Disbursed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2 text-black">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>


        </div>
      </div>
    </LoanOfficer>
  );
}
