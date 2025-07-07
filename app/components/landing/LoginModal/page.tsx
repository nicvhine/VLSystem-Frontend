'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './loginForm';
import ForgotPasswordModal from './forgotPassword';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRole, setForgotRole] = useState<'borrower' | 'staff' | ''>('');
  const router = useRouter();

  if (!isOpen && !showForgotModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
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
          />
        )}
      </div>
    </div>
  );
}
