"use client";

import { useState, useEffect} from "react";
import { useRouter } from 'next/navigation';
import Navbar from "@/app/commonComponents/navbarComponents/navbar";
import ChangePasswordModal from "@/app/commonComponents/modals/forceChange/modal";
import useInactivityLogout from "@/app/commonComponents/modals/inactivity/logic";
import AreYouStillThereModal from "@/app/commonComponents/modals/inactivity/modal";
import { LoanOfficerProps } from "@/app/commonComponents/utils/Types/components";

export default function LoanOfficer({ children, isNavbarBlurred = false }: LoanOfficerProps){
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  
  const { showModal, countdown, stayLoggedIn, logout } = useInactivityLogout();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      const mustChange = localStorage.getItem('forcePasswordChange');

      if (!token){
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
        <Navbar role="loanOfficer" isBlurred={isNavbarBlurred} />

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