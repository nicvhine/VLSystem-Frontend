"use client";

import { useState, useEffect} from "react";
import Navbar from "./navbar";
import Dashboard from "./dashboard/page";
import ChangePasswordModal from "../changePasswordInternal/forceChange";

export default function LoanOfficer(){
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    
    useEffect(() => {
      const mustChange = localStorage.getItem('forcePasswordChange');
      if (mustChange === 'true') {
        setShowChangePasswordModal(true);
      }
    }, []);
    return(
        <div className="min-h-screen bg-white">
            < Dashboard />

              {showChangePasswordModal && (
                                  <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
                                )}
        </div>
    )
}