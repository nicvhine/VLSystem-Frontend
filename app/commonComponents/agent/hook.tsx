'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAgents as fetchAgentsFn, handleAddAgent as handleAddAgentFn } from './function';
import { Agent } from '../utils/Types/agent';
import translations from '../translation';

export const useAgentPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ceb">("en");

  // Fetch agent data
  const fetchAgents = useCallback(async () => {
    await fetchAgentsFn(role, setAgents, setLoading, setError);
  }, [role]);

  useEffect(() => {
    if (role) fetchAgents();
  }, [fetchAgents, role]);

  // Search + Sort
  const filteredAgents = agents.filter((agent) => {
    const q = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.phoneNumber.includes(q) ||
      agent.agentId.toLowerCase().includes(q)
    );
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'handled') return b.handledLoans - a.handledLoans;
    if (sortBy === 'amount') return b.totalLoanAmount - a.totalLoanAmount;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedAgents.length / pageSize));
  const paginatedAgents = sortedAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalCount = sortedAgents.length;

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const keyMap: Record<string, string> = {
      head: "headLanguage",
      "loan officer": "loanOfficerLanguage",
      manager: "managerLanguage",
    };

    const langKey = keyMap[storedRole || ""] as keyof typeof keyMap;
    const storedLanguage = localStorage.getItem(langKey) as "en" | "ceb";
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (
        (role === "head" && event.detail.userType === "head") ||
        (role === "loan officer" && event.detail.userType === "loanOfficer") ||
        (role === "manager" && event.detail.userType === "manager")
      ) {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, [role]);

  // Translation
  const t = translations.loanTermsTranslator[language];

  return {
    role,
    agents,
    paginatedAgents,
    sortedAgents,
    totalCount,
    totalPages,
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
    showModal,
    setShowModal,
    newAgentName,
    setNewAgentName,
    newAgentPhone,
    setNewAgentPhone,
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
    t,
    language,
    setLanguage,
  };
};
