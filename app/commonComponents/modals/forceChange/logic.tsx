'use client';

import { useState, useCallback } from 'react';
import SuccessModal from '../successModal/modal';

export function useChangePassword(
  id: string | null,
  role: 'user' | 'borrower',
  onClose: () => void
) {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [error, setError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : '';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''; // <-- get token

  // Disallow copy/paste for basic hardening
  const preventCopyPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);
  const preventCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);
  const preventCut = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);

  // Validate and submit password change to backend
  const handleChange = async () => {
    if (newPassword !== confirm) {
      setError('New Password and Confirm Password do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const endpoint =
        role === 'borrower'
          ? `http://localhost:3001/borrowers/${borrowersId}/change-password`
          : `http://localhost:3001/users/${userId}/change-password`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword, currentPassword }),
      });

      const result = await res.json();

      if (res.ok) {
          setSuccessMessage('Password changed successfully.');
          setSuccessOpen(true);
          setTimeout(() => {
            setSuccessOpen(false);
            localStorage.removeItem('forcePasswordChange');
            onClose();
          }, 5000);
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return {
    newPassword, setNewPassword,
    currentPassword, setCurrentPassword,
    confirm, setConfirm,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    error, setError,
    handleChange,
    preventCopy, preventCut, preventCopyPaste,
    successOpen, setSuccessOpen,
    successMessage, setSuccessMessage,
    SuccessModalComponent: (
      <SuccessModal
        isOpen={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
    ),
  };
}
