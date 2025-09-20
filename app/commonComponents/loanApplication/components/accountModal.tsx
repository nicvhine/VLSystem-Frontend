"use client";

import React from "react";

interface AccountModalProps {
  isVisible: boolean;
  isAnimating: boolean;
  selectedApp: { appName: string } | null;
  generatedUsername: string;
  collectors: string[];
  selectedCollector: string;
  setSelectedCollector: (value: string) => void;
  handleModalClose: () => void;
  handleCreateAccount: () => void;
}

export default function AccountModal({
  isVisible,
  isAnimating,
  selectedApp,
  generatedUsername,
  collectors,
  selectedCollector,
  setSelectedCollector,
  handleModalClose,
  handleCreateAccount,
}: AccountModalProps) {
  if (!isVisible || !selectedApp) return null;

  return (
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
        <h2 className="text-xl font-semibold mb-4 text-black">
          Create Account
        </h2>
        <p className="mb-2 text-black">
          <strong>Name:</strong> {selectedApp.appName}
        </p>
        <p className="mb-4 text-black">
          <strong>Generated Username:</strong>{" "}
          <span className="text-red-600">{generatedUsername}</span>
        </p>

        <label className="block text-sm font-medium text-black mb-1">
          Assign Collector:
        </label>
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
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            onClick={handleModalClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
