'use client';

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useChangePassword } from './logic';

/**
 * Modal component for forced password change
 */
export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const role = typeof window !== "undefined" ? localStorage.getItem('role') as "user" | "borrower" : "user";
  const id =
    role === "borrower"
      ? localStorage.getItem("borrowerId")
      : localStorage.getItem("userId");

  const {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirm, setConfirm,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    showCurrent, setShowCurrent,
    error, setError,
    handleChange,
    preventCopy, preventCut, preventCopyPaste,
  } = useChangePassword(id, role, onClose);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Change Your Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
        )}

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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none 
                           transition placeholder:text-gray-500 text-gray-900"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError('');
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none 
                           transition placeholder:text-gray-500 text-gray-900"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none 
                           transition placeholder:text-gray-700 text-gray-900"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError('');
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
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={handleChange}
            className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition"
            disabled={!currentPassword || !newPassword || !confirm || newPassword !== confirm}
          >
            Change Password
          </button>
          <button
            onClick={() => {
              const passwordChanged = localStorage.getItem("passwordChanged") === "true";
              const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

              if (!passwordChanged || isFirstLogin) {
                setError("You must change your password before closing this window.");
                return;
              }

              onClose();
            }}
            className="w-full border border-gray-300 bg-white text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
