"use client";

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

interface Agent {
  agentId: string;
  name: string;
  phoneNumber: string;
}

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phoneNumber: string }) => Promise<void>;
  agent: Agent | null;
  loading: boolean;
}

const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  agent,
  loading,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (agent) {
      setName(agent.name || "");
      setPhoneNumber(agent.phoneNumber || "");
    }
  }, [agent]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert("All fields are required.");
      return;
    }

    if (!name.includes(" ")) {
      alert("Please enter the full name.");
      return;
    }

    await onSave({ name, phoneNumber });
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Agent</h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="font-medium text-sm">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div>
            <label className="font-medium text-sm">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="09123456789"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentModal;
