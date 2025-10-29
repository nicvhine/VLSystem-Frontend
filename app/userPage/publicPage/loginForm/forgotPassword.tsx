'use client';

import { useState, useEffect } from 'react';
import ConfirmModal from '@/app/commonComponents/modals/confirmModal';
import SuccessModal from '@/app/commonComponents/modals/successModal';
import emailjs from 'emailjs-com';

type Props = {
  forgotRole: string | null;
  setForgotRole: (role: string | null) => void;
  setShowForgotModal: (show: boolean) => void;
};

// Utility functions to censor email and phone
const maskEmail = (email: string) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(0, name.length - 2))}@${domain}`;
};

const maskPhone = (phone: string) => {
  if (!phone) return '';
  // Keep first 2 and last 2 digits visible
  return phone.replace(/(\d{2})\d{5}(\d{2})/, '$1*****$2');
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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
  const [step, setStep] = useState<'role' | 'account' | 'method' | 'otp' | 'reset' | 'staff'>('role');
  const [animateIn, setAnimateIn] = useState(false);
  const [pendingStep, setPendingStep] = useState<typeof step | null>(null);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [borrower, setBorrower] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [borrowerId, setBorrowerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (pendingStep) {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setStep(pendingStep);
        setAnimateIn(true);
        setPendingStep(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pendingStep]);

  useEffect(() => setAnimateIn(true), []);

  // Step 1 → After "Continue": search account
  const handleSearchAccount = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:3001/borrowers/find-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: usernameOrEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Account not found.');
        return;
      }

      setBorrower(data.borrower);
      setBorrowerId(data.borrower.id);
      setPendingStep('method');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  // Step 2 → Send OTP to selected method
  const handleSendOtp = async (method: 'email' | 'mobile') => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    if (method === 'email') {
      await sendOtpViaEmail(borrower.email, newOtp);
    } else {
      console.log(`Would send OTP ${newOtp} to mobile ${borrower.phoneNumber}`);
    }

    setPendingStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) setPendingStep('reset');
    else setError('Invalid OTP. Please try again.');
  };

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
        setError(data.error || 'Password reset failed.');
        setResetLoading(false);
        return;
      }

      setSuccessMsg('Password reset successfully!');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowForgotModal(false);
      }, 3000);
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setResetLoading(false);
      setShowResetConfirm(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          message={successMsg}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <div
        className={`bg-white w-[400px] rounded-lg shadow-lg p-6 transform transition-all duration-300 ease-out ${
          animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
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

        {/* Step 1: Enter Email or Username */}
        {step === 'account' && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Find your account</h2>
            <p className="text-sm text-gray-600 mb-3">
              Enter your email address or username to continue.
            </p>
            <input
              type="text"
              placeholder="Email or Username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button
              disabled={!usernameOrEmail}
              onClick={handleSearchAccount}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {/* Step 2: Choose where to send OTP */}
        {step === 'method' && borrower && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Where should we send the OTP?
            </h2>
            <div className="space-y-3">
              {borrower.email && (
                <button
                  onClick={() => handleSendOtp('email')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Send to Email ({maskEmail(borrower.email)})
                </button>
              )}
              {borrower.phoneNumber && (
                <button
                  onClick={() => handleSendOtp('mobile')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Send to Mobile ({maskPhone(borrower.phoneNumber)})
                </button>
              )}
            </div>
          </>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Verify Code</h2>
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

        {/* Step 4: Reset Password */}
        {step === 'reset' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Reset Password</h2>
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
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              Reset Password
            </button>
            <ConfirmModal
              show={showResetConfirm}
              message="Are you sure you want to reset your password?"
              onConfirm={doResetPassword}
              onCancel={() => setShowResetConfirm(false)}
              loading={resetLoading}
            />
          </>
        )}

        {/* Step 5: Staff Notice */}
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
