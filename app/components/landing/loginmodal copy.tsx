"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRole, setForgotRole] = useState<'borrower' | 'staff' | null>(null);  
  const [otp, setOtp] = useState('');
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen || showOtpModal ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen, showOtpModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'head' && password === 'head') {
      router.push('/head');
      onClose();
    } else if (username === 'manager' && password === 'manager') {
      router.push('/manager');
      onClose();
    } else if (username === 'loanofficer' && password === 'loanofficer') {
      router.push('/loanofficer');
      onClose();
    } else if (username === 'collector' && password === 'collector') {
      router.push('/collector');
      onClose();
    } else if (username === 'borrower' && password === 'borrower') {
      setShowOtpModal(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setShowOtpModal(false);
      onClose();
      router.push('/borrower');
    } else {
      alert('Invalid OTP');
    }
  };

  if (!isOpen && !showOtpModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>

        {showForgotModal && forgotRole === null && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
      <button
        onClick={() => setShowForgotModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        ✖
      </button>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Forgot Password</h2>
      <p className="text-sm text-gray-600 text-center mb-6">Select your role to proceed:</p>
      <div className="flex justify-around">
        <button
          onClick={() => {
            setShowForgotModal(false);
            setShowOtpModal(true);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Borrower
        </button>
        <button
          onClick={() => setForgotRole('staff')}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Staff
        </button>
      </div>
    </div>
  </div>
)}
{showForgotModal && forgotRole === 'staff' && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
      <button
        onClick={() => {
          setShowForgotModal(false);
          setForgotRole(null);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        ✖
      </button>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Staff Assistance</h2>
      <p className="text-sm text-gray-600 text-center">
        Please contact your system administrator to retrieve your username or reset your password.
      </p>
    </div>
  </div>
)}



        {showOtpModal ? (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">OTP Verification</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the 6-digit code sent to you.
            </p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className='flex justify-center '>
              <button
                type="submit"
                className="w-30 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Verify OTP
              </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Login to your VLSystem account
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 text-black focus:ring-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
             <p
              className="text-sm text-blue-600 hover:underline cursor-pointer text-center mb-4"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotRole(null);
                }}
              >
                Forgot Password or Username?
              </p>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-20 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Login
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
