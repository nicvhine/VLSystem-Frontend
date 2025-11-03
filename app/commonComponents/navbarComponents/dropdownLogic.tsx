import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import useAccountSettings from './accountSettings';

export function useProfileDropdownLogic(
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setShowOtpModal: React.Dispatch<React.SetStateAction<boolean>> 

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
    emailError,
    setEmailError,
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAccountSettings();

  // Toggle account settings panel
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setActiveSettingsTab('account');
    setPasswordError('');
    setPhoneError('');
    setEmailError('');
    setSettingsSuccess('');
    setIsEditingEmailField(false);
    setIsEditingPasswordField(false);
  };

  // Logout handler
  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    const currentLang = localStorage.getItem('language') || 'en';
    localStorage.clear();
    localStorage.setItem('language', currentLang);
    localStorage.setItem('role', 'public');
    window.location.href = '/';
  };

  // Clear email states when changing
  useEffect(() => {
    setEmailVerified(false);
    setUserEnteredCode('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailError && editingEmail && !editingEmail.includes(" ")) {
      setEmailError("");
    }
  }, [editingEmail]);

  // Send verification code
  const sendVerificationCode = async (): Promise<void> => {
    setEmailError(""); 
  
    if (!editingEmail || !editingEmail.trim()) {
      setEmailError("Please enter a valid email address.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingEmail)) {
      setEmailError("Invalid email format.");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3001/users/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editingEmail }),
      });
  
      const data = await res.json();
  
      if (res.status === 409) {
        setEmailError(data.error || "Email already in use.");
        setEmailVerificationSent(false);
        return;
      }
  
      if (!res.ok) {
        setEmailError(data.error || "Failed to check email availability.");
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
        "service_eph6uoe",
        "template_nucwh85",
        templateParams,
        "-PgL14MSf1VScXI94"
      );
  
      if (emailResponse.status !== 200) {
        setEmailError("Failed to send email verification.");
        return;
      }
  
      setEmailError("");
      setEmailVerificationSent(true);
      setSettingsSuccess("Verification code sent to your new email.");
      setUserEnteredCode("");
    } catch (error) {
      console.error("Failed to send verification:", error);
      setEmailError("Network error. Please try again.");
    }
  };

  // Verify code
  const verifyEmailCode = async (otpInput?: string): Promise<boolean> => {
    const codeToCheck = otpInput ?? userEnteredCode;
  
    if (!codeToCheck) {
      setEmailError("Please enter the verification code.");
      return false;
    }
  
    if (codeToCheck !== emailVerificationCode) {
      setEmailError("Incorrect verification code. Please try again.");
      return false;
    }
  
    // Mark email as verified
    setEmailVerified(true);
    setEmailVerificationSent(false);
    setSettingsSuccess("Email verified successfully!");
    setUserEnteredCode('');
  
    // Update email in backend
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!token) {
      setEmailError("You must be logged in to update email.");
      return false;
    }
  
    try {
      const emailRes = await fetch(`http://localhost:3001/users/${userId}/update-email`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: editingEmail }),
      });
  
      if (emailRes.status === 409) {
        const data = await emailRes.json();
        setEmailError(data.error || 'Email already in use.');
        return false;
      }
  
      if (!emailRes.ok) throw new Error('Failed to update email.');
  
      localStorage.setItem('email', editingEmail);
      // Notify UI to reflect new email immediately
      try {
        window.dispatchEvent(new CustomEvent('emailUpdated', { detail: { email: editingEmail } }));
      } catch {}
      setShowOtpModal(false);
      setIsEditingEmailField(false);
      setSettingsSuccess('✔ Email changed successfully.');
      return true;
    } catch (err) {
      console.error(err);
      setEmailError('Failed to update email.');
      return false;
    }
  };  
  

  // SMS Verification
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

  const verifySmsCode = () => {
    if (userEnteredCode === smsVerificationCode) {
      setSmsVerified(true);
      setPhoneError('');
      setSettingsSuccess('✔ Phone number verified.');
    } else {
      setPhoneError('Incorrect verification code.');
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

  // Update account settings
  const handleAccountSettingsUpdate = async (): Promise<void> => {
    setPasswordError('');
    setPhoneError('');
    setEmailError('');
    setSettingsSuccess('');

    const userId = localStorage.getItem('userId');

    try {
      // EMAIL UPDATE
      if (isEditingEmailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editingEmail)) {
          setEmailError('Please enter a valid email address.');
          return;
        }

        if (!emailVerified) {
          setEmailError('Please verify your new email before saving.');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setEmailError('You must be logged in to update email.');
          return;
        }

        const emailRes = await fetch(`http://localhost:3001/users/${userId}/update-email`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify({ email: editingEmail }),
        });

        if (emailRes.status === 409) {
          const data = await emailRes.json();
          setEmailError(data.error || 'Email already in use.');
          return;
        }

        if (!emailRes.ok) {
          throw new Error('Failed to update email.');
        }

        localStorage.setItem('email', editingEmail);
        setShowSuccessModal(true);
        setSettingsSuccess('✔ Email changed successfully.');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }

      // PHONE UPDATE
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

      // PASSWORD UPDATE
      if (isEditingPasswordField && newPassword) {
        if (newPassword !== confirmPassword) {
          setPasswordError('New Password and Confirm Password do not match.');
          return;
        }

        const borrowersId = localStorage.getItem('borrowersId') || '';
        const userId = localStorage.getItem('userId') || '';
        const role = localStorage.getItem('role') || '';
        const token = localStorage.getItem('token') || '';

        let endpoint = '';
        let targetId = '';

        if (['loan officer', 'head', 'manager', 'collector'].includes(role.toLowerCase())) {
          endpoint = 'users';
          targetId = userId;
        } else if (role.toLowerCase() === 'borrower') {
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
    emailError,
    setEmailError,
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
    emailVerified,
    setEmailVerificationSent,
  };
}
