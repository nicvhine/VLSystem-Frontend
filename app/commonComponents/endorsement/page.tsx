"use client";

import React, { useState } from "react";
import PenaltyEndorsementTab from "./penaltyEndorsement";
import ClosureEndorsementTab from "./closureEndorsement";
import Manager from "@/app/userPage/managerPage/page";
import Filter from "../utils/sortAndSearch";
import Pagination from "../utils/pagination";

export default function EndorsementPage() {
  const [activeTab, setActiveTab] = useState<'penalty' | 'closure'>('penalty');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  return (
    <Manager>
      {/* page wrapper */}
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Endorsements</h1>
        </div>

        {/* Tabs area - copy Applications page style: desktop buttons inside a white rounded card */}
        <div className="mb-6">
          {/* Mobile select */}
          <div className="block sm:hidden relative mb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'penalty' | 'closure')}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 appearance-none"
            >
              <option value="penalty">Penalty Endorsement</option>
              <option value="closure">Closure Endorsement</option>
            </select>
          </div>

          {/* Desktop buttons wrapped in white card */}
          <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-auto">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'penalty' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('penalty')}
            >
              Penalty Endorsement
            </button>

            <button
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'closure' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('closure')}
            >
              Closure Endorsement
            </button>
          </div>
        </div>

        {/* Search + Sort - reuse the shared Filter used by Applications for identical appearance */}
        <Filter
          searchQuery={searchQuery}
          setSearchQuery={(v) => { setSearchQuery(v); setCurrentPage(1); }}
          sortBy={sortBy}
          setSortBy={(v) => { setSortBy(v); setCurrentPage(1); }}
          sortOptions={[{ value: 'date', label: 'Date' }, { value: 'amount', label: 'Amount' }]}
          t={{ l22: 'Search here...', l38: 'Sort by' }}
          isMobile={false}
        />

        {/* Content area - white rounded table card to match Applications */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <div className="p-0">
            {activeTab === 'penalty' ? (
              <PenaltyEndorsementTab
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setTotalCount={setTotalCount}
                searchQuery={searchQuery}
                sortBy={sortBy}
              />
            ) : (
              <ClosureEndorsementTab
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setTotalCount={setTotalCount}
                searchQuery={searchQuery}
                sortBy={sortBy}
              />
            )}
          </div>
        </div>

        {/* Pagination placed outside the white table card to match Applications layout */}
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(totalCount / pageSize))}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          language={'en'}
        />
      </div>
    </Manager>
  );
}
