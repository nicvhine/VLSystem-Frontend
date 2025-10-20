export interface ProfileEditingProps {
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
  