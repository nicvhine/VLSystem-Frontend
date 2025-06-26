'use client';

import { useState } from 'react';

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const borrowersId = localStorage.getItem('borrowersId');

  const handleChange = async () => {
    if (newPassword !== confirm) return alert("Passwords don't match");
    if (!newPassword || newPassword.length < 6) return alert("Password too short");

    try {
      const res = await fetch(`http://localhost:3001/borrowers/${borrowersId}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Password changed successfully.");
        localStorage.removeItem('forcePasswordChange');
        onClose();
      } else {
        alert(result.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Change Your Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          For your security, please set a new password before continuing.
        </p>
        
         {/* New Password Field */}
        <div className="relative mb-3">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="New Password"
            className="w-full border px-4 py-2 rounded pr-16"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-sm text-gray-600"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full border px-4 py-2 rounded pr-16"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-sm text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <button
          onClick={handleChange}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
