"use client";

import { useState, useEffect} from "react";
import { useRouter } from 'next/navigation';
import LoanOfficerNavbar from "./navbar/page";
import ChangePasswordModal from "@/app/commonComponents/modals/forceChange/modal";
import useInactivityLogout from "@/app/commonComponents/modals/inactivity/logic";
import AreYouStillThereModal from "@/app/commonComponents/modals/inactivity/modal";

interface LoanOfficerProps {
  children?: React.ReactNode;
  isNavbarBlurred?: boolean;
}

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
    return(
        <div className="min-h-screen bg-white">
          <LoanOfficerNavbar isBlurred={isNavbarBlurred} />
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