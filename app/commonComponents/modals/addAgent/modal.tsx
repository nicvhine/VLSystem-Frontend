'use client';

import { FC, useState, useEffect } from "react";

import ConfirmModal from "../confirmModal/ConfirmModal";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";

// Props interface for add agent modal component
interface AddAgentModalProps {
  show: boolean;
  onClose: () => void;
  onAddAgent: () => Promise<{
    success: boolean;
    fieldErrors?: { name?: string; phoneNumber?: string };
    message?: string;
  }>;
  loading: boolean;
  newAgentName: string;
  setNewAgentName: (name: string) => void;
  newAgentPhone: string;
  setNewAgentPhone: (phone: string) => void;
}

/**
 * Add agent modal component for creating new agent accounts
 * Handles form validation, confirmation, and agent creation
 * @param show - Boolean to control modal visibility
 * @param onClose - Callback function to close the modal
 * @param onAddAgent - Callback function to add the agent
 * @param loading - Boolean to show loading state
 * @param error - Error message to display
 * @param newAgentName - New agent's name
 * @param setNewAgentName - Function to set agent name
 * @param newAgentPhone - New agent's phone number
 * @param setNewAgentPhone - Function to set agent phone
 * @returns JSX element containing the add agent modal
 */


const AddAgentModal: FC<AddAgentModalProps> = ({
  show,
  onClose,
  onAddAgent,
  loading,
  newAgentName,
  setNewAgentName,
  newAgentPhone,
  setNewAgentPhone,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phoneNumber?: string }>({});
  const [genericError, setGenericError] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 150);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const handleModalClose = () => {
    if (loading) return; // prevent closing while processing
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setShowConfirm(false);
      setFieldErrors({});
      setGenericError("");
    }, 150);
  };

  // Show confirmation modal before adding agent
  const handleAddClick = () => {
    setGenericError("");
    setFieldErrors({});
    setShowConfirm(true);
  };

  // Confirm and proceed with adding agent
  const handleConfirm = async () => {
    setShowConfirm(false);
    setGenericError("");
    const result = await onAddAgent();
    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (result.message) setGenericError(result.message);
    }
  };

  // Cancel adding agent
  const handleCancel = () => {
    if (loading) return;
    setShowConfirm(false);
  };

  // Prevent closing with Escape while processing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show && !loading) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, loading]);

  return (
    <>
      <SubmitOverlayToast open={loading} message="Adding agent..." />
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => { if (!loading) handleModalClose(); }}
      >
        <div
          className={`bg-white p-6 text-black rounded-lg shadow-lg w-full max-w-md transition-all duration-150 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-2">Add New Agent</h2>
          <p className="text-sm text-gray-500 mb-4">
            Provide the agent’s complete name and mobile number to add them to the roster.
          </p>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddClick(); }}>
            <div>
              <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="agent-name"
                type="text"
                placeholder="e.g. Maria Dela Cruz"
                value={newAgentName}
                onChange={e => {
                  setNewAgentName(e.target.value);
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`mt-1 w-full rounded-md border px-4 py-2 text-sm ${fieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'} focus:outline-none focus:ring-2`}
                autoComplete="off"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="agent-phone" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="agent-phone"
                type="text"
                inputMode="numeric"
                placeholder="09XXXXXXXXX"
                value={newAgentPhone}
                onChange={e => {
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  const limited = digitsOnly.slice(0, 11);
                  setNewAgentPhone(limited);
                  if (fieldErrors.phoneNumber) setFieldErrors(prev => ({ ...prev, phoneNumber: undefined }));
                }}
                maxLength={11}
                className={`mt-1 w-full rounded-md border px-4 py-2 text-sm ${fieldErrors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-200'} focus:outline-none focus:ring-2`}
                autoComplete="off"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            {genericError && (
              <p className="text-sm text-red-600" role="alert">
                {genericError}
              </p>
            )}

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {loading ? "Saving..." : "Save Agent"}
              </button>
            </div>
          </form>
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
