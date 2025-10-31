'use client';

import React, { useState, useEffect } from "react";

interface Props {
  onClose: () => void;
  onGenerate: (reason: string) => void;
}

export default function EndorseInputModal({ onClose, onGenerate }: Props) {
  const [reason, setReason] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  const isValid = reason.trim().length > 0;

  useEffect(() => {
    // fade in animation
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (isValid) onGenerate(reason.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 p-6 ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Endorse for Closure
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Please provide a reason for endorsing this account for closure.
        </p>

        {/* Textarea */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Enter reason for closure..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Character count */}
        <div className="text-right text-xs text-gray-400 mt-1">
          {reason.trim().length} / 500
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 rounded-md text-white font-medium transition ${
              isValid
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
