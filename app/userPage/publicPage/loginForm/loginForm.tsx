'use client';

import { FormEvent, useState, useEffect } from 'react';
import { loginHandler } from './loginHandlers';
import ErrorModal from '@/app/commonComponents/modals/errorModal';
import { ButtonContentLoading } from '@/app/commonComponents/utils/loading';
import translationData from '@/app/commonComponents/translation';
import { AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
  router: any;
  setShowForgotModal: (show: boolean) => void;
  setForgotRole: (role: 'borrower' | 'staff' | '') => void;
  language?: 'en' | 'ceb';
}

interface SMSModalProps {
  isVisible: boolean;
  onClose: () => void;
  router: any;
}

function SMSModal({ isVisible, onClose, router }: SMSModalProps) {
  const [codeInput, setCodeInput] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => (localStorage.getItem("language") as any) || 'en');
  const auth = translationData.authTranslation[language];
  const e = translationData.errorTranslation[language];

  if (!isVisible) return null;

  const handleVerify = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    const savedCode = sessionStorage.getItem('verificationCode');
    const role = sessionStorage.getItem('userRole');

    if (codeInput === savedCode) {
      sessionStorage.removeItem('verificationCode');
      sessionStorage.removeItem('userRole');
      onClose();

      // Routing per role after SMS verification
      const redirectMap: Record<string, string> = {
        borrower: '/userPage/borrowerPage/dashboard',
        head: '/userPage/headPage/dashboard',
        manager: '/userPage/managerPage/dashboard',
        'loan officer': '/userPage/loanOfficerPage/dashboard',
        collector: '/commonComponents/collection',
      };

      router.push(redirectMap[role || ''] || '/');
    } else {
      setErrorMsg(e.incorrectVerificationCode);
      setShowErrorModal(true);
    }
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">{auth.enterSmsCode}</h2>
        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder={auth.sixDigitCode}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? <ButtonContentLoading label={auth.verifying} /> : auth.verify}
        </button>
        {showErrorModal && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
              {errorMsg}
              <button className="ml-4 text-white" onClick={() => setShowErrorModal(false)}>
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginFormWithSMS({
  onClose,
  router,
  setShowForgotModal,
  setForgotRole,
  language = 'en',
}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Attempt tracking
  const [attemptCount, setAttemptCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const auth = translationData.authTranslation[language];
  const e = translationData.errorTranslation[language];

  // Load saved lockout state from localStorage
  useEffect(() => {
    const savedLockout = localStorage.getItem('loginLockout');
    if (savedLockout) {
      const lockoutData = JSON.parse(savedLockout);
      const remainingTime = Math.floor((lockoutData.unlockTime - Date.now()) / 1000);
      
      if (remainingTime > 0) {
        setIsLockedOut(true);
        setCooldownTime(remainingTime);
        setAttemptCount(3);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('loginLockout');
      }
    }
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAttemptCount(0);
            localStorage.removeItem('loginLockout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  const formatCooldownTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (isLockedOut) {
      setErrorMsg(`Too many failed attempts. Please wait ${formatCooldownTime(cooldownTime)} before trying again.`);
      setShowErrorModal(true);
      return;
    }

    if (!username || !password) {
      setErrorMsg(e.usernamePasswordRequired);
      setShowErrorModal(true);
      return;
    }
    
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const result = await loginHandler({ 
        username, 
        password, 
        onClose, 
        setErrorMsg, 
        setShowErrorModal, 
        setShowSMSModal, 
        router 
      });

      // Check if login failed (result will be undefined on success since it redirects)
      if (result === false) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 3) {
          // Lock out for 5 minutes
          const unlockTime = Date.now() + 30 * 1000;
          // const unlockTime = Date.now() + 5 * 60 * 1000;
          localStorage.setItem('loginLockout', JSON.stringify({ unlockTime }));
          setIsLockedOut(true);
          setCooldownTime(30);
          setErrorMsg('Maximum login attempts reached. Your account is locked for 30 seconds.');
          setShowErrorModal(true);
        } else {
          const remainingAttempts = 3 - newAttemptCount;
          setErrorMsg(`Invalid credentials. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before lockout.`);
          setShowErrorModal(true);
        }
      } else {
        // Success - reset attempts
        setAttemptCount(0);
        localStorage.removeItem('loginLockout');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const remainingAttempts = 3 - attemptCount;

  return (
    <>
      {/* Error modal - always at top level, overlays page */}
      <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />
      
      {/* Login modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 md:p-7 rounded-2xl shadow-lg w-full max-w-lg relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-1 text-center">{auth.welcomeBack}</h2>
          <p className="mb-4 text-center text-gray-600">{auth.loginSubtitle}</p>
          
          {/* Attempt Warning */}
          {attemptCount > 0 && !isLockedOut && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm font-medium">
                  Warning: {remainingAttempts} attempt{remainingAttempts > 1 ? 's' : ''} remaining
                </p>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Your account will be locked for 30 seconds after {remainingAttempts} more failed attempt{remainingAttempts > 1 ? 's' : ''}.
              </p>
            </div>
          )}

          {/* Lockout Warning */}
          {isLockedOut && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm font-medium">Account Temporarily Locked</p>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Too many failed login attempts. Please wait {formatCooldownTime(cooldownTime)} before trying again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={auth.username}
              className="w-full px-4 py-2.5 mb-3 border border-gray-200 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              disabled={isLockedOut}
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={auth.password}
                className="w-full px-4 py-2.5 pr-16 border border-gray-200 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                disabled={isLockedOut}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700 text-xs disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLockedOut}
              >
                {showPassword ? auth.hide : auth.show}
              </button>
            </div>
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer text-center mb-3"
              onClick={() => {
                setShowForgotModal(true);
                setForgotRole('');
              }}
            >
              {auth.forgotPrompt}
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoggingIn || isLockedOut}
                className="w-36 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <ButtonContentLoading label={auth.loggingIn} />
                ) : isLockedOut ? (
                  'Locked'
                ) : (
                  auth.login
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* SMS verification modal */}
      <SMSModal isVisible={showSMSModal} onClose={() => setShowSMSModal(false)} router={router} />
    </>
  );
}