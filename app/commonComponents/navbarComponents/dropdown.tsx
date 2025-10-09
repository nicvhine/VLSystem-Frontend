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
  role: string;
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
    role,
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

  // Get dropdown logic
  const {
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
    currentPassword,
    setCurrentPassword,
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

  return (
    <div className="relative">
      <div
        className={`bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-2xl w-96 mt-3 p-0 mr-4 relative transition-all duration-300 ease-out transform
          ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
        style={{ position: "fixed", top: "4rem", right: 0, zIndex: 9999 }}
        aria-hidden={!isDropdownOpen}
      >
      
  <div className="flex flex-col items-center pt-7 pb-4 gap-1">
    <div
      className="relative group w-20 h-20 rounded-full overflow-hidden ring-2 ring-red-900 cursor-pointer hover:ring-4 transition-all flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-2xl"
      onClick={() => document.getElementById('profileUpload')?.click()}
    >
      {previewPic || profilePic ? (
        <Image
          src={previewPic || profilePic}
          alt="Profile"
          width={80}
          height={80}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{name ? name.charAt(0).toUpperCase() : "U"}</span>
      )}

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

          <div className="font-semibold text-lg text-center">{name}</div>
          <div className="text-gray-400 text-sm text-center m-0">{email}</div>
          <div className="text-red-600 text-xs font-medium text-center mt-1 uppercase tracking-wide">
            {role === 'borrower' ? 'Borrower' : 
             role === 'head' ? 'Head' :
             role === 'manager' ? 'Manager' :
             role === 'loan officer' ? 'Loan Officer' :
             role === 'collector' ? 'Collector' : role}
          </div>
          {isUploadingPic && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveProfilePic}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
              >Save</button>
              <button
                onClick={handleCancelUpload}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 transition"
              >Cancel</button>
            </div>
          )}
        </div>
        {/* Action Buttons */}
  <div className="flex flex-col gap-0.5 px-6 pb-2">
          {/* Settings Toggle */}
          <button
            className="flex items-center w-full px-2 py-3 font-medium text-left hover:bg-gray-100 hover:text-black transition rounded-lg"
            onClick={toggleEdit}
          >
            <span>Account Settings</span>
          </button>
          {/* Expandable Account Settings */}
          <div
            className={`transition-all duration-300 overflow-hidden bg-gray-50 rounded-lg ${isEditing ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}
            style={{ transitionProperty: 'max-height, opacity, margin-top' }}
          >
            <div className="pt-3 pb-0 px-4">
              <div className="mb-2 flex justify-center items-center pt-2">
                <p className="text-xs text-gray-500 m-0 text-center w-full">Manage your email, phone, and password</p>
              </div>
              <div className="h-px w-full bg-gray-200 mb-1" />
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
                // darkMode and setDarkMode not available from logic, removed
              />
            </div>
          </div>
          {/* Logout */}
          <button
            className="flex items-center w-full px-2 py-3 text-red-600 hover:bg-gray-100 transition rounded-lg"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
  <div className="text-xs text-center text-gray-400 py-2 border-t border-gray-100 mt-0.5">
          Privacy Policy · Terms of Service
        </div>
      </div>
    </div>
  );
}
