"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown, FiLoader } from "react-icons/fi";
import Link from "next/link";
import Manager from "../page";

const API_URL = "http://localhost:3001/loans";

interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  principal: number;
  termsInMonths: number;
  totalPayable: number;
  balance: number;
  status: string;
  dateReleased: string; 
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data)) setLoans(data);
        else if (Array.isArray(data.loans)) setLoans(data.loans);
        else setLoans([]);
      } catch (err) {
        console.error("Failed to fetch loans:", err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "overdue", label: "Overdue" },
    { id: "closed", label: "Closed" },
  ];

  // Filter loans
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = Object.values(loan).some((v) =>
      v?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (activeFilter === "Active") return loan.status.toLowerCase() === "active";
    if (activeFilter === "Overdue") return loan.status.toLowerCase() === "overdue";
    if (activeFilter === "Closed") return loan.status.toLowerCase() === "closed";
    return true;
  });

  // Sort loans
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === "date")
      return new Date(b.dateReleased).getTime() - new Date(a.dateReleased).getTime();
    if (sortBy === "amount") return b.principal - a.principal;
    return 0;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "overdue":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      case "closed":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Manager>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Loans</h1>
          </div>
          </div>

        <div className="mb-6">
         {/* Tabs for desktop */}
         <div className="hidden w-80 sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm">
            {['All', 'Active', 'Overdue', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFilter === status
                    ? `bg-${status === 'Accepted' ? 'green' : status === 'Denied' ? 'red' : status === 'Onhold' ? 'orange' : 'blue'}-50 text-${status === 'Pending' ? 'yellow' : status === 'Accepted' ? 'green' : status === 'Denied' ? 'red' : status === 'Onhold' ? 'orange' : status === 'Disbursed' ? 'yellow' : 'blue'}-600 shadow-sm`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'Onhold' ? 'On Hold' : status}
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
              <option value="amount">Balance</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

          {/* Loans Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {["ID", "Name", "Release Date", "Principal", "Balance", "Status", "Action"].map((heading) => (
                    <th
                      key={heading}
                      className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedLoans.map((loan) => (
                  <tr key={loan.loanId} className="hover:bg-blue-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Link href={`/components/head/loans/${loan.loanId}`}>{loan.loanId}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{loan.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(loan.dateReleased)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.principal)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.balance)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:underline">
                      <Link href={`/components/head/loans/${loan.loanId}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{sortedLoans.length}</span> loans
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Manager>
  );
}
