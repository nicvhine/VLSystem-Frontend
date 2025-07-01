"use client";

import { useState, useEffect } from "react";
import Navbar from "./navbar";
import { useRouter } from 'next/navigation';
import ChangePasswordModal from "../changePasswordInternal/forceChange";
import CollectionsPage from "./collectionsPage";

export default function Head(){
const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

useEffect(() => {
  const mustChange = localStorage.getItem('forcePasswordChange');
  if (mustChange === 'true') {
    setShowChangePasswordModal(true);
  }
  
  
}, []);

    return(
        <div className="min-h-screen bg-white">
            < Navbar/>
            < CollectionsPage />

        {showChangePasswordModal && (
          <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
        )}
        </div>
    )
}