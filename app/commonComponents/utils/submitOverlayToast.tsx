"use client";

import React from "react";

interface SubmitOverlayToastProps {
  open: boolean;
  message?: string;
}

export default function SubmitOverlayToast({ open, message = "Processing..." }: SubmitOverlayToastProps) {
  if (!open) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="flex items-center gap-3 rounded-lg bg-white/95 shadow-xl border border-gray-200 px-4 py-3">
        <span
          className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-red-600"
          style={{ width: 20, height: 20 }}
        />
        <span className="text-sm text-gray-800 font-medium">{message}</span>
      </div>
    </div>
  );
}
