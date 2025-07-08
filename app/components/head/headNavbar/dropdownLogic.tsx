import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

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

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('fullName');
  localStorage.removeItem('borrowersId');
  localStorage.removeItem('collectorName');
  localStorage.removeItem('forcePasswordChange');
  localStorage.removeItem('profilePic');

  window.location.href = '/';
};

useEffect(() => {
  setEmailVerified(false);
  setEmailVerificationSent(false);
  setUserEnteredCode('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (editingEmail && emailRegex.test(editingEmail)) {
    setPasswordError('');
  }
}, [editingEmail]);



  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  
const sendVerificationCode = async () => {
  if (!editingEmail || !editingEmail.trim()) {
    setPasswordError('Please enter a valid email address.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editingEmail)) {
    setPasswordError('Invalid email format.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/users/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: editingEmail }),
    });

    if (res.status === 409) {
      const data = await res.json();
      setPasswordError(data.error || 'Email already in use.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerificationCode(code);
    setEmailVerificationSent(true);
    setEmailVerified(false);

    const time = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    const templateParams = {
      to_email: editingEmail,
      passcode: code,
      time,
    };

    await emailjs.send(
      'service_37inqad',
      'template_ew6anbw',
      templateParams,
      'gVN8M0DfvDrD5_W2M'
    );

    setSettingsSuccess('Verification code sent to your new email.');
  } catch (error) {
    console.error('Failed to send email:', error);
    setPasswordError('Failed to send verification code.');
  }
};


const verifyEmailCode = () => {
  if (userEnteredCode === emailVerificationCode) {
    setEmailVerified(true);
    setPasswordError('');
    setSettingsSuccess('✔ Email verified.');
    } else {
    setPasswordError('Incorrect verification code.');
  }
};

  const handleNotificationToggle = (type: 'sms' | 'email') => {
    const updatedPrefs = {
      ...notificationPreferences,
      [type]: !notificationPreferences[type],
    };
    setNotificationPreferences(updatedPrefs);
    localStorage.setItem('notificationPreferences', JSON.stringify(updatedPrefs));
  };

 const handleAccountSettingsUpdate = async () => {
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

  if (!emailVerified) {
    setPasswordError('Please verify your new email before saving.');
    return;
  }

  try {
    const userId = localStorage.getItem('userId');
    const res = await fetch(`http://localhost:3001/users/${userId}/update-email`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: editingEmail }),
    });

    if (res.status === 409) {
      const data = await res.json();
      setPasswordError(data.error || 'Email already in use.');
      return;
    }

    if (!res.ok) {
      throw new Error('Failed to update email.');
    }

    localStorage.setItem('email', editingEmail);
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    setSettingsSuccess('Settings updated successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  } catch (error) {
    console.error('Error updating account settings:', error);
    setPasswordError('Failed to update account settings.');
  }
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
    handleLogout,
    sendVerificationCode,
    verifyEmailCode,
    emailVerificationSent,
    userEnteredCode,
    setUserEnteredCode,
  };
}
