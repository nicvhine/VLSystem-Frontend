'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoanDetails } from '../utils/Types/loan';
import { Language } from '../utils/Types/language';
import { fetchLoans } from './function';
import translations from '../translation';

export const useLoansPage = () => {
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Overdue' | 'Closed'>('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const data = await fetchLoans(token);
    setLoans(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter loans
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = Object.values(loan).some((v) =>
      v?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!matchesSearch) return false;

    if (activeFilter === 'Active') return loan.status.toLowerCase() === 'active';
    if (activeFilter === 'Overdue') return loan.status.toLowerCase() === 'overdue';
    if (activeFilter === 'Closed') return loan.status.toLowerCase() === 'closed';
    return true;
  });

  // Sort loans
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.dateDisbursed).getTime() - new Date(a.dateDisbursed).getTime();
    if (sortBy === 'amount') return b.balance - a.balance;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedLoans.length / pageSize));
  const paginatedLoans = sortedLoans.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalCount = sortedLoans.length;
  const showingStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * pageSize);

  const t = translations.loanTermsTranslator[language];

  return {
    role,
    language,
    setLanguage,
    loans,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilter,
    setActiveFilter,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    showingStart,
    showingEnd,
    paginatedLoans,
    sortedLoans,
    t,
  };
};
