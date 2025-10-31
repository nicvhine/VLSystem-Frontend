'use client';

import { useState } from "react";
import Link from "next/link";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import { useBorrowersList } from "./hooks";
import Filter from "../utils/sortAndSearch";

export default function BorrowerPage() {
  const { borrowers, loading, error, role } = useBorrowersList();
  const [activeFilter, setActiveFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const Wrapper =
    role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  // Filter borrowers based on activeFilter
  const filteredBorrowers = borrowers.filter(b => {
    if (activeFilter === "All") return true;
    return b.status === activeFilter;
  });

  // Search filter
  const searchedBorrowers = filteredBorrowers.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting
  const sortedBorrowers = [...searchedBorrowers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Pagination
  const itemsPerPage = 10;
  const paginatedBorrowers = sortedBorrowers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterTabs = [
    { key: "All", label: "All" },
    { key: "Active", label: "Active" },
    { key: "Inactive", label: "Inactive" },
  ];

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Borrowers</h1>
          {/* Search & Sort */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "name", label: "Name" },
              { value: "status", label: "Status" },
            ]}
            t={{}} // placeholder
          />

          {/* Borrowers Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            {loading ? (
              <p className="p-4 text-center">Loading borrowers...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-600">{error}</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBorrowers.length > 0 ? (
                    paginatedBorrowers.map(borrower => (
                      <tr key={borrower.borrowersId} className="hover:bg-blue-50/60 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{borrower.borrowersId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{borrower.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{borrower.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{borrower.phoneNumber}</td>
                        <td className="px-6 py-4 text-sm text-blue-600">
                            <Link
                            href={`/commonComponents/borrower/${borrower.borrowersId}`}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block whitespace-nowrap"
                            >
                            View
                            </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-6 text-sm">
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
