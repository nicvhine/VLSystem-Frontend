'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ButtonContentLoading, LoadingSpinner } from "@/app/commonComponents/utils/loading";
import SuccessModal from "../successModal";
import ErrorModal from "../errorModal";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";
import emailjs from "emailjs-com";

const APPLICATION_URL = process.env.NEXT_PUBLIC_APPLICATION_URL
const USER_URL = process.env.NEXT_PUBLIC_USER_URL
const LOAN_URL = process.env.NEXT_PUBLIC_LOAN_URL
const BORROWER_URL = process.env.NEXT_PUBLIC_BORROWER_URL

// Interface for application data structure
interface Application {
  applicationId: string;
  appName: string;
  appEmail?: string | null;
  appLoanAmount?: number;
  appInterest?: number;
  appLoanTerms?: number;
  status?: string;
  borrowersId?: string;
  appContact: string;
  profilePic: string;
}

// Collector type
interface Collector {
  name: string;
  userId: string;
}

// Simple validators
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'`\-\.\s]{2,80}$/; // letters, spaces, hyphen, apostrophe, dot
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function validateName(name?: string | null): string | null {
  const n = (name || "").trim();
  if (!n) return "Name is required.";
  if (!NAME_REGEX.test(n)) return "Enter a valid full name (letters only).";
  // Require at least two words for better identity (optional, but helpful)
  if (n.split(/\s+/).length < 2) return "Please include at least first and last name.";
  return null;
}

function validateEmail(email?: string | null): { error: string | null; warning: string | null } {
  const e = (email || "").trim();
  if (!e) return { error: null, warning: "No email on file – credentials email will not be sent." };
  if (!EMAIL_REGEX.test(e)) return { error: "Email format looks invalid.", warning: null };
  return { error: null, warning: null };
}

// Send email helper
const sendEmail = async ({
  to_name,
  email,
  borrower_username,
  borrower_password,
  onError,
}: {
  to_name: string;
  email?: string | null;
  borrower_username: string;
  borrower_password: string;
  onError: (msg: string) => void;
}) => {
  if (!email) return;
  try {
    const result = await emailjs.send(
      "service_c1qaot4",
      "template_gqc0n98",
      { to_name, email, borrower_username, borrower_password },
      "oo7hIZjduEzSoqCY9"
    );
    console.log("Email sent:", result?.text || result);
  } catch (error: any) {
    console.error("EmailJS error:", error);
    onError("Email failed: " + (error?.text || error.message || "Unknown error"));
  }
};

export default forwardRef(function AccountModal(_, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingCollectors, setIsFetchingCollectors] = useState(false);
  const [collectorsError, setCollectorsError] = useState<string | null>(null);

  // Derived field validations
  const nameError = validateName(selectedApp?.appName);
  const { error: emailError, warning: emailWarning } = validateEmail(selectedApp?.appEmail);

  // Expose openModal to parent
  useImperativeHandle(ref, () => ({
    openModal(app: Application) {
      setSelectedApp(app);
      setSelectedCollectorId("");
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    },
  }));

  // Prevent closing via Escape while processing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible && !isProcessing) handleModalClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, isProcessing]);

  const handleModalClose = () => {
    if (isProcessing) return;
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setSelectedApp(null);
      setSelectedCollectorId("");
    }, 150);
  };

  // Fetch helper with token
  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    return fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
  }

  // Load collectors
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        setCollectorsError(null);
        setIsFetchingCollectors(true);
        const res = await authFetch(`${USER_URL}/collectors`);
        if (!res.ok) {
          let msg = "Failed to fetch collectors";
          try {
            const d = await res.json();
            msg = d?.error || msg;
          } catch {}
          throw new Error(msg);
        }

        // Expect backend to return { name, userId } array
        const data: Collector[] = await res.json();
        setCollectors(Array.isArray(data) ? data : []);
        if (!Array.isArray(data) || data.length === 0) setCollectorsError("No collectors available.");
      } catch (error: any) {
        console.error("Error fetching collectors:", error);
        setCollectors([]);
        setCollectorsError(error?.message || "Unable to load collectors.");
      } finally {
        setIsFetchingCollectors(false);
      }
    };

    fetchCollectors();
  }, []);


  const handleCreateAccount = async (isReloan: boolean = false) => {
    if (!selectedApp) return;

    // Cross-check validations
    if (nameError) {
      setErrorMessage(nameError);
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 5000);
      return;
    }

    if (emailError) {
      setErrorMessage(emailError);
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 5000);
      return;
    }

    if (!selectedCollectorId && !isReloan) {
      setErrorMessage("Please select a collector.");
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 5000);
      return;
    }

    const selectedCollector = collectors.find(c => c.userId === selectedCollectorId);

    try {
      setIsProcessing(true);

      if (isReloan) {
        if (!selectedApp.borrowersId) throw new Error("Borrower ID missing for reloan");

        // 1. Deactivate old loans
        const deactivateRes = await authFetch(`${LOAN_URL}/reloan/${selectedApp.applicationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        let deactivateErr: string | null = null;
        if (!deactivateRes.ok) {
          try {
            const deactivateData = await deactivateRes.json();
            deactivateErr = deactivateData?.error || null;
          } catch {}
          throw new Error(deactivateErr || "Failed to deactivate old loans");
        }

        // 2. Generate new loan
        const loanResponse = await authFetch(
          `${LOAN_URL}/generate-loan/${selectedApp.applicationId}`,
          { method: "POST" }
        );
        if (!loanResponse.ok) {
          let msg = "Failed to generate new loan";
          try { const d = await loanResponse.json(); msg = d?.error || msg; } catch {}
          throw new Error(msg);
        }

        // 3. Update borrower details based on the newest approved reloan
        const updateBorrowerRes = await authFetch(
          `${BORROWER_URL}/${selectedApp.borrowersId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: selectedApp.appName, 
              email: selectedApp.appEmail, 
              phoneNumber: selectedApp.appContact, 
              profilePic: selectedApp.profilePic, 
            }),
          }
        );
        if (!updateBorrowerRes.ok) {
          let msg = "Failed to update borrower details";
          try { const d = await updateBorrowerRes.json(); msg = d?.error || msg; } catch {}
          throw new Error(msg);
        }

        setSuccessMessage("Reloan generated successfully.");
      } else {
        // Create borrower account
        const borrowerRes = await authFetch(`${BORROWER_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedApp.appName,
            role: "borrower",
            applicationId: selectedApp.applicationId,
            assignedCollector: selectedCollector?.name || "",
            assignedCollectorId: selectedCollector?.userId || "",
          }),
        });
        let borrowerData: any = null;
        try { borrowerData = await borrowerRes.json(); } catch {}
        if (!borrowerRes.ok) {
          // Map common errors
          const baseMsg = borrowerData?.error || "Failed to create borrower account";
          const mapped =
            borrowerRes.status === 409
              ? "An account already exists for this borrower or application."
              : borrowerRes.status === 400 || borrowerRes.status === 422
              ? baseMsg
              : baseMsg;
          throw new Error(mapped);
        }

        // Set application status active
        const appRes = await authFetch(`${APPLICATION_URL}/${selectedApp.applicationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Active" }),
        });
        if (!appRes.ok) {
          let msg = "Failed to update application status";
          try { const errData = await appRes.json(); msg = errData?.error || msg; } catch {}
          throw new Error(msg);
        }

        // Generate new loan
        const loanResponse = await authFetch(
          `${LOAN_URL}/generate-loan/${selectedApp.applicationId}`,
          { method: "POST" }
        );
        if (!loanResponse.ok) {
          let msg = "Failed to generate loan";
          try { const d = await loanResponse.json(); msg = d?.error || msg; } catch {}
          throw new Error(msg);
        }

        console.log("Sending email to:", selectedApp.appEmail);
        await sendEmail({
          to_name: selectedApp.appName,
          email: selectedApp.appEmail,
          borrower_username: borrowerData.borrower.username,
          borrower_password: borrowerData.tempPassword,
          onError: (msg: string) => {
            console.error("Email error callback:", msg);
            setErrorMessage(msg);
            setErrorOpen(true);
            setTimeout(() => setErrorOpen(false), 5000);
          },
        });

        setSuccessMessage("Account created and loan generated successfully.");
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        handleModalClose();
      }, 5000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(`Error: ${error.message}`);
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <SubmitOverlayToast open={isProcessing} message="Processing action..." />
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white rounded-lg p-6 w-full max-w-md shadow-lg transition-all duration-150 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <h2 className="text-xl font-semibold text-black mb-2">Create Account</h2>
            <button
              onClick={handleModalClose}
              className={`absolute top-3 right-3 p-2 text-gray-500 rounded-full ${isProcessing ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-100'}`}
              disabled={isProcessing}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">Assign a collector and generate borrower credentials.</p>

          {/* Applicant summary + validations */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base text-black font-medium truncate" title={selectedApp?.appName || ''}>{selectedApp?.appName}</p>
                {nameError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{nameError}</p>
                )}
                <p className="text-sm text-gray-700 mt-1">
                  {selectedApp?.appEmail ? (
                    <>
                      <span className="font-medium">Email:</span> {selectedApp.appEmail}
                    </>
                  ) : (
                    <span className="italic text-gray-500">No email provided</span>
                  )}
                </p>
                {emailError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{emailError}</p>
                )}
                {!emailError && emailWarning && (
                  <p className="text-xs text-amber-600 mt-1" role="status">{emailWarning}</p>
                )}
              </div>
            </div>
          </div>

          {!selectedApp?.borrowersId && (
            <>
              <label className="block text-sm font-medium text-black mb-2">Assign Collector</label>
              <div className="relative">
                <select
                  value={selectedCollectorId}
                  onChange={(e) => setSelectedCollectorId(e.target.value)}
                  disabled={isFetchingCollectors || isProcessing}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-black disabled:bg-gray-100 disabled:text-gray-500"
                  aria-invalid={!selectedCollectorId}
                >
                  <option value="">
                    {isFetchingCollectors ? "Loading collectors..." : "Select a collector"}
                  </option>
                  {collectors.map((c) => (
                    <option key={c.userId} value={c.userId}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {isFetchingCollectors && <span className="absolute right-2 top-1/2 -translate-y-1/2"><LoadingSpinner size={4} /></span>}
                {collectorsError && !isFetchingCollectors && (
                  <p className="text-xs text-red-600 mt-2" role="alert">{collectorsError}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleModalClose}
              disabled={isProcessing}
            >
              Cancel
            </button>

            {!selectedApp?.borrowersId && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => handleCreateAccount(false)}
                disabled={
                  isProcessing ||
                  !!nameError ||
                  !!emailError ||
                  !selectedCollectorId
                }
                aria-disabled={
                  isProcessing ||
                  !!nameError ||
                  !!emailError ||
                  !selectedCollectorId
                }
              >
                {isProcessing ? <ButtonContentLoading label="Processing..." /> : "Create Account"}
              </button>
            )}

            {selectedApp?.borrowersId && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => handleCreateAccount(true)}
                disabled={isProcessing || !!nameError || !!emailError}
              >
                {isProcessing ? <ButtonContentLoading label="Processing..." /> : "Generate Reloan"}
              </button>
            )}
          </div>
        </div>
      </div>

      <SuccessModal isOpen={successOpen} message={successMessage} onClose={() => setSuccessOpen(false)} />
      <ErrorModal isOpen={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
});
