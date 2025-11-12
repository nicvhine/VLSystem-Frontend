'use client';

import { useEffect, useState } from 'react';
import { useLoanList } from './hook';
import Filter from '@/app/commonComponents/utils/sortAndSearch';
import translations from '@/app/commonComponents/translation';
import { formatCurrency, formatDate } from '@/app/commonComponents/utils/formatters';
import { Fragment } from 'react';


export default function PaymongoClient() {
  const { payments, loading, error, role, language } = useLoanList();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  const t = translations.borrowerTranslation[language];
  const loanT = translations.loanTermsTranslator[language];

  const filteredLoans = payments
    .filter((payment) => payment.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'name' ? a.name.localeCompare(b.name) : a.status.localeCompare(b.status)
    );

  const itemsPerPage = 10;
  const paginatedBorrowers = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">PayMongo Payments</h1>

          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={(val: string) => setSortBy(val as 'name' | 'status')}
            sortOptions={[
              { value: 'name', label: t.s1 },
              { value: 'status', label: t.s2 },
            ]}
            t={loanT}
          />

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            {loading ? (
              <p className="p-4 text-center">{t.m1}</p>
            ) : error ? (
              <p className="p-4 text-center text-red-600">{error}</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    {['Date', 'ID', 'Reference Number', 'Name', 'Paid Amount'].map((heading) => (
                      <th
                        key={heading}
                        className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBorrowers.length > 0 ? (
                    paginatedBorrowers.map((l) => (
                      <Fragment key={l.loanId}>
                        <tr
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(l.datePaid)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{l.loanId}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{l.referenceNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{l.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(l.amount)}</td>
                        </tr>
                      </Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-6 text-sm">
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
    </div>
  );
}
