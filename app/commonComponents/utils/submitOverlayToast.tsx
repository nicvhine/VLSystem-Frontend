"use client";

import React, { useEffect, useState } from "react";

interface SubmitOverlayToastProps {
  label?: string;
}

// Small, unobtrusive bottom-right toast with a full-screen transparent intercept
// Blocks interactions while keeping page content fully visible
export default function SubmitOverlayToast({ label = "Submitting..." }: SubmitOverlayToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Transparent overlay (non-intercepting) to keep layout consistent but allow scroll and clicks */}
      <div className="fixed inset-0 z-[100] bg-transparent pointer-events-none" aria-hidden="true" />
      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 z-[110] transition-all duration-150 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white/95 px-4 py-3 shadow-lg">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
      </div>
    </>
  );
}
