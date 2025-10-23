'use client';

import React, { useState, useEffect } from 'react';
import ConfirmModal from '@/app/commonComponents/modals/confirmModal/ConfirmModal';
import translations from '../translation';
import { ProfileEditingProps } from '../utils/Types/profileEditing';

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
  activeSettingsTab,
  setActiveSettingsTab,
  passwordError,
  setPasswordError,
  phoneError,
  setPhoneError,
  settingsSuccess,
  setSettingsSuccess,
  notificationPreferences,
  handleNotificationToggle,
  handleAccountSettingsUpdate,
  emailVerificationSent,
  userEnteredCode,
  setUserEnteredCode,
  sendVerificationCode,
  verifyEmailCode,
  sendSmsVerificationCode,
  verifySmsCode,
  smsVerificationSent,
}: ProfileEditingProps) {
  
  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  // Listen for language changes based on active role
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if ((role === "head" && event.detail.userType === 'head') || 
          (role === "loan officer" && event.detail.userType === 'loanOfficer') ||
          (role === "manager" && event.detail.userType === 'manager')) {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, [role]);

  const t = translations.navbarTranslation[language];

  // Wrapped save handler
  const handleSaveWithConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    await handleAccountSettingsUpdate();
    setLoading(false);
  };

  return (
    <div className={`px-6 py-4 rounded-lg mx-4 mb-4 transition duration-300 max-h-[70vh] overflow-y-auto`}>
      <div className="relative overflow-hidden">
        {/* Account tab (only) */}
        <div className={`transition-all duration-300 ease-in-out opacity-100 translate-x-0`}> 
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-700">{t.t10}</span>
              <div className="text-base text-gray-900">{username}</div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{t.t11}</span>
                <button
                  onClick={() => {
                    setIsEditingEmailField(!isEditingEmailField);
                    if (isEditingEmailField) {
                      setEditingEmail(email); 
                      setUserEnteredCode(""); 
                      setPasswordError('');
                        setSettingsSuccess('');
                    }
                  }}
                  className="text-xs text-red-600 font-medium"
                >
                  {isEditingEmailField ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!isEditingEmailField ? (
                <span className="block text-base text-gray-900">{email || 'No email set'}</span>
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
                    onClick={sendVerificationCode}
                    className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-blue-700"
                  >
                    {t.t12}
                  </button>

                  {emailVerificationSent && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={userEnteredCode}
                        onChange={(e) => setUserEnteredCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={verifyEmailCode}
                        className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {t.t13}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

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

                {phoneError && (
                  <p className="text-sm text-red-600 mb-2 text-right">{phoneError}</p>
                )}

              {!isEditingPhoneField ? (
                <span className="block text-base text-gray-900">
                  {phoneNumber}
                </span>
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

                   {smsVerificationSent && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={userEnteredCode}
                        onChange={(e) => setUserEnteredCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={verifySmsCode}
                        className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {t.t13}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Password</span>
                <button
                  onClick={() => setIsEditingPasswordField(!isEditingPasswordField)}
                  className="text-xs text-red-600 font-medium"
                >
                  {isEditingPasswordField ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {/* Password error message positioned above password fields */}
              {passwordError && (
                <p className="text-sm text-red-600 mb-2">{passwordError}</p>
              )}
              
              {isEditingPasswordField && (
                <div className="space-y-2">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Current password"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="New password"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Confirm password"
                  />
                </div>
              )}
            </div>

            {(isEditingEmailField || isEditingPhoneField || isEditingPasswordField) && (
              <>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg"
                >
                  {t.t15}
                </button>
                <ConfirmModal
                  show={showConfirm}
                  message={"Are you sure you want to save these changes to your account?"}
                  onConfirm={handleSaveWithConfirm}
                  onCancel={() => setShowConfirm(false)}
                  loading={loading}
                />
              </>
            )}
          </div>
        </div>
        {/* Notifications removed - only Account is supported */}
      </div>
    </div>
  );
}