'use client';

import React from 'react';

interface Props {
  username: string;
  email: string;
  phoneNumber: string;
  editingEmail: string;
  setEditingEmail: (v: string) => void;
  isEditingEmailField: boolean;
  setIsEditingEmailField: (v: boolean) => void;

  editingPhone: string;
  setEditingPhone: (v: string) => void;
  isEditingPhoneField: boolean;
  setIsEditingPhoneField: (v: boolean) => void;

  isEditingPasswordField: boolean;
  setIsEditingPasswordField: (v: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;

  activeSettingsTab: string;
  setActiveSettingsTab: (v: 'account' | 'notifications') => void;

  passwordError: string;
  setPasswordError: (v: string) => void; 
  phoneError: string;
  setPhoneError: (v: string) => void;
  settingsSuccess: string;
  setSettingsSuccess: (v: string) => void;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
  handleNotificationToggle: (type: 'sms' | 'email') => void;

  handleAccountSettingsUpdate: () => void;

  emailVerificationSent: boolean;
  userEnteredCode: string;
  setUserEnteredCode: (v: string) => void;
  sendVerificationCode: () => void;
  verifyEmailCode: () => void;
  sendSmsVerificationCode: () => void;
  verifySmsCode: () => void;
  smsVerificationSent: boolean;
}

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
}: Props) {
  return (
    <div className="px-6 py-4 rounded-lg mx-4 mb-4 transition duration-300">
      {/* Tabs */}
      <div className="relative overflow-hidden">
        {/* Account tab */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeSettingsTab === 'account'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full absolute top-0 left-0 w-full'
          }`}
        >
          <div className="space-y-4">
            {/* Username */}
            <div>
              <span className="text-sm text-gray-700">Username</span>
              <div className="text-base text-gray-900">{username}</div>
            </div>

            {/* Email */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Email Address</span>
                <button
                  onClick={() => {
                    setIsEditingEmailField(!isEditingEmailField);
                    if (isEditingEmailField) {
                      setEditingEmail(email);
                      setUserEnteredCode('');
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
                  {passwordError && passwordError.toLowerCase().includes('email') && (
                    <p className="text-sm text-red-600 mb-1 text-right">{passwordError}</p>
                  )}

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
                    Send Verification Code
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
                        Verify Code
                      </button>

                      {settingsSuccess.includes('Email verified') && (
                        <p className="text-green-600 text-sm mt-2">{settingsSuccess}</p>
                      )}
                      {passwordError.includes('Incorrect verification code') && (
                        <p className="text-red-600 text-sm mt-2">{passwordError}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Phone Number</span>
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
                    Send Verification Code
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
                        Verify Code
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Password */}
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
              <button
                onClick={handleAccountSettingsUpdate}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
