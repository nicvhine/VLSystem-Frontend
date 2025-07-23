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
    phoneError,
    setPhoneError,
    settingsSuccess,
    setSettingsSuccess,
    activeSettingsTab,
    setActiveSettingsTab,
  } = useAccountSettings();

  const toggleEdit = () => {
    setIsEditing((prev) => !prev); 
    setActiveSettingsTab('account');
    setPasswordError('');
    setPhoneError('');
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
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('fullName');
  localStorage.removeItem('borrowersId');
  localStorage.removeItem('collectorName');
  localStorage.removeItem('forcePasswordChange');
  localStorage.removeItem('profilePic');
  localStorage.removeItem('darkMode');
  localStorage.removeItem('notificationPreferences');

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

  const [smsVerificationCode, setSmsVerificationCode] = useState('');
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsVerificationSent, setSmsVerificationSent] = useState(false);

//EMAIL VERIFICATION
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
      console.error('EmailJS send failed:', emailResponse);
      setPasswordError('Email not found or could not be sent.');
      return;
    }

    setEmailVerificationSent(true);
    setSettingsSuccess('Verification code sent to your new email.');
  } catch (error: any) {
    console.error('Failed to send email:', error);

    if (error?.status === 400 || error?.text?.includes('not found')) {
      setPasswordError('Email address not found.');
    } else {
      setPasswordError('Failed to send verification code.');
    }
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

//SMS VERIFICATION
const sendSmsVerificationCode = async () => {
  if (!editingPhone || !editingPhone.trim()) {
    setPhoneError('Please enter a valid phone number.');
    return;
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSmsVerificationCode(code);
    setSmsVerified(false);
    

    const message = `Your verification code is: ${code}`;

    const response = await fetch('http://localhost:3001/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: editingPhone,
        code
      })
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

const handleAccountSettingsUpdate = async () => {
  setPasswordError('');
  setPhoneError('');
  setSettingsSuccess('');

  const userId = localStorage.getItem('userId');

  try {
    //EMAIL
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

      const emailRes = await fetch(`http://localhost:3001/users/${userId}/update-email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: editingEmail }),
      });

      if (emailRes.status === 409) {
        const data = await emailRes.json();
        setPasswordError(data.error || 'Email already in use.');
        return;
      }

      if (!emailRes.ok) {
        throw new Error('Failed to update email.');
      }

      localStorage.setItem('email', editingEmail);
    }

    //PHONE NUMBR
    if (isEditingPhoneField) {
      const phoneRes = await fetch(`http://localhost:3001/users/${userId}/update-phoneNumber`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: editingPhone }),
      });

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

    //PASSWORD
    if (isEditingPasswordField && newPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError('New Password and Confirm Password do not match.');
        return;
      }

       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    setPasswordError(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
    );
    return;
  }
     const passwordRes = await fetch(`http://localhost:3001/users/${userId}/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword }),
  });

  if (!passwordRes.ok) {
    const data = await passwordRes.json();
    setPasswordError(data.message || 'Failed to update password.');
    return;
  
  }

    }

    setIsEditingEmailField(false);
    setIsEditingPhoneField(false);
    setIsEditingPasswordField(false);
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
    emailVerificationSent,
    userEnteredCode,
    setUserEnteredCode,
    sendSmsVerificationCode,
    verifySmsCode,
    smsVerificationSent,
  };
}