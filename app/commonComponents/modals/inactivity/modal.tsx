'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for handling user inactivity and automatic logout
 * Monitors user activity and shows warning modal before logout
 * @param timeout - Inactivity timeout in milliseconds (default: 6000000ms = 100 minutes)
 * @param modalTimeout - Modal countdown timeout in milliseconds (default: 10000ms = 10 seconds)
 * @returns Object containing modal state and countdown
 */
export default function useInactivityLogout(timeout = 6000000, modalTimeout = 10000) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(modalTimeout / 1000);

  // Timer references for cleanup
  const activityTimer = useRef<NodeJS.Timeout | null>(null);
  const modalTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * Logout function that clears localStorage and redirects to home
   */
  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  /**
   * Reset countdown timer to initial value
   */
  const resetCountdown = () => {
    setCountdown(modalTimeout / 1000);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  /**
   * Show inactivity warning modal with countdown
   */
  const showInactivityModal = () => {
    setShowModal(true);
    let remaining = modalTimeout / 1000;
    setCountdown(remaining);

    countdownInterval.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownInterval.current!);
      }
    }, 1000);

    modalTimer.current = setTimeout(() => {
      logout();
    }, modalTimeout);
  };

  const startInactivityTimer = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);
    activityTimer.current = setTimeout(() => {
      showInactivityModal();
    }, timeout);
  };

  const stayLoggedIn = () => {
    setShowModal(false);
    resetCountdown();
    if (modalTimer.current) clearTimeout(modalTimer.current);
    startInactivityTimer();
  };

  useEffect(() => {
    startInactivityTimer();

    const handleActivity = () => {
      if (!showModal) {
        startInactivityTimer(); // Only reset inactivity if modal is not showing
      }
    };

    const events = ['mousemove', 'keydown', 'scroll'];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (activityTimer.current) clearTimeout(activityTimer.current);
      if (modalTimer.current) clearTimeout(modalTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [showModal]); // rebind when modal state changes

  return { showModal, countdown, stayLoggedIn, logout };
}