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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem] relative text-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-sm text-gray-600 mb-2">Enter your Application ID</h2>
        <input
          type="text"
          placeholder="APPLICATION ID"
          className="w-full p-2 border rounded mb-2 uppercase"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
        />
        <div className="flex justify-center mb-2">
          <button
            onClick={handleTrack}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Track
          </button>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {status && (
          <div className="mt-6">
            <h3 className="text-gray-700 font-semibold mb-4 text-center">
              Current Status: <span className="text-red-600">{status}</span>
            </h3>
            <div className="flex items-center justify-between gap-2">
              {progressSteps.map((step, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                      index < getProgress()
                        ? "bg-red-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-1 text-sm text-center">{step}</span>
                  {index < progressSteps.length - 1 && (
                    <div className="absolute top-4 left-full w-full h-1 bg-gray-300 z-[-1]">
                      <div
                        className={`h-1 bg-red-600 transition-all duration-500 ${
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
