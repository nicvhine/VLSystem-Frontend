'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAgents as fetchAgentsFn, handleAddAgent as handleAddAgentFn } from './function';
import translations from '../translation';
import { Agent } from '../utils/Types/agent';
import { Language } from '../utils/Types/language';

export const useAgentPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState<Language>('en');


  // Fetch agents
  const fetchAgents = useCallback(async () => {
    await fetchAgentsFn(role, setAgents, setLoading, setError);
  }, [role]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Filter and sort agents
  const filteredAgents = agents.filter((agent) => {
    const q = searchQuery.toLowerCase();
    return agent.name.toLowerCase().includes(q) || agent.phoneNumber.includes(q) || agent.agentId.toLowerCase().includes(q);
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'handled') return b.handledLoans - a.handledLoans;
    if (sortBy === 'amount') return b.totalLoanAmount - a.totalLoanAmount;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedAgents.length / pageSize));
  const paginatedAgents = sortedAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalCount = sortedAgents.length;

  const t = translations.loanTermsTranslator[language];

  return {
    role,
    paginatedAgents,
    sortedAgents,
    filteredAgents,
    totalPages,
    totalCount,
    loading,
    error,
    successMessage,
    setSuccessMessage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    showModal,
    setShowModal,
    newAgentName,
    setNewAgentName,
    newAgentPhone,
    setNewAgentPhone,
    fetchAgents,
    t, 
    handleAddAgent: () =>
      handleAddAgentFn({
        newAgentName,
        newAgentPhone,
        agents,
        setAgents,
        setShowModal,
        setSuccessMessage,
        setLoading,
        setError,
        fetchAgents,
      }),
  };
};
