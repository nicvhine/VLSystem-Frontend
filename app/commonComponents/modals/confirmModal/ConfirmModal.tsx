"use client";

import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  show: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  applicationId?: string;
  status?: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  show,
  message,
  onConfirm,
  onCancel,
  loading = false,
  applicationId,
  status,
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  const modalContent = (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <h2 className="text-lg font-semibold mb-4 text-center">Confirmation</h2>
        <p className="mb-6 text-center">
          {applicationId && status
            ? `Are you sure you want to set the status for loan application ${applicationId} to ${status}?`
            : message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default ConfirmModal;
