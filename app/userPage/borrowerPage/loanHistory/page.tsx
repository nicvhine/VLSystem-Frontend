'use client';

import React, { useEffect, useState } from 'react';
import { Loan } from '@/app/commonComponents/utils/Types/loan';
import { LoadingSpinner } from '@/app/commonComponents/utils/loading';
import { formatDate, formatCurrency } from '@/app/commonComponents/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/app/commonComponents/utils/pagination';
import Borrower from '../page';
import translations from '@/app/commonComponents/translation';
import BorrowerClient from '../borrowerClient';

const LOAN_URL = process.env.NEXT_PUBLIC_LOAN_URL;
const COLLECTION_URL = process.env.NEXT_PUBLIC_COLLECTION_URL;

export default function LoanHistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [loanDetailsMap, setLoanDetailsMap] = useState<Record<string, any>>({});
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [lastDetailsAttemptId, setLastDetailsAttemptId] = useState<string | null>(null);
  const [currentLoansPage, setCurrentLoansPage] = useState<number>(1);
  const [loansPageSize, setLoansPageSize] = useState<number>(10);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  const borrowersId =
    typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;

  const t = translations.borrowerPageTranslation[language];

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'en' | 'ceb';
    if (storedLanguage) setLanguage(storedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail?.language) {
        setLanguage(event.detail.language as 'en' | 'ceb');
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    if (!borrowersId) return;

    const fetchLoans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${LOAN_URL}/all/${borrowersId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch loans');
        const data: Loan[] = await res.json();
        setLoans(
          data.sort(
            (a, b) =>
              new Date(b.dateDisbursed ?? 0).getTime() -
              new Date(a.dateDisbursed ?? 0).getTime()
          )
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [borrowersId]);

  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.appLoanAmount ?? 0),
    0
  );

  // helper to fetch loan details (used by onClick and retry)
  const fetchLoanDetails = async (loanId: string) => {
    if (!loanId) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setError(t.t20);
      return;
    }

    setLoadingDetailsId(loanId);
    setError('');

    try {
      const res = await fetch(`${LOAN_URL}/details/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        let body = '';
        try { body = await res.text(); } catch (e) { body = '<no body>'; }
        console.error('Failed to fetch loan details', res.status, body);
        const msg = `Failed to load loan details (${res.status}). ${body}`;
        setError(msg);
        setLoadingDetailsId(null);
        return;
      }

      const data = await res.json();
      // try to fetch a structured payment schedule for this borrower+loan
      try {
        const borrowersIdLocal = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;
        if (borrowersIdLocal) {
          const schedRes = await fetch(`${COLLECTION_URL}/schedule/${borrowersIdLocal}/${loanId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (schedRes.ok) {
            const schedule = await schedRes.json();
            // if schedule is an array, attach as collections; otherwise if response is an object assume array
            data.collections = Array.isArray(schedule) ? schedule : schedule;
          } else {
            // log and continue; we'll fall back to any collections returned in /loans/details
            let body = '';
            try { body = await schedRes.text(); } catch (e) { body = '<no body>'; }
            console.warn('Could not fetch schedule', schedRes.status, body);
          }
        }
      } catch (err) {
        console.warn('Error fetching payment schedule:', err);
      }

      setLoanDetailsMap((p) => ({ ...p, [loanId]: data }));
      setExpandedLoanId(loanId);
    } catch (err) {
      console.error('Error fetching loan details:', err);
      setError(t.t21);
    } finally {
      setLoadingDetailsId(null);
    }
  };

  return (
    <BorrowerClient>
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">{t.t1}</h1>
          </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{t.t2}</p>
            <p className="mt-2 text-2xl font-bold text-gray-800">{loans.length}</p>
          </div>

          <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{t.t3}</p>
              <p className="mt-2 text-2xl font-bold text-green-700">{formatCurrency(totalLoanAmount)}</p>
            </div>
          </div>
        </div>

        {/* Loan List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-start gap-4">
            <p className="text-red-600">{error}</p>
            {lastDetailsAttemptId && (
              <button
                onClick={() => fetchLoanDetails(lastDetailsAttemptId)}
                className="ml-2 inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                {t.t17}
              </button>
            )}
          </div>
        ) : loans.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600">{t.t4}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              const totalLoanPages = Math.max(1, Math.ceil(loans.length / loansPageSize));
              const paginatedLoans = loans.slice((currentLoansPage - 1) * loansPageSize, currentLoansPage * loansPageSize);
              return (
                <>
                  {paginatedLoans.map((loan) => {
              const isExpanded = expandedLoanId === loan.loanId;
              return (
                <div key={loan.loanId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div
                    className={`p-5 flex items-start justify-between cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
                    onClick={async () => {
                      // toggle: if already expanded -> collapse
                      if (isExpanded) {
                        setExpandedLoanId(null);
                        return;
                      }

                      // if details already loaded, just expand
                      if (loanDetailsMap[loan.loanId]) {
                        setExpandedLoanId(loan.loanId);
                        return;
                      }

                      // fetch full loan details via helper so retry can reuse
                      setLastDetailsAttemptId(loan.loanId);
                      await fetchLoanDetails(loan.loanId);
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">{loan.loanId}</p>
                      <p className="text-xs text-gray-500 mt-1">{loan.dateDisbursed ? formatDate(loan.dateDisbursed) : '-'}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        loan.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'Inactive'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-50 text-blue-700'
                      } border`}>{loan.status === 'Active' ? t.t36 : loan.status === 'Inactive' ? t.t37 : loan.status}</span>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatCurrency(loan.appLoanAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key={`${loan.loanId}-details`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="border-t border-gray-100 bg-gray-50 overflow-hidden"
                      >
                        <div className="p-5 text-sm text-gray-700">
                          {loadingDetailsId === loan.loanId ? (
                            <div className="flex items-center justify-center py-4">
                              <LoadingSpinner />
                            </div>
                          ) : (
                            (() => {
                              const det = loanDetailsMap[loan.loanId] || {};
                              const collections = det.collections || [];
                              const borrower = det.borrowerDetails || {};
                              return (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">{t.t5}</p>
                                      <p className="font-medium text-gray-800">{det.loanType || loan.loanType || '-'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">{t.t6}</p>
                                      <p className="font-medium text-gray-800">{formatCurrency(det.appTotalPayable ?? loan.appTotalPayable ?? 0)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">{t.t7}</p>
                                      <p className="font-medium text-gray-800">{det.appInterestRate ?? loan.appInterestRate ?? 0}% • {det.appLoanTerms ?? (loan as any).appLoanTerms ?? '-' } months</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">{t.t8}</p>
                                      <p className="font-medium text-gray-800">{det.name || (loan as any).name || '-'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mt-1">{t.t10}: {formatCurrency(det.paidAmount ?? (loan as any).paidAmount ?? 0)}</p>
                                      <p className="text-xs text-gray-500">{t.t11}: {formatCurrency(det.balance ?? (loan as any).balance ?? (det.appTotalPayable ?? (loan as any).appTotalPayable ?? 0))}</p>
                                    </div>
                                  </div>

                                  {/* Collections table */}
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">{t.t9}</p>
                                    {collections.length === 0 ? (
                                      <p className="text-gray-500">{t.t12}</p>
                                    ) : (
                                      <>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                          <thead className="bg-white text-gray-700">
                                            <tr>
                                              <th className="p-2 text-left">#</th>
                                              <th className="p-2 text-left">{t.t13}</th>
                                              <th className="p-2 text-left">{t.t14}</th>
                                              <th className="p-2 text-left">{t.t15}</th>
                                              <th className="p-2 text-left">{t.t16}</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {collections.map((c: any) => (
                                              <tr key={c._id} className="border-t border-gray-100">
                                                <td className="p-2">{c.collectionNumber}</td>
                                                <td className="p-2">{c.dueDate ? new Date(c.dueDate).toLocaleDateString() : '-'}</td>
                                                <td className="p-2">{formatCurrency(c.amount ?? c.principal ?? 0)}</td>
                                                <td className="p-2">{c.status || '-'}</td>
                                                <td className="p-2">{c.datePaid ? new Date(c.datePaid).toLocaleDateString() : '-'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
                  })}

                  {/* Top-level pagination for loans */}
                  <div className="mt-4">
                    <Pagination
                      totalCount={loans.length}
                      currentPage={currentLoansPage}
                      totalPages={Math.max(1, Math.ceil(loans.length / loansPageSize))}
                      pageSize={loansPageSize}
                      setCurrentPage={(p: number) => { setCurrentLoansPage(p); setExpandedLoanId(null); }}
                      setPageSize={(size: number) => { setLoansPageSize(size); setCurrentLoansPage(1); setExpandedLoanId(null); }}
                      language={language}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}
        </div>
      </div>
    </BorrowerClient>
  );
}
