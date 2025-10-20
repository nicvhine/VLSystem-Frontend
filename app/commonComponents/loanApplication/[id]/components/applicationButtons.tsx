'use client';

import React, { useState, useRef } from "react";
import ConfirmModal from "../../../modals/confirmModal/ConfirmModal";
import { 
  handleClearedLoan, 
  handleDisburse, 
  handleDenyApplication, 
  handleApproveApplication, 
  handleDenyFromCleared 
} from "./statusHandler";
import { createPortal } from "react-dom";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";
import { ApplicationButtonsProps } from "@/app/commonComponents/utils/Types/components";

const ApplicationButtons: React.FC<ApplicationButtonsProps> = ({
  application,
  role,
  setApplications,
  authFetch,
  API_URL,
  setIsModalOpen,
  modalRef,
  setIsAgreementOpen,
  showSuccess,
  showError,
}) => {
  const [showDocsDropdown, setShowDocsDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const [showConfirm, setShowConfirm] = useState<{ type: 'approve' | 'deny' | 'disburse' | 'clear' | 'dismissPending' | null }>({ type: null });
  const [pendingAction, setPendingAction] = useState<() => Promise<void> | void>(() => () => {});
  const [isActing, setIsActing] = useState(false);

  if (!application) return null;

  const handleDocumentClick = (type: "loan" | "release") => {
    setIsAgreementOpen(type);
    setShowDocsDropdown(false);
  };

  const toggleDropdown = () => {
    if (!showDocsDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    setShowDocsDropdown(!showDocsDropdown);
  };

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
            onClick={() => handleDenyApplication(application, setApplications, authFetch, showSuccess, showError)}
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
            onClick={() => {
              setShowConfirm({ type: 'clear' });
              setPendingAction(() => () => handleClearedLoan(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            CLEAR
          </button>
          <button
            onClick={() => {
              setShowConfirm({ type: 'dismissPending' });
              setPendingAction(() => () => handleDenyFromCleared(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            DISMISS
          </button>
          <ConfirmModal
            show={showConfirm.type === 'clear'}
            applicationId={application.applicationId}
            status="Cleared"
            onConfirm={async () => {
              setShowConfirm({ type: null });
              try {
                setIsActing(true);
                await Promise.resolve(pendingAction());
              } finally {
                setIsActing(false);
              }
            }}
            onCancel={() => setShowConfirm({ type: null })}
          />
          <ConfirmModal
            show={showConfirm.type === 'dismissPending'}
            message="Do you want to dismiss this pending loan application?"
            onConfirm={async () => {
              setShowConfirm({ type: null });
              try {
                setIsActing(true);
                await Promise.resolve(pendingAction());
              } finally {
                setIsActing(false);
              }
            }}
            onCancel={() => setShowConfirm({ type: null })}
          />
        </>
      )}

      {application.status === "Cleared" && role === "manager" && (
        <>
          <button
            onClick={() => {
              setShowConfirm({ type: 'approve' });
              setPendingAction(() => () => handleApproveApplication(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            APPROVE
          </button>
          <button
            onClick={() => {
              setShowConfirm({ type: 'deny' });
              setPendingAction(() => () => handleDenyApplication(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            DENY
          </button>
      <ConfirmModal
        show={showConfirm.type === 'approve'}
        applicationId={application.applicationId}
        status="Approved"
        onConfirm={async () => {
          setShowConfirm({ type: null });
          try {
            setIsActing(true);
            await Promise.resolve(pendingAction());
          } finally {
            setIsActing(false);
          }
        }}
        onCancel={() => setShowConfirm({ type: null })}
      />
      <ConfirmModal
        show={showConfirm.type === 'deny'}
        message="Do you want to deny this loan application?"
        onConfirm={async () => {
          setShowConfirm({ type: null });
          try {
            setIsActing(true);
            await Promise.resolve(pendingAction());
          } finally {
            setIsActing(false);
          }
        }}
        onCancel={() => setShowConfirm({ type: null })}
      />
        </>
      )}

      {application.status === "Approved" && role === "loan officer" && (
        <>
          <button
            onClick={() => {
              setShowConfirm({ type: 'disburse' });
              setPendingAction(() => () => handleDisburse(application, setApplications, authFetch, setIsAgreementOpen, showSuccess, showError));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Disburse
          </button>
          <ConfirmModal
            show={showConfirm.type === 'disburse'}
            applicationId={application.applicationId}
            status="Disbursed"
            onConfirm={async () => {
              setShowConfirm({ type: null });
              try {
                setIsActing(true);
                await Promise.resolve(pendingAction());
              } finally {
                setIsActing(false);
              }
            }}
            onCancel={() => setShowConfirm({ type: null })}
          />
        </>
      )}

      {application.status === "Disbursed" && (
        <>
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Documents
          </button>

          {showDocsDropdown && dropdownPos && createPortal(
            <div
              className="w-40 bg-red-600 text-white shadow-lg border rounded-md z-50"
              style={{
                position: 'absolute',
                top: dropdownPos.top,
                left: dropdownPos.left
              }}
            >
              <button
                onClick={() => handleDocumentClick("loan")}
                className="w-full text-left px-4 py-2 hover:bg-red-700"
              >
                Loan Agreement
              </button>
              <button
                onClick={() => handleDocumentClick("release")}
                className="w-full text-left px-4 py-2 hover:bg-red-700"
              >
                Release Form
              </button>
            </div>,
            document.body
          )}
        </>
      )}
      <SubmitOverlayToast open={isActing} message="Processing action..." />
    </>
  );
};

export default ApplicationButtons;