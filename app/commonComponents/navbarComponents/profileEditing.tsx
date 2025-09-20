'use client';

import React from 'react';
import { useState, useEffect } from 'react';

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
     <div className={`px-6 py-4 rounded-lg mx-4 mb-4 transition duration-300`}>
    {/* Tab switch buttons */}
      <div className="flex mb-4 bg-white rounded-lg p-1 relative overflow-hidden">
        <div
          className={`absolute top-1 h-8 bg-red-600 rounded-md transition-all duration-300 ease-in-out ${ 
            activeSettingsTab === 'account'
              ? 'left-1 w-[calc(50%-4px)]'
              : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
          }`}
        />
        <button
          onClick={() => setActiveSettingsTab('account')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium relative z-10 transition-colors duration-300 ${
            activeSettingsTab === 'account' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveSettingsTab('notifications')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium relative z-10 transition-colors duration-300 ${
            activeSettingsTab === 'notifications' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Notifications
        </button>
      </div>

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
            <div>
              <span className="text-sm text-gray-700">Username</span>
              <div className="text-base text-gray-900">{username}</div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Email Address</span>
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

              {/* Error message moved here - right after Email Address label */}
              {passwordError && (
                <p className="text-sm text-red-600 mb-2 text-right">{passwordError}</p>
              )}
      

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
                    </div>
                  )}
                </>
              )}
            </div>

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

        {/* Notification tab */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeSettingsTab === 'notifications'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-full absolute top-0 left-0 w-full'
          }`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Notification Preferences
              </h4>
              <div className="space-y-4">
                {/* Email Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                      <p className="text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.email}
                      onChange={() => handleNotificationToggle('email')}
                      className="sr-only"
                    />
                    <span className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                      notificationPreferences.email ? 'bg-red-600' : ''
                    }`}>
                      <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        notificationPreferences.email ? 'translate-x-5' : ''
                      }`}></span>
                    </span>
                  </label>
                </div>

                {/* SMS Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                      <p className="text-xs text-gray-500">Receive notifications via text message</p>
                    </div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.sms}
                      onChange={() => handleNotificationToggle('sms')}
                      className="sr-only"
                    />
                    <span className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                      notificationPreferences.sms ? 'bg-red-600' : ''
                    }`}>
                      <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        notificationPreferences.sms ? 'translate-x-5' : ''
                      }`}></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}