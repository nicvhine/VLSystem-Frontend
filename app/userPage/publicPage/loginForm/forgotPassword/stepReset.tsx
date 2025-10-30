'use client';

import ConfirmModal from '@/app/commonComponents/modals/confirmModal';

type Props = {
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  error: string;
  showResetConfirm: boolean;
  setShowResetConfirm: (show: boolean) => void;
  doResetPassword: () => void;
  resetLoading: boolean;
};

export default function StepReset({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  error,
  showResetConfirm,
  setShowResetConfirm,
  doResetPassword,
  resetLoading,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-3"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mb-4"
      />
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        disabled={!newPassword || !confirmPassword}
        onClick={() => setShowResetConfirm(true)}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
      >
        Reset Password
      </button>

      <ConfirmModal
        show={showResetConfirm}
        message="Are you sure you want to reset your password?"
        onConfirm={doResetPassword}
        onCancel={() => setShowResetConfirm(false)}
        loading={resetLoading}
      />
    </>
  );
}
