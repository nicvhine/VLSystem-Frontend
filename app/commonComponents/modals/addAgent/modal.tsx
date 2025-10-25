'use client';

import { FC } from "react";
import ConfirmModal from "../confirmModal";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";
import { AddAgentModalProps } from "../../utils/Types/agent";
import { useAddAgentLogic } from "./logic";

// Modal component for adding an agent
const AddAgentModal: FC<AddAgentModalProps> = ({
  show,
  onClose,
  onAddAgent,
  newAgentName,
  setNewAgentName,
  newAgentPhone,
  setNewAgentPhone
}) => {
  const loading = false;

  const { showConfirm, setShowConfirm, fieldErrors, genericError, isVisible, isAnimating, handleConfirm } =
    useAddAgentLogic(onAddAgent, show, loading);

  if (!isVisible) return null; 

  const handleModalClose = () => { if (!loading) onClose(); };
  const handleAddClick = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);

  return (
    <>
      {/* Loading overlay */}
      <SubmitOverlayToast open={loading} message="Adding agent..." />

      {/* Modal background */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 transition-opacity duration-150 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleModalClose}
      >
        {/* Modal content */}
        <div
          className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md transition-all duration-150 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-2">Add New Agent</h2>

          <form onSubmit={(e) => { e.preventDefault(); handleAddClick(); }} className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Maria Dela Cruz"
                value={newAgentName}
                onChange={e => setNewAgentName(e.target.value)}
                className="mt-1 w-full border rounded-md px-4 py-2"
              />
              {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            {/* Phone input */}
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                type="text"
                value={newAgentPhone}
                onChange={e => setNewAgentPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                className="mt-1 w-full border rounded-md px-4 py-2"
              />
              {fieldErrors.phoneNumber && <p className="text-xs text-red-500">{fieldErrors.phoneNumber}</p>}
            </div>

            {genericError && <p className="text-sm text-red-600">{genericError}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-200 rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md">
                Save Agent
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmModal show={showConfirm} message="Do you want to add this agent?" onConfirm={handleConfirm} onCancel={handleCancel} loading={loading} />
    </>
  );
};

export default AddAgentModal;
