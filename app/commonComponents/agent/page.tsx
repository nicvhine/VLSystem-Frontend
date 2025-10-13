'use client';

// Agents page: list, search, sort, and add agent (loan officer)
import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import AddAgentModal from "@/app/commonComponents/modals/addAgent/modal";
import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const currentRole = getUserRole();
    setRole(currentRole);
    if (currentRole === "loan officer") {
      fetchAgents();
      const storedLanguage = localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb' | null;
      if (storedLanguage) setLanguage(storedLanguage);
    }
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:3001/agents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

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
        setAgents(prev => [...prev, created]);
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
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;
  let Wrapper;
  if (role === "loan officer") Wrapper = LoanOfficer;
  else if (role === "head") Wrapper = Head;
  else Wrapper = Manager;
  const t = firstAgentTranslation[language];

  // Filter and sort
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

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.h1}</h1>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={() => setShowModal(true)}
            >
              {t.addBtn}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
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
                <option value="">{t.sortBy}</option>
                <option value="handled">{t.sort1}</option>
                <option value="amount">{t.sort2}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          {/* Agents Table - match loan applications style */}
          <div className="w-full">
            <div className="rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Handled Loans</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Loan Amount</th>
                      <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Commission</th>
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
          {/* Pagination + Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 text-black">
            <div className="text-sm text-gray-700">
              {totalCount === 0 ? (
                <>Showing 0 of 0</>
              ) : (
                <>Showing <span className="font-medium">{showingStart}</span>–<span className="font-medium">{showingEnd}</span> of <span className="font-medium">{totalCount}</span></>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 bg-white border border-gray-300 rounded-md text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <span className="px-1 py-1 text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
