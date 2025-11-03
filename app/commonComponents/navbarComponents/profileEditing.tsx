'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/app/commonComponents/modals/confirmModal';
import translations from '../translation';
import { ProfileEditingProps } from '../utils/Types/profileEditing';
import OTPModal from './otpModal';
import SuccessModal from '@/app/commonComponents/modals/successModal';
import ErrorModal from '@/app/commonComponents/modals/errorModal';
import SubmitOverlayToast from '@/app/commonComponents/utils/submitOverlayToast';

export default function ProfileSettingsPanel({
  username,
  email,
  phoneNumber,
  editingEmail,
  setEditingEmail,
  isEditingEmailField,
  setIsEditingEmailField,
  editingPhone,
  setEditingPhone,
  isEditingPhoneField,
  setIsEditingPhoneField,
  isEditingPasswordField,
  setIsEditingPasswordField,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  emailError,
  setEmailError,
  phoneError,
  setPhoneError,
  setSettingsSuccess,
  handleAccountSettingsUpdate,
  emailVerificationSent,
  setEmailVerificationSent,
  userEnteredCode,
  setUserEnteredCode,
  sendVerificationCode,
  verifyEmailCode,
  sendSmsVerificationCode,
  verifySmsCode,
  smsVerificationSent,
  emailVerified,
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

  // ✅ Only show OTP modal if verification is required
  useEffect(() => {
    if (emailVerificationSent && !emailVerified) {
      setShowOtpModal(true);
    }
  }, [emailVerificationSent, emailVerified]);

  // Handle OTP modal mount/unmount animations
  useEffect(() => {
    if (showOtpModal) {
      setOtpVisible(true);
      const t = setTimeout(() => setOtpAnimateIn(true), 10);
      return () => clearTimeout(t);
    }
    if (otpVisible) {
      setOtpAnimateIn(false);
      const t = setTimeout(() => setOtpVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [showOtpModal]);

  const t = translations.navbarTranslation[language];

  const handleSaveWithConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    await handleAccountSettingsUpdate();
    setLoading(false);
  };

  // Wrap OTP verify to show success/error modals and refresh on success
  const handleVerifyOtpAndNotify = async () => {
    const ok = await verifyEmailCode();
    if (ok) {
      setShowOtpModal(false);
      setModalMsg('Email verified and updated successfully.');
      setShowSuccessModal(true);
      // UI updates immediately via event; no hard refresh needed
    } else {
      const msg = emailError || 'Failed to verify the code. Please try again.';
      setModalMsg(msg);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <div className="px-6 py-4 rounded-lg mx-4 mb-4 transition duration-300 max-h-[70vh] overflow-y-auto">
        <div className="relative overflow-hidden">
          <div className="transition-all duration-300 ease-in-out opacity-100 translate-x-0">
            <div className="space-y-4">
              {/* Username */}
              <div>
                <span className="text-sm text-gray-700">{t.t10}</span>
                <div className="text-base text-gray-900">{username}</div>
              </div>

              {/* Email Section */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{t.t11}</span>
                  <button
                    onClick={() => {
                      setIsEditingEmailField(!isEditingEmailField);
                      if (isEditingEmailField) {
                        setEditingEmail(email);
                        setUserEnteredCode('');
                        setEmailError('');
                        setSettingsSuccess('');
                      }
                    }}
                    className="text-xs text-red-600 font-medium"
                  >
                    {isEditingEmailField ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}

                {!isEditingEmailField ? (
                  <span className="block text-base text-gray-900">{email}</span>
                ) : (
                  <>
                    <input
                      type="email"
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder={email}
                    />
                    <button
                      disabled={sendingCode}
                      onClick={async () => {
                        setEmailError('');

                        if (!editingEmail || !editingEmail.trim()) {
                          setEmailError("Please enter a valid email address.");
                          return;
                        }

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(editingEmail)) {
                          setEmailError("Invalid email format.");
                          return;
                        }

                        setSendingCode(true);
                        try {
                          await sendVerificationCode();
                        } finally {
                          setSendingCode(false);
                        }
                        // ✅ modal logic handled in useEffect
                      }}
                      className={`mt-2 px-3 py-1 text-sm rounded text-white ${sendingCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {sendingCode ? 'Sending…' : t.t12}
                    </button>
                  </>
                )}
              </div>

              {/* Phone Section */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{t.t14}</span>
                  <button
                    onClick={() => {
                      if (isEditingPhoneField) {
                        setPhoneError('');
                        setEditingPhone('');
                      }
                      setIsEditingPhoneField(!isEditingPhoneField);
                    }}
                    className="text-xs text-red-600 font-medium"
                  >
                    {isEditingPhoneField ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {phoneError && <p className="text-sm text-red-600 mb-2 text-right">{phoneError}</p>}

                {!isEditingPhoneField ? (
                  <span className="block text-base text-gray-900">{phoneNumber}</span>
                ) : (
                  <>
                    <input
                      type="tel"
                      value={editingPhone}
                      onChange={(e) => setEditingPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder={phoneNumber}
                    />
                    <button
                      onClick={sendSmsVerificationCode}
                      className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-blue-700"
                    >
                      {t.t12}
                    </button>
                  </>
                )}
              </div>

              {/* Password Section */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{t.t15}</span>
                  <button
                    onClick={() => setIsEditingPasswordField(!isEditingPasswordField)}
                    className="text-xs text-red-600 font-medium"
                  >
                    {isEditingPasswordField ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-600 mb-2 text-right">{passwordError}</p>
                )}

                {isEditingPasswordField ? (
                  <>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </>
                ) : (
                  <span className="block text-base text-gray-900">••••••••••</span>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-4">
                <button
                  disabled={loading}
                  onClick={() => setShowConfirm(true)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <ConfirmModal
          show={showConfirm}
          message="Are you sure you want to save changes?"
          onConfirm={() => { void handleSaveWithConfirm(); }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>

      {/* ✅ OTP Modal Overlay */}
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
          otp={userEnteredCode}
          setOtp={setUserEnteredCode}
          error={emailError}
          handleVerifyOtp={handleVerifyOtpAndNotify}
          handleResendOtp={async (): Promise<void> => {
            await sendVerificationCode();
          }}
        />
      </div>
    </div>,
    document.body
)}

      {/* Loading toast via portal at bottom-right of the page (outside modal) */}
      {typeof window !== 'undefined' && createPortal(
        <SubmitOverlayToast open={sendingCode} message="Sending verification code..." variant="info" />,
        document.body
      )}

      {/* Feedback toasts for OTP verify */}
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} message={modalMsg} onClose={() => setShowSuccessModal(false)} />
      )}
      {showErrorModal && (
        <ErrorModal isOpen={showErrorModal} message={modalMsg} onClose={() => setShowErrorModal(false)} />
      )}

    </>
  );
}
