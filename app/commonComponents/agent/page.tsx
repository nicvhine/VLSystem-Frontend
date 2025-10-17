'use client';

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

// Role-based page wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

import AddAgentModal from "@/app/commonComponents/modals/addAgent/modal";
import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
import Pagination from "../pagination";
import translations from "../Translation";

type Language = 'en' | 'ceb';

const normalizeAgent = (raw: any): Agent => ({
  agentId: typeof raw?.agentId === "string" ? raw.agentId : String(raw?.agentId ?? ""),
  name: typeof raw?.name === "string" ? raw.name : String(raw?.name ?? ""),
  phoneNumber: typeof raw?.phoneNumber === "string" ? raw.phoneNumber : String(raw?.phoneNumber ?? ""),
  handledLoans: Number.isFinite(Number(raw?.handledLoans)) ? Number(raw?.handledLoans) : 0,
  totalLoanAmount: Number.isFinite(Number(raw?.totalLoanAmount)) ? Number(raw?.totalLoanAmount) : 0,
  totalCommission: Number.isFinite(Number(raw?.totalCommission)) ? Number(raw?.totalCommission) : 0,
});

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
  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

    // Listen for language changes based on active role
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
  
  // Load role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);

      if (storedRole === "head") {
        const storedLanguage = localStorage.getItem("headLanguage") as Language | null;
        if (storedLanguage) setLanguage(storedLanguage);
      } else if (storedRole === "loan officer") {
        const storedLanguage = localStorage.getItem("loanOfficerLanguage") as Language | null;
        if (storedLanguage) setLanguage(storedLanguage);
      } else if (storedRole === "manager") {
        const storedLanguage = localStorage.getItem("managerLanguage") as Language | null;
        if (storedLanguage) setLanguage(storedLanguage);
      }
    } else {
      setRole(null);
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    if (!role) return;

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setAgents([]);
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
      if (Array.isArray(data)) {
        setAgents(data.map(normalizeAgent));
      } else if (Array.isArray(data?.agents)) {
        setAgents(data.agents.map(normalizeAgent));
      } else {
        setAgents([]);
      }
    } catch (err) {
      setAgents([]);
      setError((err as Error).message || "Server error");
    } finally {
      setLoading(false);
    }
  }, [role]);


  const t = translations.loanTermsTranslator[language];

  const handleAddAgent = async (): Promise<{
    success: boolean;
    fieldErrors?: { name?: string; phoneNumber?: string };
    message?: string;
  }> => {
    // Local validations and duplicate checks
    const nameRaw = newAgentName ?? "";
    const phoneRaw = newAgentPhone ?? "";

    const nameTrim = nameRaw.trim();
    const phoneTrim = phoneRaw.trim();
    const normalizeName = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
    const normalizePhone = (s: string) => s.replace(/\D/g, "");

    const errors: { name?: string; phoneNumber?: string } = {};
    if (!nameTrim) errors.name = "Name is required";
    if (!phoneTrim) errors.phoneNumber = "Phone number is required";
    // Require at least two words for full name
    if (nameTrim) {
      const wordCount = nameTrim.split(/\s+/).filter(Boolean).length;
      if (wordCount < 2) {
        errors.name = "Please enter at least two words (first and last name).";
      }
    }

    const nameNorm = normalizeName(nameTrim);
    const phoneNorm = normalizePhone(phoneTrim);

    // Phone must start with 09 and be exactly 11 digits
    if (phoneNorm) {
      if (!phoneNorm.startsWith("09")) {
        errors.phoneNumber = "Phone number must start with 09.";
      } else if (phoneNorm.length !== 11) {
        errors.phoneNumber = "Phone number must be exactly 11 digits.";
      }
    }

    // Preflight: check duplicates against already loaded agents
    const agentNameClash = agents.some(a => normalizeName(a.name) === nameNorm);
    const agentPhoneClash = agents.some(a => normalizePhone(a.phoneNumber) === phoneNorm);

    if (agentNameClash) {
      errors.name = errors.name || "An agent with this name already exists.";
    }
    if (agentPhoneClash) {
      errors.phoneNumber = errors.phoneNumber || "This phone number is already used by another agent.";
    }

    if (errors.name || errors.phoneNumber) {
      return { success: false, fieldErrors: errors };
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {

        return { success: false, message: "No token found. Please log in again." };
        setError("No token found. Please log in again.");
        return { success: false, message: "No token found. Please log in again." };
      }
        
      const res = await fetch("http://localhost:3001/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameTrim, phoneNumber: phoneTrim }),
      });

      // Attempt to parse JSON safely
      let data: any = null;
      try { data = await res.json(); } catch { data = null; }

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || "Failed to add agent";
        // Map server messages to field errors when possible
        if (typeof msg === "string") {
          const lower = msg.toLowerCase();
          const fe: { name?: string; phoneNumber?: string } = {};
          if (lower.includes("full name")) {
            fe.name = "Please enter a full name (first and last).";
          }
          if (lower.includes("already exists") || lower.includes("already in use")) {
            // Backend currently enforces duplicate on name+phone pair
            // Mark both fields to guide the user
            fe.name = fe.name || "This agent already exists with the same phone number.";
            fe.phoneNumber = fe.phoneNumber || "This phone number is already used with the same name.";
          }
          if (fe.name || fe.phoneNumber) {
            return { success: false, fieldErrors: fe };
          }
        }
        return { success: false, message: msg };
      }

      // Success
      const created = data?.agent;
      if (created) {
  setAgents(prev => [...prev, normalizeAgent(created)]);
      } else {
        // Fallback: refetch if response shape is unexpected
        await fetchAgents();
      }
      setNewAgentName("");
      setNewAgentPhone("");
      setShowModal(false);
      setSuccessMessage("Agent added successfully");
      return { success: true };
    } catch (err) {
      setError("Server error");
      return { success: false, message: "Server error" };
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
  const totalPages = Math.max(1, Math.ceil(sortedAgents.length / pageSize));
  const paginatedAgents = sortedAgents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalCount = sortedAgents.length;
  const showingStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * pageSize);

  let Wrapper;
  if (role === "loan officer") Wrapper = LoanOfficer;
  else if (role === "head") Wrapper = Head;
  else Wrapper = Manager;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.Agents}</h1>

            {role === "loan officer" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setShowModal(true)}
              >
                {t.l39}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.l22}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="relative w-full sm:w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                <option value="">{t.l38}</option>
                <option value="handled">{t.l19}</option>
                <option value="amount">{t.l4}</option>
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
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l11}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l12}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l18}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l19}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l4}</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l20}</th>
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
                      paginatedAgents.map((agent) => (
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
            newAgentName={newAgentName}
            setNewAgentName={setNewAgentName}
            newAgentPhone={newAgentPhone}
            setNewAgentPhone={setNewAgentPhone}
          />
          {/* Success Toast */}
          <SuccessModal
            isOpen={!!successMessage}
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
          
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
