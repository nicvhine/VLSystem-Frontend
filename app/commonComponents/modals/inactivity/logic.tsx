'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useInactivityLogout(timeout = 5000) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const activityTimer = useRef<NodeJS.Timeout | null>(null);

  // Logout function
  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  // Start the inactivity timer
  const startInactivityTimer = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);
    activityTimer.current = setTimeout(() => {
      setShowModal(true);
    }, timeout);
  };

  // User chooses to stay logged in
  const stayLoggedIn = () => {
    setShowModal(false);
    startInactivityTimer();
  };

  useEffect(() => {
    startInactivityTimer();

    const handleActivity = () => {
      if (!showModal) startInactivityTimer();
    };

    const events = ['mousemove', 'keydown', 'scroll'];
    events.forEach(e => window.addEventListener(e, handleActivity));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      if (activityTimer.current) clearTimeout(activityTimer.current);
    };
  }, [showModal]);

  return { showModal, stayLoggedIn, logout };
}
