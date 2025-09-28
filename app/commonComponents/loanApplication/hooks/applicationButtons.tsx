'use client';

import React from "react";
import { Application } from "./useApplication";
import { handleClearedLoan, handleDisburse, handleDenyApplication, handleApproveApplication, handleDenyFromCleared } from "./statusHandler";

interface ApplicationButtonsProps {
  application: Application;
  role: string | null;
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  API_URL: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAgreementOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalRef: React.RefObject<any>;
}

const ApplicationButtons: React.FC<ApplicationButtonsProps> = ({
  application,
  role,
  setApplications,
  authFetch,
  API_URL,
  setIsModalOpen,
  setIsAgreementOpen,
  modalRef,
}) => {
  if (!application) return null;

  return (
    <>
      {application.status === "Applied" && role === "loan officer" && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
          >
            SET SCHEDULE
          </button>
          <button
            onClick={() => handleDenyApplication(application, setApplications, authFetch, API_URL)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            DISMISS
          </button>
        </>
      )}

      {application.status === "Disbursed" && role === "manager" && (
        <button
          onClick={() => modalRef.current?.openModal(application)}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
        >
          Create Account
        </button>
      )}

      {application.status === "Pending" && role === "loan officer" && (
        <>
          <button
            onClick={() => handleClearedLoan(application, setApplications, authFetch, API_URL)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleDenyFromCleared(application, setApplications, authFetch, API_URL)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            DISMISS
          </button>
        </>
      )}

      {application.status === "Cleared" && role === "manager" && (
        <>
          <button
            onClick={() => handleApproveApplication(application, setApplications, authFetch, API_URL)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            APPROVE
          </button>
          <button
            onClick={() => handleDenyApplication(application, setApplications, authFetch, API_URL)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            DENY
          </button>
        </>
      )}

      {application.status === "Approved" && role === "loan officer" && (
        <button
          onClick={() => handleDisburse(application, setApplications, authFetch, API_URL, setIsAgreementOpen)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Disburse
        </button>
      )}

      {application.status === "Disbursed" && (
        <button
          onClick={() => setIsAgreementOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Loan Agreement
        </button>
      )}
    </>
  );
};

export default ApplicationButtons;
