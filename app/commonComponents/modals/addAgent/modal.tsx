'use client';

import { FC } from "react";
import { FiX } from "react-icons/fi";

interface AddAgentModalProps {
  show: boolean;
  onClose: () => void;
  onAddAgent: () => void;
  loading: boolean;
  error: string;
  newAgentName: string;
  setNewAgentName: (name: string) => void;
  newAgentPhone: string;
  setNewAgentPhone: (phone: string) => void;
}

const AddAgentModal: FC<AddAgentModalProps> = ({
  show,
  onClose,
  onAddAgent,
  loading,
  error,
  newAgentName,
  setNewAgentName,
  newAgentPhone,
  setNewAgentPhone,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Agent</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={newAgentName}
            onChange={e => setNewAgentName(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newAgentPhone}
            onChange={e => setNewAgentPhone(e.target.value)}
            className="border p-2 rounded-md"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={onAddAgent}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAgentModal;
