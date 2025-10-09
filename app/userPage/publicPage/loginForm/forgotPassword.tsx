'use client';

import { useState, useEffect } from 'react';
import ConfirmModal from '@/app/commonComponents/modals/confirmModal/ConfirmModal';
import SuccessModal from '@/app/commonComponents/modals/successModal/modal';
import emailjs from 'emailjs-com';

type Props = {
  forgotRole: string | null;
  setForgotRole: (role: string | null) => void;
  setShowForgotModal: (show: boolean) => void;
};

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via EmailJS
const sendOtpViaEmail = async (toEmail: string, otp: string) => {
  try {
    const expiry = new Date(Date.now() + 15 * 60000).toLocaleTimeString(); 

    await emailjs.send(
      'service_37inqad', 
      'template_ew6anbw', 
      {
        to_email: toEmail,
        passcode: otp,    
        time: expiry,      
      },
      'gVN8M0DfvDrD5_W2M'
    );
  } catch (error) {
    console.error('EmailJS error:', error);
  }
};
export default function ForgotPasswordModal({
  forgotRole,
  setForgotRole,
  setShowForgotModal,
}: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [step, setStep] = useState<'role' | 'account' | 'otp' | 'reset' | 'staff'>('role');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [borrowerId, setBorrowerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Animation for step transitions
  const [pendingStep, setPendingStep] = useState<typeof step | null>(null);
  useEffect(() => {
    if (pendingStep) {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setStep(pendingStep);
        setAnimateIn(true);
        setPendingStep(null);
      }, 250); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [pendingStep]);
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  const handleAccountSubmit = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:3001/borrowers/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Account not found or email does not match.');
        return;
      }

      setBorrowerId(data.borrowersId);

      // Generate OTP & send email
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      await sendOtpViaEmail(email, newOtp);

      setStep('otp');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep('reset');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  // Confirmation modal state for password reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Step 3: Reset Password
  const doResetPassword = async () => {
    setError('');
    setResetLoading(true);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setResetLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/borrowers/reset-password/${borrowerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Password reset failed.');
        setResetLoading(false);
        return;
      }
      setSuccessMsg('Password reset successfully!');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowForgotModal(false);
      }, 3000);
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setResetLoading(false);
      setShowResetConfirm(false);
    }
  };

  const handleResetPassword = () => {
    setShowResetConfirm(true);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} message={successMsg} onClose={() => setShowSuccessModal(false)} />
      )}
      <div className={`bg-white w-[400px] rounded-lg shadow-lg p-6 transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        
        {/* Step 0: Choose Role */}
        {step === 'role' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Forgot Password
            </h2>
            <button
              onClick={() => setPendingStep('account')}
              className="w-full px-4 py-2 mb-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              I am a Borrower
            </button>
            <button
              onClick={() => setPendingStep('staff')}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              I am a Staff
            </button>
          </>
        )}

      {/* Step 1: Enter username + email */}
        {step === 'account' && (
          <>
            <div className="flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Forgot Password
            </h2>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <button
              disabled={!username || !email}
              onClick={handleAccountSubmit}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              Send OTP
            </button>
          </>
        )}


        {/* Step 2: OTP */}
        {step === 'otp' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Verify Code
            </h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <button
              disabled={!otp}
              onClick={handleVerifyOtp}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              Verify
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Reset Password
            </h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <button
              disabled={!newPassword || !confirmPassword}
              onClick={handleResetPassword}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              Reset Password
            </button>
            <ConfirmModal
              show={showResetConfirm}
              message={"Are you sure you want to reset your password?"}
              onConfirm={doResetPassword}
              onCancel={() => setShowResetConfirm(false)}
              loading={resetLoading}
            />
          </>
        )}

        {/* ✅ Step 4: Staff Info */}
        {step === 'staff' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Staff Password Reset
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Please contact your administrator to change your password.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
