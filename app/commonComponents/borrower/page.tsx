'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import { useBorrowersList } from "./hooks";
import Filter from "../utils/sortAndSearch";
import translations from "../translation";

export default function BorrowerPage() {
  const { borrowers, loading, error, role, language } = useBorrowersList();
  const [overview, setOverview] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const t = translations.borrowerTranslation[language];
  const loanT = translations.loanTermsTranslator[language];

  const Wrapper =
    role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  // Fetch overview stats (total borrowers + top loaners)
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/borrowers/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOverview(data);
      } catch (err) {
        console.error("Error fetching overview:", err);
      }
    };
    fetchOverview();
  }, []);

  // Search + sort for borrower list
  const filteredBorrowers = borrowers
    .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : a.status.localeCompare(b.status)
    );

  const itemsPerPage = 10;
  const paginatedBorrowers = filteredBorrowers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {t.h1}
          </h1>

          {/* === Filter === */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={(val: string) => setSortBy(val as "name" | "status")}
            sortOptions={[
              { value: "name", label: t.s1 },
              { value: "status", label: t.s2 },
            ]}
            t={loanT}
          />

          {/* === Borrowers Table === */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            {loading ? (
              <p className="p-4 text-center">{t.m1}</p>
            ) : error ? (
              <p className="p-4 text-center text-red-600">{error}</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t1}
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t2}
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t3}
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t4}
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t5}
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.t6}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBorrowers.length > 0 ? (
                    paginatedBorrowers.map((b) => {
                      const topData = overview?.topBorrowers?.find(
                        (tb: any) => tb.borrowersId === b.borrowersId
                      );
                      return (
                        <tr
                          key={b.borrowersId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {b.borrowersId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {b.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {b.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {b.phoneNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            ₱
                            {topData?.totalBorrowedAmount
                              ? topData.totalBorrowedAmount.toLocaleString()
                              : "0"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Link
                              href={`/commonComponents/borrower/${b.borrowersId}`}
                              className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block whitespace-nowrap"
                            >
                              {t.m3}
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-6 text-sm"
                      >
                        {t.m2}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

/* --- Reusable StatCard --- */
const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 flex flex-col justify-center items-start hover:shadow-xl transition-all">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-extrabold text-red-600 mt-2">
      {value.toLocaleString()}
    </p>
  </div>
);
