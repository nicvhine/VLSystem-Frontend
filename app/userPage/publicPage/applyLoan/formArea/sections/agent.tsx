'use client';

import { FC, useEffect, useState } from "react";
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    setAnimateIn(true);
    return () => setAnimateIn(false);
  }, []);
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 150);
  };
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Required</h3>
        <p className="text-sm text-gray-600 mb-4">{message || 'Please fill out the missing fields.'}</p>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >Close</button>
        </div>
      </div>
    </div>
  );
}

interface Agent {
  agentId: string;
  name: string;
}

interface AgentDropdownProps {
  language: "en" | "ceb";
  appAgent: string;
  setAppAgent: (agentId: string) => void;
  missingError?: boolean;
}


const AgentDropdown: FC<AgentDropdownProps> = ({
  language,
  appAgent,
  setAppAgent,
  missingError,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:3001/agents/names");
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
        {language === "en" ? "Select Agent" : "Pilia ang Ahente"}
      </h4>

      {loading ? (
        <p className="text-gray-500">{language === "en" ? "Loading agents..." : "Nag-load sa mga ahente..."}</p>
      ) : (
        <select
          value={appAgent}
          onChange={(e) => setAppAgent(e.target.value)}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingError ? 'border-red-500' : 'border-gray-200'}`}
        >
          <option value="">{language === "en" ? "Choose an agent" : "Pilia ang ahente"}</option>
          {agents.map((agent) => (
            <option key={agent.agentId} value={agent.agentId}>
              {agent.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AgentDropdown;
