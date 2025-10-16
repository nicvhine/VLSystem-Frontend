'use client';

import { useState, useCallback } from 'react';
import type { ClipboardEvent } from 'react';
import SuccessModal from '../successModal/modal';
import ErrorModal from '../errorModal/modal';

/**
 * Custom hook for password change functionality
 * Handles validation, security features, and API communication
 */
export function useChangePassword(
  id: string | null,
  role: 'user' | 'borrower',
  onClose: () => void,
  onSuccess?: () => void
) {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : '';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''; // <-- get token

  // Security: Prevent copy/paste operations
  const preventCopyPaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);
  const preventCopy = useCallback((e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);
  const preventCut = useCallback((e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); return false; }, []);

  // Validate and submit password change to backend
  const handleChange = async () => {
    const missing: string[] = [];
    if (!currentPassword.trim()) missing.push('currentPassword');
    if (!newPassword.trim()) missing.push('newPassword');
    if (!confirm.trim()) missing.push('confirmPassword');

    if (missing.length > 0) {
      setMissingFields(missing);
      setErrorMessage('Please fill in all required fields.');
      setErrorOpen(true);
      return;
    }

    setMissingFields([]);

    if (newPassword !== confirm) {
      setErrorMessage('New Password and Confirm Password do not match.');
      setErrorOpen(true);
      return;
    }

    // Validate password strength requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      setErrorOpen(true);
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
        setErrorOpen(false);
        // Clear force password change flag and notify completion
        setTimeout(() => {
          setSuccessOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('forcePasswordChange');
            window.dispatchEvent(new Event('forcePasswordChangeCompleted'));
          }
          if (onSuccess) onSuccess();
          onClose();
        }, 3000);
      } else {
        setErrorMessage(result.message || 'Failed to change password');
        setErrorOpen(true);
      }
    } catch (err) {
      console.error('Password change error:', err);
      setErrorMessage('Something went wrong. Please try again.');
      setErrorOpen(true);
    }
  };

  // Clear missing field error when user starts typing
  const clearMissingField = useCallback((field: string) => {
    setMissingFields((prev) => (prev.includes(field) ? prev.filter((name) => name !== field) : prev));
  }, []);

  return {
    newPassword, setNewPassword,
    currentPassword, setCurrentPassword,
    confirm, setConfirm,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    showCurrent, setShowCurrent,
    missingFields,
    handleChange,
    preventCopy, preventCut, preventCopyPaste,
    SuccessModalComponent: (
      <SuccessModal
        isOpen={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
    ),
    ErrorModalComponent: (
      <ErrorModal
        isOpen={errorOpen}
        message={errorMessage}
        onClose={() => {
          setErrorOpen(false);
          setErrorMessage('');
        }}
      />
    ),
    clearError: () => {
      setErrorOpen(false);
      setErrorMessage('');
    },
    clearMissingField,
  };
}
