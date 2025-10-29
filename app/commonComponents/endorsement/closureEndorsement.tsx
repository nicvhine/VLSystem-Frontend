"use client";

import React, { useState, useEffect } from "react";

type Props = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setTotalCount: (n: number) => void;
  searchQuery?: string;
  sortBy?: string;
};

export default function ClosureEndorsementTab({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  setTotalCount,
}: Props) {
  const [closures, setClosures] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/closure-endorsement');
      const data = await res.json();
      setClosures(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTotalCount(closures.length);
    const totalPages = Math.max(1, Math.ceil(closures.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(1);
  }, [closures, pageSize]);

  const totalCount = closures.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (currentPage - 1) * pageSize;
  const paginated = closures.slice(start, start + pageSize);

  return (
    <div>
      {/* render table without an enclosing visual card container */}
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Reference</th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Borrower</th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Loan Status</th>
            <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginated.map(cl => (
            <tr key={cl._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{cl.referenceNumber}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{cl.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{cl.status}</td>
              <td className="px-6 py-4 text-sm">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md">Endorse Closure</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination is rendered at page level to match Applications layout */}
    </div>
  );
}
