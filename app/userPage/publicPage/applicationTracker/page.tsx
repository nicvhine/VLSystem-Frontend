"use client";

import { useEffect, useState } from "react";
import { ButtonContentLoading } from "@/app/commonComponents/utils/loading";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";
import { TrackModalProps } from "@/app/commonComponents/utils/Types/components";

const progressSteps = {
  en: ["Pending", "Endorsed", "Accepted"],
  ceb: ["Nagahulat", "Gipadala", "Gidawat"]
};

export default function TrackModal({ isOpen, onClose, language = 'en' }: TrackModalProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Animation timing on open/close
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      // Small delay to trigger animation after mount
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShowModal(false);
        setStatus(null);
        setApplicationId("");
        setShowErrorModal(false);
        setErrorMsg("");
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!showModal) return null;

  // Handle smooth close animation
  const handleClose = () => {
    if (isTracking) return; // prevent closing while processing
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  const handleTrack = async () => {
    if (!applicationId.trim()) {
      setErrorMsg(language === 'en' ? "Please enter a valid Application ID." : "Palihug isulod ang balidong Application ID.");
      setShowErrorModal(true);
      return;
    }

    try {
      setIsTracking(true);
      // API: fetch application status by ID
      const res = await fetch(`http://localhost:3001/loan-applications/${applicationId}`);
      if (!res.ok) {
        setStatus(null);
        setErrorMsg(language === 'en' ? "Application not found." : "Wala makita ang aplikasyon.");
        setShowErrorModal(true);
        return;
      }

      const data = await res.json();
      setStatus(data.status);
      setShowErrorModal(false);
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'en' ? "Something went wrong. Please try again later." : "Adunay problema. Palihug sulayi pag-usab.");
      setShowErrorModal(true);
    } finally {
      setIsTracking(false);
    }
  };

  const getProgress = () => {
    if (!status) return 0;
    switch (status) {
      case "Pending":
        return 1;
      case "On Hold":
        return 2;
      case "Accepted":
        return 3;
      case "Disbursed":
        return 4;
      default:
        return 1;
    }
  };

  if (!showModal) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        {/* Container */}
        <div
          className={`bg-white rounded-lg p-6 w-full max-w-md shadow-lg transition-all duration-150 relative ${
            animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            disabled={isTracking}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✖
          </button>
          <h2 className="text-xl font-semibold mb-1 text-black">
            {language === 'en' ? 'Track Application' : 'Subay ang Aplikasyon'}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            {language === 'en'
              ? 'Enter your Application ID to track your loan application status'
              : 'Isulod ang imong Application ID aron masubay ang status sa imong aplikasyon sa pahulam'}
          </p>
        <input
          type="text"
          placeholder={language === 'en' ? 'APPLICATION ID' : 'APPLICATION ID'}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 uppercase focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
        />
        <div className={`flex justify-center ${status ? 'mb-4' : 'mb-0'}`}>
          <button
            onClick={isTracking ? undefined : handleTrack}
            disabled={isTracking}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isTracking ? (
              <ButtonContentLoading label={language === 'en' ? 'Tracking...' : 'Nag-subay...'} />
            ) : (
              language === 'en' ? 'Track Application' : 'Subay ang Aplikasyon'
            )}
          </button>
        </div>
        {/* Progress */}
        {status && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {language === 'en' ? 'Application Status' : 'Status sa Aplikasyon'}
            </h3>
            <p className="text-center mb-6">
              {language === 'en' ? 'Current Status:' : 'Kasamtangang Status:'} <span className="text-red-600 font-semibold">{status}</span>
            </p>
            <div className="flex items-center justify-between gap-2">
              {progressSteps[language].map((step, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                      index < getProgress()
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index < getProgress() ? "✓" : index + 1}
                  </div>
                  <span className={`mt-2 text-xs text-center font-medium ${
                    index < getProgress() ? "text-red-600" : "text-gray-500"
                  }`}>
                    {step}
                  </span>
                  {index < progressSteps[language].length - 1 && (
                    <div className="absolute top-5 left-full w-full h-0.5 bg-gray-300 z-[-1]">
                      <div
                        className={`h-0.5 bg-red-600 transition-all duration-500 ${
                          index < getProgress() - 1 ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Shared error modal */}
      <ErrorModal
        isOpen={showErrorModal}
        message={errorMsg}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
