'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './loginForm';
import ForgotPasswordModal from './forgotPassword';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ceb';
}

export default function LoginModal({ isOpen, onClose, language = 'en' }: LoginModalProps) {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRole, setForgotRole] = useState<'borrower' | 'staff' | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const router = useRouter();

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      // Small delay to trigger animation after mount
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShowModal(false);
        setShowForgotModal(false);
        setForgotRole('');
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          onClick={() => {
            onClose();
            setShowForgotModal(false);
            setForgotRole('');
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>

        {showForgotModal ? (
          <ForgotPasswordModal forgotRole={forgotRole} setForgotRole={setForgotRole} setShowForgotModal={setShowForgotModal} />
        ) : (
          <LoginForm
            onClose={onClose}
            router={router}
            setShowForgotModal={setShowForgotModal}
            setForgotRole={setForgotRole}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
