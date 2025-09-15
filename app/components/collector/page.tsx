"use client";

import { useState, useEffect } from "react";
import CollectorNavbar from "./collectorNavbar/page";
import { useRouter } from 'next/navigation';
import ChangePasswordModal from "../changePasswordInternal/forceChange";
import CollectionsPage from "./collectionsPage";

export default function Collector(){
const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
  const mustChange = localStorage.getItem('forcePasswordChange');
  if (mustChange === 'true') {
    setShowChangePasswordModal(true);
  }
  
  
}, []);

    return(
        <div className="min-h-screen bg-white">
            < CollectorNavbar isBlurred={isModalOpen || showChangePasswordModal}/>
            < CollectionsPage onModalStateChange={setIsModalOpen} />

        {showChangePasswordModal && (
          <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
        )}
        </div>
    )
}