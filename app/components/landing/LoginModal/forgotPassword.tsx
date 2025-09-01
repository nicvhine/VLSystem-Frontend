'use client';

import { useState } from 'react';
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
  const [step, setStep] = useState<'account' | 'otp' | 'reset'>('account');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [borrowerId, setBorrowerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Step 1: Check username + email with backend
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

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3001/borrowers/reset-password/${borrowerId}`, {
        method: 'PUT',  // must be PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Password reset failed.');
        return;
      }
  
      alert('Password reset successfully!');
      setShowForgotModal(false);
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-lg shadow-lg p-6">
        {/* Step 1: Enter username + email */}
        {step === 'account' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
