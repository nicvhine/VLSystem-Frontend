"use client";

import React from "react";

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
