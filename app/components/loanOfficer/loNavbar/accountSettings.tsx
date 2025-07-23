'use client';
import { useState, useEffect } from 'react';

export default function useAccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isEditingEmailField, setIsEditingEmailField] = useState(false);
  const [isEditingPasswordField, setIsEditingPasswordField] = useState(false);
  const [isEditingPhoneField, setIsEditingPhoneField] = useState(false);
  const [editingPhone, setEditingPhone] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'notifications'>('account');
  const [notificationPreferences, setNotificationPreferences] = useState({ sms: false, email: true });
  const [phoneError, setPhoneError] = useState('');

  return {
    isEditing, setIsEditing,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    passwordError, setPasswordError,
    settingsSuccess, setSettingsSuccess,
    editingEmail, setEditingEmail,
    currentPassword, setCurrentPassword,
    isEditingEmailField, setIsEditingEmailField,
    isEditingPasswordField, setIsEditingPasswordField,
    isEditingPhoneField, setIsEditingPhoneField,
    editingPhone, setEditingPhone,
    activeSettingsTab, setActiveSettingsTab,
    notificationPreferences, setNotificationPreferences,
    phoneError, setPhoneError,
  };
}