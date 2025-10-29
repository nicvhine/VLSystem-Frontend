"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatters";
import ViewEndorsementModal from "../modals/viewEndorsement";
import ErrorModal from "../modals/errorModal";

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
  const [selectedEndorsement, setSelectedEndorsement] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const fetchEndorsements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3001/penalty", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch penalty endorsements");
      const data = await res.json();
      setEndorsements(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Something went wrong while fetching endorsements.");
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchEndorsements();
  }, []);

  // update parent with total count
  useEffect(() => {
    setTotalCount(endorsements.length);
    const totalPages = Math.max(1, Math.ceil(endorsements.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(1);
  }, [endorsements, pageSize]);

  const totalCount = endorsements.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (currentPage - 1) * pageSize;
  const paginated = endorsements.slice(start, start + pageSize);

  const handleView = (endorsement: any) => {
    setSelectedEndorsement(endorsement);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEndorsement(null);
    fetchEndorsements(); 
  };

  return (
    <div className="relative">
      {/* Toast modals */}
      <ErrorModal isOpen={showError} message={errorMsg} onClose={() => setShowError(false)} />
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Reference
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Borrower
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Endorser
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Reason
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Penalty
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Payable
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {paginated.map((col) => (
            <tr key={col._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {col.referenceNumber}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{col.borrowerName}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{col.endorsedBy}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{col.reason}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatCurrency(col.penaltyAmount)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatCurrency(col.finalAmount)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs`}
                >
                  {col.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <button
                  onClick={() => handleView(col)}
                  className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      <ViewEndorsementModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        endorsement={selectedEndorsement}
      />
    </div>
  );
}
