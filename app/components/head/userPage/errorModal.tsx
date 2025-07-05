"use client";

import React from "react";

interface ErrorModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ErrorModal({ message, isOpen, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
