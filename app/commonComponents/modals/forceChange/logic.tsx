'use client';

import { useState, useCallback } from 'react';

export function useChangePassword(
  id: string | null,
  role: 'user' | 'borrower', // 👈 add role
  onClose: () => void
) {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : '';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';


  const preventCopyPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    return false;
  }, []);

  const preventCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    return false;
  }, []);

  const preventCut = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    return false;
  }, []);

  const handleChange = async () => {
    if (newPassword !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const endpoint =
        role === 'borrower'
          ? `http://localhost:3001/borrowers/${borrowersId}/change-password`
          : `http://localhost:3001/users/${userId}/change-password`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Password changed successfully.');
        localStorage.removeItem('forcePasswordChange');
        onClose();
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return {
    newPassword, setNewPassword,
    confirm, setConfirm,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    error, setError,
    handleChange,
    preventCopy, preventCut, preventCopyPaste,
  };
}
