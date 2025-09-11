'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  countdown: number;
  onStay: () => void;
  onLogout: () => void;
}

export default function AreYouStillThereModal({ countdown, onStay, onLogout }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Modal appears immediately when component mounts
    setIsVisible(true);
    // Small delay to trigger entrance animation
    setTimeout(() => setIsAnimating(true), 10);
  }, []);

  const handleModalAction = (action: () => void) => {
    setIsAnimating(false);
    setTimeout(() => {
      action();
      setIsVisible(false);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white rounded-lg p-6 shadow-lg text-center max-w-md w-full transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <h2 className="text-xl font-semibold mb-2">Are you still there?</h2>
        <p className="text-gray-600 mb-4">
          You will be logged out in <span className="font-bold text-red-600">{countdown}</span> seconds due to inactivity.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleModalAction(onStay)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Yes, I'm still here
          </button>
          <button
            onClick={() => handleModalAction(onLogout)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}
