'use client';

import { FC, useEffect, useState } from "react";
import { Agent } from "@/app/commonComponents/utils/Types/agent";
import { AgentDropdownProps } from "@/app/commonComponents/utils/Types/agent";

const AgentDropdown: FC<AgentDropdownProps> = ({
  language,
  appAgent,
  setAppAgent,
  missingError,
  showFieldErrors = false,
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
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingError) ? 'border-red-500' : 'border-gray-200'}`}
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
