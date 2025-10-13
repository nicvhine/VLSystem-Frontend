'use client';

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

// Role-based page wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

import AddAgentModal from "@/app/commonComponents/modals/addAgent/modal";
import firstAgentTranslation from "./translations/first";

interface Agent {
  agentId: string;
  name: string;
  phoneNumber: string;
  handledLoans: number;
  totalLoanAmount: number;
  totalCommission: number;
}

export default function AgentPage() {
  const [role, setRole] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  // Load role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  // Fetch agents whenever role changes
  useEffect(() => {
    if (!role) return;

    const fetchAgents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }
        const res = await fetch("http://localhost:3001/agents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (err) {
        setAgents([]);
        setError((err as Error).message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [role]);

  // Language listener
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if ((role === "head" && event.detail.userType === 'head') || 
          (role === "loan officer" && event.detail.userType === 'loanOfficer') ||
          (role === "manager" && event.detail.userType === 'manager')) {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, [role]);

  const t = firstAgentTranslation[language];

  const handleAddAgent = async () => {
    if (!newAgentName || !newAgentPhone) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }
      const res = await fetch("http://localhost:3001/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newAgentName, phoneNumber: newAgentPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add agent");
      } else {
        setAgents(prev => [...prev, data.agent]);
        setNewAgentName("");
        setNewAgentPhone("");
        setShowModal(false);
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!role) return <div className="text-center py-8">Loading role...</div>;

  const filteredAgents = agents.filter(agent => {
    const q = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.phoneNumber.toLowerCase().includes(q) ||
      agent.agentId.toLowerCase().includes(q)
    );
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'handled') return b.handledLoans - a.handledLoans;
    if (sortBy === 'amount') return b.totalLoanAmount - a.totalLoanAmount;
    return 0;
  });

  let Wrapper;
  if (role === "loan officer") Wrapper = LoanOfficer;
  else if (role === "head") Wrapper = Head;
  else Wrapper = Manager;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.h1}</h1>

            {role === "loan officer" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setShowModal(true)}
              >
                {t.addBtn}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                <option value="">{t.sortBy}</option>
                <option value="handled">{t.sort1}</option>
                <option value="amount">{t.sort2}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="w-full">
            <div className="rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th1}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th2}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th3}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th4}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th5}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.th6}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500 text-lg">Loading...</td>
                      </tr>
                    ) : sortedAgents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500 text-lg">No agents found.</td>
                      </tr>
                    ) : (
                      sortedAgents.map((agent) => (
                        <tr key={agent.agentId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{agent.agentId}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{agent.phoneNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{agent.handledLoans}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">₱{agent.totalLoanAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">₱{agent.totalCommission.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <AddAgentModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onAddAgent={handleAddAgent}
            loading={loading}
            error={error}
            newAgentName={newAgentName}
            setNewAgentName={setNewAgentName}
            newAgentPhone={newAgentPhone}
            setNewAgentPhone={setNewAgentPhone}
          />
        </div>
      </div>
    </Wrapper>
  );
}
