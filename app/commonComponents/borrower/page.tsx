'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import { useBorrowersList } from "./hooks";
import Filter from "../utils/sortAndSearch";

export default function BorrowerPage() {
  const { borrowers, loading, error, role } = useBorrowersList();
  const [overview, setOverview] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

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
            Borrowers
          </h1>

          {/* === Filter === */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "name", label: "Name" },
              { value: "status", label: "Status" },
            ]}
            t={{}}
          />

          {/* === Borrowers Table === */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            {loading ? (
              <p className="p-4 text-center">Loading borrowers...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-600">{error}</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Borrowed (₱)
                    </th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
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
                          className="hover:bg-red-50 transition-colors"
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
                              className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 inline-block whitespace-nowrap"
                            >
                              View
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
                        No borrowers found.
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
