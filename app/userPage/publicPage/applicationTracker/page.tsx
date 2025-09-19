"use client";

import { useEffect, useState } from "react";

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const progressSteps = ["Pending", "Endorsed",  "Accepted"];

export default function TrackModal({ isOpen, onClose }: TrackModalProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Handle animation timing
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
        setError(null);
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
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  const handleTrack = async () => {
    if (!applicationId.trim()) {
      setError("Please enter a valid Application ID.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/loan-applications/${applicationId}`);
      if (!res.ok) {
        setStatus(null);
        setError("Application not found.");
        return;
      }

      const data = await res.json();
      setStatus(data.status);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
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
    <div 
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-xl w-full max-w-lg relative p-6 text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Track Application</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your Application ID to track your loan application status</p>
        <input
          type="text"
          placeholder="APPLICATION ID"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 uppercase focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
        />
        <div className="flex justify-center mb-4">
          <button
            onClick={handleTrack}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Track Application
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center mb-4">{error}</div>}

        {status && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Application Status
            </h3>
            <p className="text-center mb-6">
              Current Status: <span className="text-red-600 font-semibold">{status}</span>
            </p>
            <div className="flex items-center justify-between gap-2">
              {progressSteps.map((step, index) => (
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
                  {index < progressSteps.length - 1 && (
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
  );
}
