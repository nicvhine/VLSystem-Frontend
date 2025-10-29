"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatters";

type Props = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setTotalCount: (n: number) => void;
  searchQuery?: string;
  sortBy?: string;
};

export default function PenaltyEndorsementTab({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  setTotalCount,
}: Props) {
  const [endorsements, setEndorsements] = useState<any[]>([]);

  const fetchEndorsements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch('http://localhost:3001/penalty', {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch penalty endorsements');
      const data = await res.json();
      setEndorsements(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchEndorsements();
  }, []);

  // inform parent about total count whenever endorsements change
  useEffect(() => {
    setTotalCount(endorsements.length);
    // reset page if current page now out of range
    const totalPages = Math.max(1, Math.ceil(endorsements.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(1);
  }, [endorsements, pageSize]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:3001/penalty/${id}/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks: "Approved" })
      });

      if (!res.ok) throw new Error("Failed to approve endorsement");
      alert("Endorsement approved successfully!");
      fetchEndorsements(); // refresh table
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:3001/penalty/reject/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks: "Rejected" })
      });

      if (!res.ok) throw new Error("Failed to reject endorsement");
      alert("Endorsement rejected successfully!");
      fetchEndorsements(); // refresh table
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const totalCount = endorsements.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (currentPage - 1) * pageSize;
  const paginated = endorsements.slice(start, start + pageSize);

  return (
    <div>
      {/* remove visual container wrapper — allow page to control outer layout */}
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Reference</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Borrower</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Endorser</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Reason</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Penalty</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payable</th>
              <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginated.map(col => (
              <tr key={col._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{col.referenceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{col.borrowerName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{col.borrowerName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{col.reason}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.penaltyAmount)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.periodAmount)}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {col.status === "Pending" ? (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded-md"
                          onClick={() => handleApprove(col._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-md"
                          onClick={() => handleReject(col._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">{col.status}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {/* Pagination is rendered at page level to match Applications layout */}
    </div>
  );
}
