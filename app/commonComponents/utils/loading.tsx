"use client";

import React, { useEffect, useMemo, useState } from "react";

export function LoadingSpinner({ size = 5, className = "" }: { size?: number; className?: string }) {
  const dim = `${size * 4}px`;
  return (
    <span
      className={
        `inline-block animate-spin rounded-full border-2 border-gray-300 border-t-red-600 align-middle ${className}`
      }
      style={{ width: dim, height: dim }}
      aria-label="Loading"
      role="status"
    />
  );
}

export function ButtonContentLoading({ label = "Processing..." }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LoadingSpinner size={4} />
      <span>{label}</span>
    </span>
  );
}

// Animated three-dots cycle for subtle progress indication
export function DotsCycle({ speed = 300, className = "" }: { speed?: number; className?: string }) {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c % 3) + 1), speed);
    return () => clearInterval(id);
  }, [speed]);
  const dots = useMemo(() => ".".repeat(count), [count]);
  return <span aria-hidden className={className} style={{ width: "1.5ch", display: "inline-block" }}>{dots}</span>;
}

// Button content with animated dots instead of a spinner
export function ButtonDotsLoading({ label = "Processing", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span>{label}</span>
      <DotsCycle />
    </span>
  );
}

// Full-screen modal for multi-step submission progress
export function SubmitProgressModal({
  open,
  steps = ["Uploading documents", "Processing application", "Waiting for the server"],
  activeStep = 0,
  title = "Submitting Application",
  subtitle,
  blockDismiss = true,
  uploadProgress,
}: {
  open: boolean;
  steps?: string[];
  activeStep?: number;
  title?: string;
  subtitle?: string;
  blockDismiss?: boolean;
  uploadProgress?: number;
}) {
  // optional upload progress percentage (0-100) can be provided by the caller
  // note: kept as local prop by reading from rest args below via any type when passed
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(t);
    } else {
      setAnimateIn(false);
    }
  }, [open]);

  if (!open) return null;

  const current = steps[Math.min(Math.max(activeStep, 0), Math.max(steps.length - 1, 0))] || "Please wait...";
  const total = steps.length;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-200 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => { if (!blockDismiss) e.stopPropagation(); }}
      aria-modal
      role="dialog"
      aria-label={title}
    >
      <div
        className={`w-full max-w-md rounded-xl bg-white p-6 text-black shadow-2xl transition-all duration-200 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="mt-3 mb-4 rounded-md border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-800">
              {current}
              <DotsCycle className="ml-1 align-baseline" />
            </p>
            {total > 1 && (
              <span className="text-xs text-gray-500">Step {Math.min(activeStep + 1, total)} of {total}</span>
            )}
          </div>
        </div>

        {/* Upload progress bar (if provided) */}
        {activeStep === 1 && typeof uploadProgress === 'number' && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-1">Uploading: {uploadProgress}%</div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div className="h-2 bg-red-600 rounded" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {total > 1 && (
          <ol className="space-y-2 mb-4">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] border ${i < activeStep ? 'bg-green-50 border-green-200 text-green-600' : i === activeStep ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                >
                  {i < activeStep ? '✓' : i + 1}
                </span>
                <span className={`${i === activeStep ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{s}{i === activeStep && <DotsCycle className="ml-1" />}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-2 flex justify-end">
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-90"
            aria-busy
          >
            <ButtonDotsLoading label="Processing" />
          </button>
        </div>
      </div>
    </div>
  );
}
