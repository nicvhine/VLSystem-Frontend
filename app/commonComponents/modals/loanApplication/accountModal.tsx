'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ButtonContentLoading } from "@/app/commonComponents/utils/loading";
import SuccessModal from "../../modals/successModal/modal";
import ErrorModal from "../../modals/errorModal/modal";
import emailjs from "emailjs-com";

// API endpoint for loan applications
const API_URL = "http://localhost:3001/loan-applications";

// Interface for application data structure
interface Application {
  applicationId: string;
  appName: string;
  appEmail?: string | null;
  appLoanAmount?: number;
  appInterest?: number;
  appLoanTerms?: number;
  status?: string;
}

/**
 * Send borrower credentials via EmailJS service
 * Attempts to send email with generated username and password
 * @param to_name - Recipient's name
 * @param email - Recipient's email address
 * @param borrower_username - Generated username for borrower
 * @param borrower_password - Generated password for borrower
 * @returns Promise that resolves when email is sent
 */
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
      "service_eph6uoe",
      "template_tjkad0u",
      { to_name, email, borrower_username, borrower_password },
      "-PgL14MSf1VScXI94"
    );
    console.log("Email sent:", result?.text || result);
  } catch (error: any) {
    console.error("EmailJS error:", error);
    onError("Email failed: " + (error?.text || error.message || "Unknown error"));
  }
};

// Modal to create borrower account, assign collector and generate loan
export default forwardRef(function AccountModal(_, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [collectors, setCollectors] = useState<string[]>([]);
  const [selectedCollector, setSelectedCollector] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState<string>(""); 
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Expose openModal to parent via ref
  useImperativeHandle(ref, () => ({
    openModal(app: Application) {
      setSelectedApp(app);
      setGeneratedUsername(""); 
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    },
  }));

  // Close modal with animation and reset selection
  const handleModalClose = () => {
    if (isProcessing) return; // prevent closing while processing
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setSelectedApp(null);
      setSelectedCollector("");
      setGeneratedUsername("");
    }, 150);
  };

  // Helper: fetch with Authorization header from localStorage
  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found in localStorage");
    return fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
  }

  // Load available collectors for assignment
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const res = await authFetch("http://localhost:3001/users/collectors");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCollectors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching collectors:", error);
      }
    };
    fetchCollectors();
  }, []);

  // Create borrower, activate application, generate loan, and email credentials
  const handleCreateAccount = async () => {
    if (!selectedApp) return;
    if (!selectedCollector) {
      setErrorMessage("Please select a collector.");
      setErrorOpen(true);
      setTimeout(() => setErrorOpen(false), 5000);
      return;
    }

    try {
      setIsProcessing(true);
      const borrowerRes = await authFetch("http://localhost:3001/borrowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedApp.appName,
          role: "borrower",
          applicationId: selectedApp.applicationId,
          assignedCollector: selectedCollector,
        }),
      });

      const borrowerData = await borrowerRes.json();
      if (!borrowerRes.ok) throw new Error(borrowerData?.error);

      setGeneratedUsername(borrowerData.borrower.username);

      await authFetch(`${API_URL}/${selectedApp.applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" }),
      });

      const loanResponse = await fetch(`http://localhost:3001/loans/generate-loan/${selectedApp.applicationId}`, {
        method: "POST",
      });
      const loanData = await loanResponse.json();
      if (!loanResponse.ok) throw new Error(loanData?.error);

      await sendEmail({
        to_name: selectedApp.appName,
        email: selectedApp.appEmail,
        borrower_username: borrowerData.borrower.username,
        borrower_password: borrowerData.tempPassword,
        onError: (msg: string) => {
          setErrorMessage(msg);
          setErrorOpen(true);
          setTimeout(() => setErrorOpen(false), 5000);
        }
      });

      setSuccessMessage("Account created and loan generated successfully.");
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
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleModalClose}
      >
        <div
          className={`bg-white rounded-lg p-6 w-full max-w-md shadow-lg transition-all duration-150 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-1 text-black">Create Account</h2>
          <p className="text-sm text-gray-600 mb-3">Assign a collector and generate borrower credentials.</p>
          <p className="mb-2 text-black">
            <strong>Name:</strong> {selectedApp?.appName}
          </p>
          <label className="block text-sm font-medium text-black mb-1">Assign Collector:</label>
          <select
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-black"
          >
            <option value="">Select a collector</option>
            {collectors.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleModalClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleCreateAccount}
              disabled={isProcessing}
            >
              {isProcessing ? <ButtonContentLoading label="Processing..." /> : "Create Account"}
            </button>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={successOpen} message={successMessage} onClose={() => setSuccessOpen(false)} />
      <ErrorModal isOpen={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
});
