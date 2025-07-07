'use client';
import React from 'react';

interface Props {
  countdown: number;
  onStay: () => void;
  onLogout: () => void;
}

export default function AreYouStillThereModal({ countdown, onStay, onLogout }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Are you still there?</h2>
        <p className="text-gray-600 mb-4">
          You will be logged out in <span className="font-bold text-red-600">{countdown}</span> seconds due to inactivity.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onStay}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Yes, I'm still here
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}
