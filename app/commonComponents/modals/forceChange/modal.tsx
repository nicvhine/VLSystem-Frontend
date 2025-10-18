'use client';

import { FiEye, FiEyeOff } from "react-icons/fi";
import React from "react";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";
import { useChangePassword } from './logic';

/**
 * Modal component for forced password change
 */
interface ChangePasswordModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
  const [animateIn, setAnimateIn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 0);
    return () => clearTimeout(t);
  }, []);

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
  } = useChangePassword(id, role, onClose, onSuccess);

  const [isSaving, setIsSaving] = React.useState(false);

  const onChangeClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await handleChange();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Only allow closing if password was successfully changed
    if (!passwordChanged) {
      alert("You must change your password before closing this window.");
      return;
    }
    setAnimateIn(false);
    setTimeout(() => onClose(), 200);
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-7 mx-4 transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
        <h2 className="text-2xl font-bold text-gray-900 text-center">Change Your Password</h2>
        <div className="space-y-4 mt-6">
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
                className={`w-full border ${missingFields.includes('currentPassword') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition placeholder:text-gray-500 text-gray-900`}
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
              {missingFields.includes('currentPassword') && (
                <p className="mt-1 text-xs text-red-600">Current password is required.</p>
              )}
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
                className={`w-full border ${missingFields.includes('newPassword') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition placeholder:text-gray-500 text-gray-900`}
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
              {missingFields.includes('newPassword') && (
                <p className="mt-1 text-xs text-red-600">New password is required.</p>
              )}
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
                className={`w-full border ${missingFields.includes('confirmPassword') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition placeholder:text-gray-700 text-gray-900`}
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
              {missingFields.includes('confirmPassword') && (
                <p className="mt-1 text-xs text-red-600">Please confirm your password.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={onChangeClick}
            disabled={isSaving}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition text-white ${isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Change Password
          </button>
          <button
            onClick={handleCancel}
            className="w-full border border-gray-300 bg-white text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {SuccessModalComponent}
      {ErrorModalComponent}
      {isSaving && <SubmitOverlayToast label="Changing password..." />}
    </div>
  );
}
