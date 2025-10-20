'use client';

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useChangePassword } from './logic';
import { useState } from 'react';
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";
import { ChangePasswordModalProps } from "../../utils/Types/modal";

export default function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role =
    typeof window !== "undefined"
      ? (localStorage.getItem("role") as "user" | "borrower") || "user"
      : "user";

  const id =
    role === "borrower"
      ? localStorage.getItem("borrowersId")
      : localStorage.getItem("userId");

  const {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirm, setConfirm,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    showCurrent, setShowCurrent,
    handleChange,
    preventCopy, preventCut, preventCopyPaste,
    SuccessModalComponent,
    ErrorModalComponent,
    clearError,
    missingFields,
    clearMissingField,
    passwordChanged,
    showError: logicShowError,
  } = useChangePassword(id, role, onClose, onSuccess);

  const handleCancel = () => {
    // Only allow closing if password was successfully changed
    if (!passwordChanged) {
      // Replace browser alert with app error modal
      logicShowError("It is required to change your password for security purposes");
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await handleChange();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <SubmitOverlayToast open={isSubmitting} message="Changing password..." />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4">
        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <h2 className="text-xl font-semibold text-gray-900">Change Your Password</h2>
          <p className="mt-1 text-sm text-gray-600">For your security, please set a new password before continuing.</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 mt-4 space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                className={`w-full border ${missingFields.includes('currentPassword') ? 'border-red-500' : 'border-gray-300'} 
                            rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 
                            outline-none transition placeholder:text-gray-500 text-gray-900`}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearMissingField('currentPassword');
                  clearError();
                }}
                autoComplete="current-password"
                onContextMenu={(e) => e.preventDefault()}
                onPaste={preventCopyPaste}
                onCopy={preventCopy}
                onCut={preventCut}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                className={`w-full border ${missingFields.includes('newPassword') ? 'border-red-500' : 'border-gray-300'} 
                            rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 
                            outline-none transition placeholder:text-gray-500 text-gray-900`}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearMissingField('newPassword');
                  clearError();
                }}
                autoComplete="new-password"
                onContextMenu={(e) => e.preventDefault()}
                onPaste={preventCopyPaste}
                onCopy={preventCopy}
                onCut={preventCut}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`w-full border ${missingFields.includes('confirmPassword') ? 'border-red-500' : 'border-gray-300'} 
                            rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 
                            outline-none transition placeholder:text-gray-700 text-gray-900`}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  clearMissingField('confirmPassword');
                  clearError();
                }}
                onPaste={preventCopyPaste}
                onCopy={preventCopy}
                onCut={preventCut}
                autoComplete="new-password"
                onContextMenu={(e) => e.preventDefault()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-60"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {SuccessModalComponent}
        {ErrorModalComponent}
      </div>
    </div>
  );
}
