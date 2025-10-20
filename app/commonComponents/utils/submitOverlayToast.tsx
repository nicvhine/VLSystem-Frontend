"use client";

import React from "react";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";

interface SubmitOverlayToastProps {
  open: boolean;
  message?: string;
}

export default function SubmitOverlayToast({ open, message = "Processing..." }: SubmitOverlayToastProps) {
  if (!open) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="flex items-center gap-3 rounded-lg bg-white/95 shadow-xl border border-gray-200 px-4 py-3">
        <LoadingSpinner size={5} />
        <span className="text-sm text-gray-800 font-medium">{message}</span>
      </div>
    </div>
  );
}
