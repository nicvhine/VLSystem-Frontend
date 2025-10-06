'use client';

import { useState, useEffect } from "react";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import AddAgentModal from "@/app/commonComponents/modals/addAgent/modal"; 

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
    }
  }, []);

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

  const Wrapper: React.FC =
    role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  return (
    <Wrapper>
      <div className="p-6">
        {role === "loan officer" && (
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Agents</h1>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={() => setShowModal(true)}
            >
              Add Agent
            </button>
          </div>
        )}

        {/* Display agents */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handled Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Loan Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent) => (
                <tr key={agent.agentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-black">{agent.agentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{agent.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{agent.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{agent.handledLoans}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">₱{agent.totalLoanAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">₱{agent.totalCommission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
