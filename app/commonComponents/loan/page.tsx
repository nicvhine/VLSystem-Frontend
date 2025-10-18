'use client';

import { FiSearch, FiChevronDown, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import Head from '@/app/userPage/headPage/page';
import Manager from '@/app/userPage/managerPage/page';
import LoanOfficer from '@/app/userPage/loanOfficerPage/page';
import Pagination from '../utils/pagination';
import { useLoansPage } from './hook';
import { formatCurrency, formatDate } from '../utils/formatters';
import Filter from '../utils/sortAndSearch';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function LoansPage() {
    const {
    role,
    language,
    setLanguage,
    paginatedLoans,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalCount,
    t,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilter,
    setActiveFilter,
    loading,
  } = useLoansPage(); 

  if (loading) return <LoadingSpinner />;

  let Wrapper;
  if (role === 'loan officer') Wrapper = LoanOfficer;
  else if (role === 'head') Wrapper = Head;
  else Wrapper = Manager;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t.Loans}</h1>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-auto mb-6">
            {[t.l23, t.l24, t.l25, t.l26].map((status) => (
              <button
                key={status}
                onClick={() => { setActiveFilter(status as "All" | "Active" | "Overdue" | "Closed"); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFilter === status ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "date", label: t.l13 },
              { value: "amount", label: t.l14 },
            ]}
            t={t}
          />

          {/* Loans Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[t.l11, t.l12, t.l13, t.l4, t.l14, t.l15, t.l16].map((heading, i) => (
                    <th key={i} className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.appLoanAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(loan.balance)}</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-black">{loan.status}</span></td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      <Link href={`/commonComponents/loan/${loan.loanId}`} className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 inline-block">
                        {t.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalCount={totalCount}
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
