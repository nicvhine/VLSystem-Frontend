'use client';

import { FC, useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

import ConfirmModal from "../confirmModal/ConfirmModal";

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
  const [showConfirm, setShowConfirm] = useState(false);

  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [show]);

  if (!show) return null;

  const handleAddClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onAddAgent();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}> 
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4 text-black">Add New Agent</h2>

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
              onClick={handleAddClick}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              {loading ? "Adding..." : "Add Agent"}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showConfirm}
        message="Do you want to add this agent?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />
    </>
  );
};

export default AddAgentModal;
