'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ChangePasswordModal from "../changePasswordInternal/forceChange";
import useInactivityLogout from '../inactivity/logic';
import AreYouStillThereModal from '../inactivity/modal';
import Dashboard from "./dashboard/page";
import ManagerNavbar from "./managerNavbar/page";

export default function Manager({ children }: { children?: React.ReactNode }) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const { showModal, countdown, stayLoggedIn, logout } = useInactivityLogout();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const mustChange = localStorage.getItem('forcePasswordChange');

    if (!token) {
      router.push('/');
      return;
    }

    if (mustChange === 'true') {
      setShowChangePasswordModal(true);
    }

    setIsCheckingAuth(false); 
  }, [router]);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-white"></div>; 
  }

  return (
    <div className="min-h-screen bg-white">
      <ManagerNavbar />
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}

      {children}
      
      {showModal && (
        <AreYouStillThereModal
          countdown={countdown}
          onStay={stayLoggedIn}
          onLogout={logout}
        />
      )}
    </div>
  );
}
