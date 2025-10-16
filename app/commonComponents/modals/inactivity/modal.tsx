'use client';

import { useEffect, useState } from 'react';

interface AreYouStillThereModalProps {
  countdown: number;
  onStay: () => void;
  onLogout: () => void;
}

/**
 * Dialog shown when inactivity timer is about to log the user out.
 * Matches the shared modal styling used across the app.
 */
export default function AreYouStillThereModal({ countdown, onStay, onLogout }: AreYouStillThereModalProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleClose = (action: () => void) => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      action();
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Are you still there?</h3>
        <p className="text-sm text-gray-600 mb-4">
          You have been inactive for a while. You will be logged out in <span className="font-semibold text-red-600">{countdown}</span> seconds.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            onClick={() => handleClose(onLogout)}
          >
            Logout Now
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => handleClose(onStay)}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}