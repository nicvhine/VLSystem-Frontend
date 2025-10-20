import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import useAccountSettings from './accountSettings';

export function useProfileDropdownLogic(
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [smsVerificationCode, setSmsVerificationCode] = useState('');
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsVerificationSent, setSmsVerificationSent] = useState(false);
  const [emailVerificationMessage, setEmailVerificationMessage] = useState('');


  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    phoneError,
    setPhoneError,
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAccountSettings();

  // Toggle account settings panel and reset related UI state
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setActiveSettingsTab('account');
    setPasswordError('');
    setPhoneError('');
    setSettingsSuccess('');
    setIsEditingEmailField(false);
    setIsEditingPasswordField(false);
  };

  // Clear session but keep language, set role to 'public', then return to login
  const handleLogout = () => {
    if (typeof window === 'undefined') return;

    const currentLang = localStorage.getItem('language') || 'en';

    localStorage.clear();

    localStorage.setItem('language', currentLang);
    localStorage.setItem('role', 'public');

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

  // Email verification: send + validate code
  // Send email verification code via EmailJS after basic validation
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: editingEmail }),
      });

      if (res.status === 409) {
        const data = await res.json();
        setPasswordError(data.error || 'Email already in use.');
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setEmailVerificationCode(code);
      setEmailVerified(false);

      const time = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

      const templateParams = {
        to_email: editingEmail,
        passcode: code,
        time,
      };

      const emailResponse = await emailjs.send(
        'service_37inqad',
        'template_ew6anbw',
        templateParams,
        'gVN8M0DfvDrD5_W2M'
      );

      if (emailResponse.status !== 200) {
        setPasswordError('Email not found or could not be sent.');
        return;
      }

      setEmailVerificationSent(true);
      setSettingsSuccess('Verification code sent to your new email.');
    } catch (error: any) {
      console.error('Failed to send email:', error);
      setPasswordError('Failed to send verification code.');
    }
  };

  // Check user-entered email code against the generated one
  const verifyEmailCode = () => {
    if (userEnteredCode === emailVerificationCode) {
      setEmailVerified(true);
      setPasswordError('');
      setSettingsSuccess('✔ Email verified.'); 
      setEmailVerificationMessage('✔ Email verified.'); 
    } else {
      setPasswordError('Incorrect verification code.');
      setEmailVerificationMessage('Incorrect verification code.');
    }
  };
  

  // SMS verification: send + validate code
  // Request an SMS code to be delivered to the provided phone number
  const sendSmsVerificationCode = async () => {
    if (!editingPhone || !editingPhone.trim()) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }

    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSmsVerificationCode(code);
      setSmsVerified(false);

      const response = await fetch('http://localhost:3001/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: editingPhone,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to send SMS:', data);
        setPhoneError('Failed to send verification code via SMS.');
        return;
      }

      setSmsVerificationSent(true);
      setSettingsSuccess('Verification code sent to your phone number.');
    } catch (error) {
      console.error('SMS Error:', error);
      setPhoneError('Could not send SMS verification.');
    }
  };

  // Validate SMS code
  const verifySmsCode = () => {
    if (userEnteredCode === smsVerificationCode) {
      setSmsVerified(true);
      setPhoneError('');
      setSettingsSuccess('✔ Phone number verified.');
    } else {
      setPhoneError('Incorrect verification code.');
    }
  };

  // Toggle notification preference and persist to localStorage
  const handleNotificationToggle = (type: 'sms' | 'email') => {
    const updatedPrefs = {
      ...notificationPreferences,
      [type]: !notificationPreferences[type],
    };
    setNotificationPreferences(updatedPrefs);
    localStorage.setItem('notificationPreferences', JSON.stringify(updatedPrefs));
  };

  // Persist email/phone/password changes to backend with validation
  const handleAccountSettingsUpdate = async () => {
    setPasswordError('');
    setPhoneError('');
    setSettingsSuccess('');

    const userId = localStorage.getItem('userId');

    try {
      // EMAIL UPDATE
      if (isEditingEmailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editingEmail)) {
          setPasswordError('Please enter a valid email address.');
          return;
        }

        if (!emailVerified) {
          setPasswordError('Please verify your new email before saving.');
          return;
        }

        const emailRes = await fetch(
          `http://localhost:3001/users/${userId}/update-email`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: editingEmail }),
          }
        );

        if (emailRes.status === 409) {
          const data = await emailRes.json();
          setPasswordError(data.error || 'Email already in use.');
          return;
        }

        if (!emailRes.ok) {
          throw new Error('Failed to update email.');
        }

        localStorage.setItem('email', editingEmail);

        setShowSuccessModal(true);
        setSettingsSuccess('✔ Email changed successfully.');
        setTimeout(() => setSettingsSuccess(''), 4000); // auto-hide after 4s
      }

      if (isEditingPhoneField) {
        const phoneRes = await fetch(
          `http://localhost:3001/users/${userId}/update-phoneNumber`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: editingPhone }),
          }
        );

        if (phoneRes.status === 409) {
          const data = await phoneRes.json();
          setPhoneError(data.error || 'Phone number already in use.');
          return;
        }

        if (!phoneRes.ok) {
          throw new Error('Failed to update phone number.');
        }

        localStorage.setItem('phoneNumber', editingPhone);
      }

      //Password update
      if (isEditingPasswordField && newPassword) {
        if (newPassword !== confirmPassword) {
          setPasswordError('New Password and Confirm Password do not match.');
          return;
        }

        try {
          const borrowersId = localStorage.getItem('borrowersId') || '';
          const userId = localStorage.getItem('userId') || '';
          const role = localStorage.getItem('role') || '';
          const token = localStorage.getItem('token') || '';

          let endpoint = '';
          let targetId = '';

          if (['loan officer', 'head', 'manager', 'collector'].includes(role?.toLowerCase() || '')) {
            endpoint = 'users';
            targetId = userId;
          } else if (role?.toLowerCase() === 'borrower') {
            endpoint = 'borrowers';
            targetId = borrowersId;
          } else {
            setPasswordError('Invalid account role.');
            return;
          }

          const passwordRes = await fetch(
            `http://localhost:3001/${endpoint}/${targetId}/change-password`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ currentPassword, newPassword }),
            }
          );

          if (!passwordRes.ok) {
            const data = await passwordRes.json();
            setPasswordError(data.message || 'Failed to update password.');
            return;
          }

          setSettingsSuccess('✔ Password updated successfully!');
          setTimeout(() => setSettingsSuccess(''), 4000);
        } catch (error) {
          console.error('Password update error:', error);
          setPasswordError('Server error. Please try again.');
        }
      }


      setIsEditingEmailField(false);
      setIsEditingPhoneField(false);
      setIsEditingPasswordField(false);
      setNewPassword('');
      setConfirmPassword('');

      if (!settingsSuccess) {
        setSettingsSuccess('Settings updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
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
    sendVerificationCode,
    verifyEmailCode,
    emailVerificationMessage,
    emailVerificationSent,
    userEnteredCode,
    setUserEnteredCode,
    sendSmsVerificationCode,
    verifySmsCode,
    smsVerificationSent,
    showSuccessModal,
    setShowSuccessModal,
  };
}
