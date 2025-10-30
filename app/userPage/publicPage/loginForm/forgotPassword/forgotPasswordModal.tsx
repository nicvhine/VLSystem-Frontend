'use client';

import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import ConfirmModal from '@/app/commonComponents/modals/confirmModal';
import SuccessModal from '@/app/commonComponents/modals/successModal';

// Step components
import StepRole from './stepRole';
import StepAccount from './stepAccount';
import StepMethod from './stepMethod';
import StepOtp from './stepOtp';
import StepReset from './stepReset';

type Props = {
  forgotRole: string | null;
  setForgotRole: (role: string | null) => void;
  setShowForgotModal: (show: boolean) => void;
};

// Utility functions
const maskEmail = (email: string) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(0, name.length - 2))}@${domain}`;
};

const maskPhone = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{2})\d{5}(\d{2})/, '$1*****$2');
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpViaEmail = async (toEmail: string, otp: string) => {
  try {
    const expiry = new Date(Date.now() + 15 * 60000).toLocaleTimeString();
    await emailjs.send(
      'service_37inqad',
      'template_ew6anbw',
      { to_email: toEmail, passcode: otp, time: expiry },
      'gVN8M0DfvDrD5_W2M'
    );
  } catch (error) {
    console.error('EmailJS error:', error);
  }
};

export default function ForgotPasswordModal({ forgotRole, setForgotRole, setShowForgotModal }: Props) {
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
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'mobile'>('email');

  // Animate step changes
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

  // Search account
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
        setError(data.error || 'No account found with this email or username.');
        return;
      }
      setBorrower(data.borrower);
      setBorrowerId(data.borrower.id);
      setPendingStep('method');
    } catch {
      setError('Server error. Please try again.');
    }
  };

  // Send OTP
  const handleSendOtp = async (method: 'email' | 'mobile') => {
    setSelectedMethod(method);
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    if (method === 'email') await sendOtpViaEmail(borrower.email, newOtp);
    else console.log(`Would send OTP ${newOtp} to ${borrower.phoneNumber}`);
    setOtp('');
    setPendingStep('otp');
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError('');
    if (otp === generatedOtp) setPendingStep('reset');
    else setError('Invalid OTP. Please try again.');
  };

  // Reset password
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
      onClick={() => setShowForgotModal(false)} 
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
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'role' && <StepRole setPendingStep={setPendingStep} setShowForgotModal={setShowForgotModal} />}
        {step === 'account' && (
          <StepAccount
            usernameOrEmail={usernameOrEmail}
            setUsernameOrEmail={setUsernameOrEmail}
            error={error}
            handleSearchAccount={handleSearchAccount}
          />
        )}
        {step === 'method' && (
          borrower ? (
            <StepMethod
              borrower={borrower}
              maskEmail={maskEmail}
              maskPhone={maskPhone}
              handleSendOtp={handleSendOtp}
            />
          ) : (
            <p className="text-red-600 text-center">Unable to load account details.</p>
          )
        )}
        {step === 'otp' && (
          <StepOtp
            otp={otp}
            setOtp={setOtp}
            error={error}
            handleVerifyOtp={handleVerifyOtp}
            handleResendOtp={() => handleSendOtp(selectedMethod)}
          />
        )}
        {step === 'reset' && (
          <StepReset
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            error={error}
            setShowResetConfirm={setShowResetConfirm}
            showResetConfirm={showResetConfirm}
            doResetPassword={doResetPassword}
            resetLoading={resetLoading}
          />
        )}
      </div>
    </div>
  );
  
}
