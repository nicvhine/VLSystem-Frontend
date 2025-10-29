'use client';

import { useEffect, useRef, useState } from 'react';
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
  const otpLength = 6;
  const otpRefs = useRef<Array<HTMLInputElement | null>>(Array.from({ length: 6 }, () => null));
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [borrowerId, setBorrowerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);

  // Header meta and navigation helpers
  const getStepMeta = () => {
    switch (step) {
      case 'role':
        return { title: 'Forgot Password', icon: (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5A4.5 4.5 0 0 0 7.5 7.5v3" />
            <rect x="5" y="10.5" width="14" height="10" rx="2" />
            <circle cx="12" cy="16" r="1.3" />
          </svg>
        ) };
      case 'account':
        return { title: 'Find your account', icon: (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            <circle cx="10" cy="10" r="6" />
          </svg>
        ) };
      // no 'method' step in this branch
      case 'otp':
        return { title: 'Verify code', icon: (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 9h2M11 9h2M15 9h2M7 13h2M11 13h2M15 13h2" />
          </svg>
        ) };
      case 'reset':
        return { title: 'Reset password', icon: (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V6a5 5 0 0 1 10 0v1" />
          </svg>
        ) };
      case 'staff':
        return { title: 'Staff password reset', icon: (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21a9 9 0 0 1 18 0" />
          </svg>
        ) };
      default:
        return { title: 'Forgot Password', icon: null };
    }
  };

  const goBack = () => {
    switch (step) {
      case 'role':
        setShowForgotModal(false);
        break;
      case 'account':
        setPendingStep('role');
        break;
      case 'otp':
        setPendingStep('account');
        break;
      case 'reset':
        setPendingStep('otp');
        break;
      case 'staff':
        setPendingStep('role');
        break;
      default:
        setShowForgotModal(false);
    }
  };

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
  // (state defined above)

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
    <>
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          message={successMsg}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <div
        className={`bg-white rounded-xl w-full p-0 text-black`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between mb-5`}> 
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 py-1"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="sr-only">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
              {getStepMeta().icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{getStepMeta().title}</h2>
          </div>
          <div className="w-6" />
        </div>
        {/* Step 0: Choose Role */}
        {step === 'role' && (
          <>
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

        {/* There is no separate method step on this branch */}
        {/* There is no separate method step on this branch */}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <>
            <div
              className="flex justify-between gap-2 mb-4"
              onPaste={(e) => {
                const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, otpLength);
                if (!pasted) return;
                e.preventDefault();
                const chars = pasted.split('');
                const nextOtp = Array.from({ length: otpLength }, (_, i) => chars[i] || '').join('');
                setOtp(nextOtp);
                // Fill inputs
                chars.forEach((ch, idx) => {
                  const input = otpRefs.current[idx];
                  if (input) input.value = ch;
                });
                const nextIndex = Math.min(chars.length, otpLength - 1);
                otpRefs.current[nextIndex]?.focus();
              }}
            >
              {Array.from({ length: otpLength }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={(e) => {
                    const current = e.currentTarget;
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      if (!current.value && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                      }
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value.slice(0, 1);
                    const otpArray = otp.split('').concat(Array(otpLength).fill('')).slice(0, otpLength);
                    otpArray[index] = e.target.value || '';
                    const nextOtp = otpArray.join('');
                    setOtp(nextOtp);
                    if (e.target.value && index < otpLength - 1) {
                      otpRefs.current[index + 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <button
              disabled={otp.length !== otpLength}
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
            <div className="relative mb-3">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.584 10.587A2 2 0 0 0 12 14a2 2 0 0 0 1.414-.586" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.49A9.53 9.53 0 0 1 12 4.25c5 0 9 4.75 9 7.75-.431 1.18-1.28 2.441-2.424 3.52M6.345 6.345C4.44 7.76 3 9.77 3 12c0 3 4 7.75 9 7.75 1.363 0 2.644-.324 3.793-.884" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7.75 10-7.75S22 12 22 12s-4 7.75-10 7.75S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3.25" />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirmPasswordField ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPasswordField((v) => !v)}
                aria-label={showConfirmPasswordField ? 'Hide password' : 'Show password'}
              >
                {showConfirmPasswordField ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.584 10.587A2 2 0 0 0 12 14a2 2 0 0 0 1.414-.586" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.49A9.53 9.53 0 0 1 12 4.25c5 0 9 4.75 9 7.75-.431 1.18-1.28 2.441-2.424 3.52M6.345 6.345C4.44 7.76 3 9.77 3 12c0 3 4 7.75 9 7.75 1.363 0 2.644-.324 3.793-.884" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7.75 10-7.75S22 12 22 12s-4 7.75-10 7.75S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3.25" />
                  </svg>
                )}
              </button>
            </div>
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
    </>
  );
}
