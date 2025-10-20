'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Track user inactivity and present warning modal before auto-logout
export default function useInactivityLogout(timeout = 6000000, modalTimeout = 10000) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(modalTimeout / 1000);

  const activityTimer = useRef<NodeJS.Timeout | null>(null);
  const modalTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Clear session and redirect to login
  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  const resetCountdown = () => {
    setCountdown(modalTimeout / 1000);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  // Show modal and start countdown + auto-logout timer
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

  // Reset inactivity timer based on recent activity
  const startInactivityTimer = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);
    activityTimer.current = setTimeout(() => {
      showInactivityModal();
    }, timeout);
  };

  // Dismiss modal and resume normal inactivity tracking
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