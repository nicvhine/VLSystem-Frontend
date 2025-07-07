'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ChangePasswordModal from "../changePasswordInternal/forceChange";
import HeadNavbar from "./headNavbar/page";

export default function Head({ children }: { children?: React.ReactNode }) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

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
      <HeadNavbar />

      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
      )}

      {children}
    </div>
  );
}
