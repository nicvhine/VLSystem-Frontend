'use client';

import Image from 'next/image';
import { useProfileDropdownLogic } from './dropdownLogic';
import ProfileSettingsPanel from './profileEditing';
import { useState, useEffect } from 'react';

interface ProfileDropdownProps {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profilePic: string;
  previewPic: string;
  isUploadingPic: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfilePic: () => void;
  handleCancelUpload: () => void;
}

export default function ProfileDropdown(props: ProfileDropdownProps) {
  const {
    name,
    email,
    phoneNumber,
    username,
    isEditing,
    setIsEditing,
    isDropdownOpen,
    setIsDropdownOpen,
    profilePic,
    previewPic,
    isUploadingPic,
    handleFileChange,
    handleSaveProfilePic,
    handleCancelUpload,
  } = props;

  const {
    currentPassword,
    setCurrentPassword,
    editingEmail,
    setEditingEmail,
    editingPhone,
    setEditingPhone,
    isEditingEmailField,
    setIsEditingEmailField,
    isEditingPhoneField,
    setIsEditingPhoneField,
    isEditingPasswordField,
    setIsEditingPasswordField,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    notificationPreferences,
    setNotificationPreferences,
    passwordError,
    setPasswordError,
    phoneError,
    setPhoneError,
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
    toggleEdit,
    handleNotificationToggle,
    handleAccountSettingsUpdate,
    handleLogout,
    emailVerificationSent,
    userEnteredCode,
    setUserEnteredCode,
    sendVerificationCode,
    verifyEmailCode,
    smsVerificationSent,
    sendSmsVerificationCode,
    verifySmsCode,
  } = useProfileDropdownLogic(setIsEditing);

const [darkMode, setDarkMode] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('darkMode') === 'true';
  }
  return false;
});

const handleSetDarkMode = (value: boolean) => {
  setDarkMode(value); 
  localStorage.setItem('darkMode', value.toString());
};


  return (
    <div className="relative">
      {isDropdownOpen && (
        <div
          className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl z-30 p-0 border transition-all ${
            darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'
          }`}
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center py-6">
            <div
              className="relative group w-16 h-16 rounded-full overflow-hidden ring-2 ring-red-900 cursor-pointer"
              onClick={() => document.getElementById('profileUpload')?.click()}
            >
              <Image
                src={previewPic || profilePic || '/idPic.jpg'}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition">
                Change
              </div>
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="font-semibold text-lg mt-2">{name}</div>
            <div className="text-gray-400 text-sm">{email}</div>

            {isUploadingPic && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveProfilePic}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelUpload}
                  className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col">
            {/* Settings Toggle */}
            <button
              className="flex items-center px-6 py-3 hover:bg-gray-100 hover:text-black dark:hover:text-black transition"
              onClick={toggleEdit}
            >
              Account Settings
            </button>

            {isEditing && (
              <ProfileSettingsPanel
                username={username}
                email={email}
                phoneNumber={phoneNumber}
                editingEmail={editingEmail}
                setEditingEmail={setEditingEmail}
                isEditingEmailField={isEditingEmailField}
                setIsEditingEmailField={setIsEditingEmailField}
                editingPhone={editingPhone}
                setEditingPhone={setEditingPhone}
                isEditingPhoneField={isEditingPhoneField}
                setIsEditingPhoneField={setIsEditingPhoneField}
                isEditingPasswordField={isEditingPasswordField}
                setIsEditingPasswordField={setIsEditingPasswordField}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                activeSettingsTab={activeSettingsTab}
                setActiveSettingsTab={setActiveSettingsTab}
                passwordError={passwordError}
                setPasswordError={setPasswordError}
                phoneError={phoneError}
                setPhoneError={setPhoneError}
                settingsSuccess={settingsSuccess}
                setSettingsSuccess={setSettingsSuccess}
                notificationPreferences={notificationPreferences}
                handleNotificationToggle={handleNotificationToggle}
                handleAccountSettingsUpdate={handleAccountSettingsUpdate}
                emailVerificationSent={emailVerificationSent}
                userEnteredCode={userEnteredCode}
                setUserEnteredCode={setUserEnteredCode}
                sendVerificationCode={sendVerificationCode}
                verifyEmailCode={verifyEmailCode}
                smsVerificationSent={smsVerificationSent}
                sendSmsVerificationCode={sendSmsVerificationCode}
                verifySmsCode={verifySmsCode}
                darkMode={darkMode}
                setDarkMode={handleSetDarkMode}
              />
            )}

            {/* Dark Mode Toggle */}
            <div  className="flex items-center px-6 py-3 justify-between hover:bg-gray-100 hover:text-black dark:hover:text-black transition">
              <span className="flex items-center">
                Dark Mode
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => handleSetDarkMode(!darkMode)}
                  className="sr-only"
                />
                <span
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-all duration-300 ease-in-out ${
                    darkMode ? 'bg-orange-500' : ''
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ease-in-out ${
                      darkMode ? 'translate-x-5' : ''
                    }`}
                  ></span>
                </span>
              </label>
            </div>

            {/* Logout */}
            <button
              className="flex items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-red-600"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          <div className="text-xs text-center text-gray-400 py-2">
            Privacy Policy · Terms of Service
          </div>
        </div>
      )}
    </div>
  );
}
