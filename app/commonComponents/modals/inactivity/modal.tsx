'use client';

import { useEffect, useState } from 'react';

type Props = {
  modalTimeout: number;
  onStay: () => void;
  onLogout: () => void;
};

export default function AreYouStillThereModal({ modalTimeout, onStay, onLogout }: Props) {
  const [countdown, setCountdown] = useState(modalTimeout / 1000);

  useEffect(() => {
    let remaining = modalTimeout / 1000;

    const tick = () => {
      setCountdown(remaining);
      if (remaining <= 0) {
        onLogout();
        return;
      }
      remaining -= 1;
      setTimeout(tick, 1000);
    };

    tick();
  }, [modalTimeout, onLogout]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Are you still there?</h3>
        <p className="text-sm text-gray-600 mb-4">
          You will be logged out in <span className="font-semibold text-red-600">{countdown}</span> seconds.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            onClick={onLogout}
          >
            Logout Now
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={onStay}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
