"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import Link from "next/link";

// Role-based wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

// Translations
import firstLoanApplicationTranslation from "./translation/first";

const API_URL = "http://localhost:3001/loan-applications";

// Application interface
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

// MAIN COMPONENT
export default function ApplicationsPage() {
  // States
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [collectors, setCollectors] = useState<string[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

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

  // Get translations based on role
  const getTranslations = () => {
    return firstLoanApplicationTranslation[language];
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

  // Persisted active filter
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    return localStorage.getItem("activeFilter") || "Cleared";
  });

  // Modal animation states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  // Effects
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

  useEffect(() => {
    localStorage.setItem("activeFilter", activeFilter);
  }, [activeFilter]);

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

  // Helpers
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const collectableAmount = (
    principal: number,
    interestRate: number,
    termMonths: number
  ) => {
    const termYears = termMonths / 12;
    const total = principal + principal * (interestRate / 100) * termYears;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(total);
  };

  // Filters
  const filteredApplications = applications
    .map((application) => ({
      ...application,
      displayStatus:
        application.status === "Endorsed" ? "Pending" : application.status,
    }))
    .filter((application) => {
      const matchesSearch = Object.values({
        ...application,
        status: application.displayStatus,
      }).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (!matchesSearch) return false;
      if (activeFilter === "All") return true;

      return application.displayStatus === activeFilter;
    });

  const filterOptions = [
  { key: "All", label: t.tab1 },
  { key: "Applied", label: t.tab2 },
  { key: "Pending", label: t.tab3 },
  { key: "Cleared", label: t.tab4 },
  { key: "Approved", label: t.tab5 },
  { key: "Disbursed", label: t.tab6 },
  { key: "Denied", label: t.tab7 },
];

    
  let Wrapper;
  if (role === "loan officer") {
    Wrapper = LoanOfficer;
  } else if (role === "head") {
    Wrapper = Head;
  } else {
    Wrapper = Manager;
  }

  return (
    <Wrapper isNavbarBlurred={isModalVisible}>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t.h1}
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-6">
            {/* Mobile Dropdown */}
            <div className="block sm:hidden relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                appearance-none transition-all"
            >
              {filterOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
              <FiChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 w-4 h-4 pointer-events-none"
              />
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-auto">
              {filterOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === key
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                  appearance-none transition-all"
              >
                <option value="">{t.sortBy}</option>
                <option value="date">{t.sort1}</option>
                <option value="amount">{t.sort2}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[
                    t.th1,
                    t.th2,
                    t.th3,
                    t.th4,
                    t.th5,
                    t.th6,
                    t.th7,
                    t.th8,
                    t.th9,
                  ].map((heading) => (
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
                    {/* ID */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicationId}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.appName}
                      </div>
                    </td>

                    {/* Loan Type */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {translateLoanType(application.loanType)}
                      </div>
                    </td>

                    {/* Application Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(application.dateApplied)}
                    </td>

                    {/* Principal */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(application.appLoanAmount)}
                    </td>

                    {/* Interest */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {application.appInterest}%
                    </td>

                    {/* Collectable */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {application.totalPayable}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black">
                        {application.status === "Onhold"
                          ? "On Hold"
                          : application.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 space-x-2">
                      {/* View */}
                        <Link
                          href={`/commonComponents/loanApplication/${application.applicationId}`}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block"
                        >
                          {t.actionBtn}
                        </Link>

                      {/* Accept Reloan */}
                      {application.displayStatus === "Disbursed" &&
                        application.isReloan && (
                          <button
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700"
                            onClick={async () => {
                              try {
                                const response = await authFetch(
                                  `${API_URL}/${application.applicationId}`,
                                  {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "Accepted" }),
                                  }
                                );

                                if (!response.ok)
                                  throw new Error("Failed to accept reloan");
                                const updated = await response.json();

                                // Generate loan
                                const loanRes = await fetch(
                                  `http://localhost:3001/loans/generate-reloan/${application.borrowersId}`,
                                  { method: "POST" }
                                );

                                if (!loanRes.ok) {
                                  const err = await loanRes.json();
                                  throw new Error(
                                    err?.error || "Failed to generate loan"
                                  );
                                }

                                setApplications((prev) =>
                                  prev.map((app) =>
                                    app.applicationId === updated.applicationId
                                      ? updated
                                      : app
                                  )
                                );

                                alert(
                                  "Reloan accepted and loan generated successfully."
                                );
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

          </div>
        </div>
      </div>
    </Wrapper>
  );
}