'use client';

import React, { useState, useRef } from "react";
import ConfirmModal from "../../../modals/confirmModal";
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
  a,
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

  const statusMessage = (status: string) =>
    a.cm2
      .replace("{id}", application.applicationId)
      .replace("{status}", status);

  return (
    <>
      {application.status === "Applied" && role === "loan officer" && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
          >
            {a.b1}
          </button>
          <button
            onClick={() => handleDenyApplication(application, setApplications, authFetch, showSuccess, showError)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {a.b2}
          </button>
        </>
      )}

      {application.status === "Disbursed" && role === "manager" && (
        <button
          onClick={() => modalRef.current?.openModal(application)}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
        >
          {application.isReloan ? a.b6 : a.b7}
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
            {a.b3}
          </button>
          <button
            onClick={() => {
              setShowConfirm({ type: 'dismissPending' });
              setPendingAction(() => () => handleDenyFromCleared(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {a.b2}
          </button>
          <ConfirmModal
            show={showConfirm.type === 'clear'}
            message={statusMessage("Cleared")}
            title={a.cm1}
            confirmLabel={a.cm6}
            cancelLabel={a.cm7}
            processingLabel={a.cm5}
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
            message={a.cm3}
            title={a.cm1}
            confirmLabel={a.cm6}
            cancelLabel={a.cm7}
            processingLabel={a.cm5}
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
            {a.b8}
          </button>
          <button
            onClick={() => {
              setShowConfirm({ type: 'deny' });
              setPendingAction(() => () => handleDenyApplication(application, setApplications, authFetch, showSuccess, showError));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {a.b9}
          </button>
      <ConfirmModal
        show={showConfirm.type === 'approve'}
        message={statusMessage("Approved")}
        title={a.cm1}
        confirmLabel={a.cm6}
        cancelLabel={a.cm7}
        processingLabel={a.cm5}
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
        message={a.cm4}
        title={a.cm1}
        confirmLabel={a.cm6}
        cancelLabel={a.cm7}
        processingLabel={a.cm5}
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
            {a.b4}
          </button>
          <ConfirmModal
            show={showConfirm.type === 'disburse'}
            message={statusMessage("Disbursed")}
            title={a.cm1}
            confirmLabel={a.cm6}
            cancelLabel={a.cm7}
            processingLabel={a.cm5}
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

      {(application.status === "Disbursed" || application.status === "Active") && (
        <>
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {a.b5}
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
                {a.b10}
              </button>
              <button
                onClick={() => handleDocumentClick("release")}
                className="w-full text-left px-4 py-2 hover:bg-red-700"
              >
                {a.b11}
              </button>
            </div>,
            document.body
          )}
        </>
      )}

      <SubmitOverlayToast open={isActing} message={a.to1} />
    </>
  );
};

export default ApplicationButtons;