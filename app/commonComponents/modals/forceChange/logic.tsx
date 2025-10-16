'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordChanged, setPasswordChanged] = useState<boolean | null>(null);

  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : '';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Fetch passwordChanged status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const endpoint =
          role === 'borrower'
            ? `http://localhost:3001/borrowers/${borrowersId}`
            : `http://localhost:3001/users/${userId}`;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (res.ok) {
          setPasswordChanged(result.passwordChanged);
        } else {
          console.error('Failed to fetch passwordChanged status');
        }
      } catch (err) {
        console.error('Error fetching passwordChanged:', err);
      }
    };

    fetchStatus();
  }, [role, borrowersId, userId, token]);

  // Prevent copy/paste
  const preventCopyPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); }, []);
  const preventCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); }, []);
  const preventCut = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); }, []);

  // Change password handler
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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword, currentPassword }),
      });

      const result = await res.json();

      if (res.ok) {
        setPasswordChanged(true);
        setSuccessMessage('Password changed successfully.');
        setSuccessOpen(true);

        setTimeout(() => {
          setSuccessOpen(false);
          localStorage.removeItem('forcePasswordChange');
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
  

  const handleModalClose = () => {
    if (passwordChanged === false) {
      setError('You must change your password before closing this modal.');
      return;
    }
    setSuccessOpen(false);
    onClose();
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
    successOpen, setSuccessOpen,
    successMessage, setSuccessMessage,
    passwordChanged,
    SuccessModalComponent: (
      <SuccessModal
        isOpen={successOpen}
        message={successMessage}
        onClose={handleModalClose}
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
