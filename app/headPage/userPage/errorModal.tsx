"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ErrorModal({ message, isOpen, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-t-4 border-red-500 relative animate-fadeIn">
        <div className="flex items-center mb-3 gap-2">
          <FiAlertCircle className="text-red-600 w-7 h-7" />
          <h2 className="text-xl font-bold text-red-600">Error</h2>
        </div>
        <div className="bg-red-50 rounded-lg px-4 py-3 mb-6">
          <p className="text-gray-800 text-base break-words whitespace-pre-line">{typeof message === 'string' && message.startsWith('{') ? JSON.parse(message).message : message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
