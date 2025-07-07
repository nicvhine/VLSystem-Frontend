import { useState } from 'react';
import useAccountSettings from './accountSettings';

export function useProfileDropdownLogic(
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
)
 {
  const [currentPassword, setCurrentPassword] = useState('');

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
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    notificationPreferences,
    setNotificationPreferences,
    passwordError,
    setPasswordError,
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAccountSettings();

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setActiveSettingsTab('account');
    setPasswordError('');
    setSettingsSuccess('');
    setIsEditingEmailField(false);
    setIsEditingPasswordField(false);
  };

  const handleNotificationToggle = (type: 'sms' | 'email') => {
    const updatedPrefs = {
      ...notificationPreferences,
      [type]: !notificationPreferences[type],
    };
    setNotificationPreferences(updatedPrefs);
    localStorage.setItem('notificationPreferences', JSON.stringify(updatedPrefs));
  };

  const handleAccountSettingsUpdate = () => {
    setPasswordError('');
    setSettingsSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingEmail)) {
      setPasswordError('Please enter a valid email address.');
      return;
    }

    localStorage.setItem('email', editingEmail);
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    setSettingsSuccess('Settings updated successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  return {
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
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
    toggleEdit,
    handleNotificationToggle,
    handleAccountSettingsUpdate,
  };
}
