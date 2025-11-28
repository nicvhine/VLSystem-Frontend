'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import translations from '../translation';
import { ProfileEditingProps } from '../utils/Types/profileEditing';
import OTPModal from './otpModal';
import SuccessModal from '@/app/commonComponents/modals/successModal';
import ErrorModal from '@/app/commonComponents/modals/errorModal';
import SubmitOverlayToast from '@/app/commonComponents/utils/submitOverlayToast';
import ConfirmModal from '../modals/confirmModal';

function PasswordInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="bg-gray-100 border text-sm border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-red-600 outline-none transition w-full"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

export default function ProfileSettingsPanel({
  username,
  email,
  phoneNumber,
  editingEmail,
  setEditingEmail,
  editingPhone,
  setEditingPhone,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  emailError,
  setEmailError,
  phoneError,
  setPhoneError,
  setSettingsSuccess,
  handleAccountSettingsUpdate,
  emailVerificationSent,
  setEmailVerificationSent,
  smsVerificationSent,
  enteredEmailCode,
  setEnteredEmailCode,
  enteredSmsCode,
  setEnteredSmsCode,
  sendEmailCode,
  verifyEmailCode,
  sendSmsCode,
  verifySmsCode,
  emailVerified,
  setIsEditingPasswordField,
}: ProfileEditingProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpAnimateIn, setOtpAnimateIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const router = useRouter();
  const [sendingCode, setSendingCode] = useState(false);
  const [otpType, setOtpType] = useState<'email' | 'sms' | null>(null);

  // Initialize language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
      const keyMap: Record<string, string> = {
        head: "headLanguage",
        "loan officer": "loanOfficerLanguage",
        manager: "managerLanguage",
        borrower: "language",
        sysad: "language",
      };
      const langKey = keyMap[storedRole || ""] as keyof typeof keyMap || "language";
      const storedLanguage = (localStorage.getItem(langKey) as "en" | "ceb") || (localStorage.getItem('language') as "en" | "ceb") || "en";
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const validRoles = ["borrower", "head", "loan officer", "manager", "sysad"];
      if (validRoles.includes(role || "") && event.detail.language) {
        setLanguage(event.detail.language as "en" | "ceb");
      }
    };
    const onStorage = () => {
      const l = localStorage.getItem('language');
      if (l === 'en' || l === 'ceb') setLanguage(l);
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [role]);

  // OTP modal handling
  useEffect(() => {
    if ((emailVerificationSent && !emailVerified) || smsVerificationSent) {
      setShowOtpModal(true);
    }
  }, [emailVerificationSent, emailVerified, smsVerificationSent]);

  useEffect(() => {
    if (showOtpModal) {
      setOtpVisible(true);
      const t = setTimeout(() => setOtpAnimateIn(true), 10);
      return () => clearTimeout(t);
    }
    if (otpVisible && !showOtpModal) {
      setOtpAnimateIn(false);
      const t = setTimeout(() => setOtpVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [showOtpModal]);

  const t = translations.navbarTranslation[language];

  const handleVerifyOtpAndNotify = async () => {
    if (enteredEmailCode.length !== 6) {
      setEmailError("Please enter the verification code."); 
      return;
    }
    try {
      const ok = await verifyEmailCode();
      if (ok) {
        setShowOtpModal(false);
        setModalMsg('Email verified and updated successfully.');
        setShowSuccessModal(true);
        setEnteredEmailCode('');
        setEmailVerificationSent(false);
      } else {
        setModalMsg(emailError || 'Failed to verify the code.');
        setShowErrorModal(true);
      }
    } catch {
      setModalMsg('An error occurred while verifying OTP.');
      setShowErrorModal(true);
    }
  };
  
  const handleSaveWithConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    await handleAccountSettingsUpdate();
    setLoading(false);
  };


  return (
    <>
      <div className="max-w-2xl mx-auto p-2 space-y-2">

        {/* USERNAME */}
        <div className=" p-2 rounded-xl shadow-md">
          <p className="text-xs text-gray-500">Username</p>
          <p className="text-gray-900 text-sm">{username}</p>
        </div>

        {/* EMAIL */}
        <div className=" p-2 rounded-xl shadow-md">
          <p className="text-xs text-gray-500 mb-1">Email</p>
          {emailError && <p className="text-xs text-red-500 mb-1">{emailError}</p>}
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={editingEmail}
              onChange={(e) => setEditingEmail(e.target.value)}
              placeholder={email}
              className="bg-gray-100 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 outline-none transition text-sm"
            />
            {editingEmail.trim() !== '' && (
              <button
                disabled={sendingCode}
                onClick={async () => {
                  setOtpType('email');
                  setEmailError('');
                  setSendingCode(true);
                  try { await sendEmailCode(); } finally { setSendingCode(false); }
                }}
                className={`text-red-600 rounded-lg p-2 text-xs transition   disabled:cursor-not-allowed`}
              >
                {sendingCode ? 'Sending…' : 'Send Verification Code'}
              </button>
            )}
          </div>
        </div>

         {/* PHONE */}
        <div className=" p-2 rounded-xl shadow-md">
          <p className="text-xs text-gray-500 mb-1">Phone</p>
          {phoneError && <p className="text-xs text-red-500 mb-1">{phoneError}</p>}
          <div className="flex flex-col gap-2">
            <input
              type="tel"
              value={editingPhone}
              onChange={(e) => setEditingPhone(e.target.value)}
              placeholder={phoneNumber}
              className="bg-gray-100 border border-gray-300 text-sm rounded-lg p-2 focus:ring-2 focus:ring-red-600 outline-none transition"
            />
            {editingPhone.trim() !== '' && (
              <button
                disabled={sendingCode}
                onClick={async () => {
                  setOtpType('sms');
                  setPhoneError('');
                  setSendingCode(true);
                  try { await sendSmsCode(); } finally { setSendingCode(false); }
                }}
                className={`text-red-600 rounded-lg p-2 text-xs transition   disabled:cursor-not-allowed`}
              >
                {sendingCode ? 'Sending…' : 'Send Verification Code'}
              </button>
            )}
          </div>
        </div>
        
        {/* PASSWORD */}
        <div className="p-2 rounded-xl shadow-md">
  <p className="text-xs text-gray-500 mb-1">Password</p>
  {passwordError && <p className="text-xs text-red-500 mb-1">{passwordError}</p>}
  <div className="flex flex-col gap-2 relative">
    <PasswordInput
    label="Current Password"
    value={currentPassword}
    onChange={(v) => {
      setCurrentPassword(v);
      setIsEditingPasswordField(true);
    }}
  />
  <PasswordInput
    label="New Password"
    value={newPassword}
    onChange={(v) => {
      setNewPassword(v);
      setIsEditingPasswordField(true);
    }}
  />
  <PasswordInput
    label="Confirm Password"
    value={confirmPassword}
    onChange={(v) => {
      setConfirmPassword(v);
      setIsEditingPasswordField(true);
    }}
  />
          {/* Always render button, disable if not all fields filled */}
          <div className="flex justify-end mt-3">
          <button
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white text-xs rounded-lg px-6 py-2 hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          </div>
        </div>
      </div>

      <ConfirmModal
          show={showConfirm}
          message={t.t33}
          onConfirm={() => { void handleSaveWithConfirm(); }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>

      {/* OTP Modal */}
      {otpVisible &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] transition-opacity duration-300 ${otpAnimateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 relative transform transition-all duration-300 ease-out ${otpAnimateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <OTPModal
                otp={otpType === 'email' ? enteredEmailCode : enteredSmsCode}
                setOtp={(code) => {
                  if (otpType === 'email') setEnteredEmailCode(code);
                  else setEnteredSmsCode(code);
                  if (otpType === 'email') setEmailError('');
                  else setPhoneError('');
                }}
                error={otpType === 'email' ? emailError : phoneError}
                handleVerifyOtp={otpType === 'email' ? handleVerifyOtpAndNotify : async () => { await verifySmsCode(); }}
                handleResendOtp={otpType === 'email' ? async () => await sendEmailCode() : async () => await sendSmsCode()}
              />
            </div>
          </div>,
          document.body
        )}

      {/* Loading Toast */}
      {typeof window !== 'undefined' && createPortal(
        <SubmitOverlayToast open={sendingCode} message="Sending verification code..." variant="info" />,
        document.body
      )}

      {/* Success / Error Modals */}
      {showSuccessModal && <SuccessModal isOpen={showSuccessModal} message={modalMsg} onClose={() => setShowSuccessModal(false)} />}
      {showErrorModal && <ErrorModal isOpen={showErrorModal} message={modalMsg} onClose={() => setShowErrorModal(false)} />}
    </>
  );
}
