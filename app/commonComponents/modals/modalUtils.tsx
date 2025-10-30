'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close modal"
      className="absolute top-2 right-2 p-1 text-gray-500 rounded-full hover:bg-gray-100"
    >
      <X className="w-2 h-2" />
    </button>
  );
}

export function useEscClose(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handler);
      }
    };
  }, [onClose]);
}

export default null;
