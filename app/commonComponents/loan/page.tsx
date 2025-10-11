"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown, FiLoader } from "react-icons/fi";
import Link from "next/link";

// Role-based page wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

// Translation modules for different roles
import headTranslations from "@/app/userPage/headPage/components/translation";
import loanOfficerTranslations from "@/app/userPage/loanOfficerPage/components/translation";
import managerTranslations from "@/app/userPage/managerPage/components/translation";

// API endpoint for loans data
const API_URL = "http://localhost:3001/loans";

// Interface for loan data structure
interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  principal: number;
  termsInMonths: number;
  totalPayable: number;
  balance: number;
  status: string;
  dateDisbursed: string;
}

/**
 * Loading spinner component displayed while fetching loans data
 * @returns JSX element containing the loading spinner
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

/**
 * Loans listing page with filters, search, sort, and pagination functionality
 * Displays loans data in a table format with role-based access control
 * @returns JSX element containing the loans listing interface
 */
export default function LoansPage() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Data state
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  
  // Language state for bilingual support
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  // Listen for language changes based on active role
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

  /**
   * Get translations based on current user role
   * @returns Translation object for the current role and language
   */
  const getTranslations = () => {
    if (role === "head") {
      return headTranslations[language];
    } else if (role === "loan officer") {
      return loanOfficerTranslations[language];
    } else if (role === "manager") {
      return managerTranslations[language];
    }
    return headTranslations[language]; // default to head translations
  };

  const t = getTranslations();

  // Initialize role and language from localStorage
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


  // Pagination state
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch loans list from backend
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

  // Filter loans
  // Apply search and status filter
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
  // Sort by date or balance
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sortBy === "date") return new Date(b.dateDisbursed).getTime() - new Date(a.dateDisbursed).getTime();
    if (sortBy === "amount") return b.balance - a.balance;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedLoans.length / ITEMS_PER_PAGE);
  // Compute current page slice
  const paginatedLoans = sortedLoans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format amounts in PHP currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);

  // Human-readable PH date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

  if (loading) return <LoadingSpinner />;

  // Choose wrapper based on user role
  let Wrapper;
  if (role === "loan officer") {
    Wrapper = LoanOfficer;
  } else if (role === "head") {
    Wrapper = Head;
  } else {
    Wrapper = Manager;
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.loans}</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-auto">
            {["All", "Active", "Overdue", "Closed"].map((status) => {
              let label = status;
              if (status === "All") label = t.all || "All";
              else if (status === "Active") label = t.active || "Active";
              else if (status === "Overdue") label = t.overdue || "Overdue";
              else if (status === "Closed") label = t.closed || "Closed";
              return (
                <button
                  key={status}
                  onClick={() => { setActiveFilter(status); setCurrentPage(1); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === status
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative w-full sm:w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                <option value="">{t.sortBy}</option>
                <option value="date">{t.disburseDate}</option>
                <option value="amount">{t.balance}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Loans Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[t.id, t.name, t.disburseDate, t.principal, t.balance, t.status, t.actions].map((heading) => (
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
                {paginatedLoans.map((loan) => (
                  <tr key={loan.loanId} className="hover:bg-blue-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{loan.loanId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{loan.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(loan.dateDisbursed)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.principal)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.balance)}</td>
                    <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black">
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                    <Link
                          href={`/commonComponents/loan/${loan.loanId}`}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block"
                        >
{t.view}
                        </Link>
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
{t.previous}
            </button>
            <span className="px-3 py-1 text-gray-700">
{t.page} <span className="font-medium">{currentPage}</span> {t.of} <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
            >
{t.next}
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}