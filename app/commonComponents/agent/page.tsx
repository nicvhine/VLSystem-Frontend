'use client';

import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
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

const getUserRole = (): string | null => localStorage.getItem("role");

export default function AgentPage() {
  const [role, setRole] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Language state (default English)
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  // Search / Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Modal animation states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);


  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:3001/agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  useEffect(() => {
    const currentRole = getUserRole();
    setRole(currentRole);

    if (currentRole === "loan officer") {
      fetchAgents();
      const storedLanguage = localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb' | null;
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (role === "loan officer" && event.detail.userType === 'loanOfficer') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, [role]);

  const handleAddAgent = async () => {
    if (!newAgentName || !newAgentPhone) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  let Wrapper;
  if (role === "loan officer") {
    Wrapper = LoanOfficer;
  } else if (role === "head") {
    Wrapper = Head;
  } else {
    Wrapper = Manager;
  }

  const t = firstAgentTranslation[language];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const filteredAndSortedAgents = agents
    .filter((agent) => {
      const q = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.phoneNumber.toLowerCase().includes(q) ||
        agent.agentId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'handled') {
        return b.handledLoans - a.handledLoans;
      }
      if (sortBy === 'amount') {
        return b.totalLoanAmount - a.totalLoanAmount;
      }
      return 0;
    });

  return (
    <Wrapper isNavbarBlurred={isModalVisible}>
      <div className="min-h-screen bg-gray-50 text-black">
        {role === "loan officer" && (
          <div className="mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">{t.h1}</h1>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setShowModal(true)}
              >
                {t.addBtn}
              </button>
            </div>

            {/* Search + Sort (applications-style) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative w-full sm:w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                    appearance-none transition-all"
                >
                  <option value="">{t.sortBy}</option>
                  <option value="handled">{t.sort1}</option>
                  <option value="amount">{t.sort2}</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Display agents */}
        <div className="mx-auto px-4 sm:px-6 pb-8">
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[
                    t.th1,
                    t.th2,
                    t.th3,
                    t.th4,
                    t.th5,
                    t.th6,
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAndSortedAgents.map((agent) => (
                  <tr
                    key={agent.agentId}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {agent.agentId}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {agent.phoneNumber}
                    </td>

                    {/* Handled Loans */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {agent.handledLoans}
                    </td>

                    {/* Total Loan Amount */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(agent.totalLoanAmount)}
                    </td>

                    {/* Total Commission */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatCurrency(agent.totalCommission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Agent Modal */}
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
    </Wrapper>
  );
}
