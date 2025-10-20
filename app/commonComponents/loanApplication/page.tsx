"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { Application } from "../utils/Types/application";
import translations from "../translation";
import { authFetch, filterApplications } from "./function";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useLoanApplicationPage } from "./hooks";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";
import Pagination from "../utils/pagination";
import useIsMobile from "../utils/useIsMobile";
import Filter from "../utils/sortAndSearch";

const API_URL = "http://localhost:3001/loan-applications";

export default function ApplicationsPage() {
  const { role, language, activeFilter, setActiveFilter } = useLoanApplicationPage();
  const t = translations.loanTermsTranslator[language];

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const filteredApplications = filterApplications(applications, searchQuery, activeFilter);
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filterOptions = [
    { key: "All", label: t.l23 },
    { key: "Applied", label: t.l27 },
    { key: "Pending", label: t.l28 },
    { key: "Cleared", label: t.l29 },
    { key: "Approved", label: t.l30 },
    { key: "Disbursed", label: t.l31 },
    { key: "Denied", label: t.l32 },
  ];

  const isMobile = useIsMobile();
  const Wrapper = role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;


  return (
    <Wrapper isNavbarBlurred={isModalVisible}>
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} message={modalMsg} onClose={() => setShowSuccessModal(false)} />
      )}
      {showErrorModal && (
        <ErrorModal isOpen={showErrorModal} message={modalMsg} onClose={() => setShowErrorModal(false)} />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t.Application}
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-6">
            {/* Mobile Dropdown */}
            <div className="block sm:hidden relative">
            <select
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
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
                  onClick={() => { setActiveFilter(key); setCurrentPage(1); }}
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
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={(value) => {
              setSearchQuery(value);
              setCurrentPage(1); 
            }}
            sortBy={sortBy}
            setSortBy={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            sortOptions={[
              { value: "date", label: t.l17 }, 
              { value: "amount", label: t.l4 },  
            ]}
            t={t}
            isMobile={isMobile}
          />

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[
                    t.l11,
                    t.l12,
                    t.l10,
                    t.l17,
                    t.l4,
                    t.l5,
                    t.l7,
                    t.l15,
                    t.l16,
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
                {paginatedApplications.map((application) => (
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
                        {application.loanType}
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
                      {application.appInterestRate}%
                    </td>

                    {/* Collectable */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatCurrency(application.appTotalPayable)}
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
                          {t.view}
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

                                setModalMsg("Reloan accepted and loan generated successfully.");
                                setShowSuccessModal(true);
                              } catch (error) {
                                console.error(error);
                                setModalMsg("Failed to accept and generate reloan");
                                setShowErrorModal(true);
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
          
          <Pagination
            totalCount={filteredApplications.length}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            language={language}
          />

        </div>
      </div>
    </Wrapper>
  );
}