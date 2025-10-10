'use client';

import { FC, useEffect, useState } from "react";
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    setAnimateIn(true);
    return () => setAnimateIn(false);
  }, []);
  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition text-2xl"
          aria-label="Close"
        >×</button>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4 text-sm">Please fill out the missing fields.</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors text-sm"
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
        const res = await fetch("http://localhost:3001/agents");
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
              {agent.name} ({agent.agentId})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AgentDropdown;
