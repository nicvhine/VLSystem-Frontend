'use client';
import { useState, useEffect, useRef } from "react";
import translationData from '@/app/commonComponents/translation';
import { ButtonContentLoading } from '@/app/commonComponents/utils/loading';
import { Loader2 } from 'lucide-react';
import ErrorModal from '@/app/commonComponents/modals/errorModal';

interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  router: any;
  otpType?: 'sms' | 'email';
  otpExpiresIn?: number;
}

export default function OTPModal({
  isVisible,
  onClose,
  router,
  otpType = 'sms',
  otpExpiresIn = 300,
}: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [expiryTimer, setExpiryTimer] = useState(otpExpiresIn);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const auth = translationData.authTranslation[language];
  const e = translationData.errorTranslation[language];

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang === 'en' || savedLang === 'ceb') setLanguage(savedLang);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    inputRefs.current[0]?.focus();
  }, [isVisible]);

  // Countdown timers
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (expiryTimer <= 0) return;
    const interval = setInterval(() => setExpiryTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [expiryTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const handleChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, '');
    const otpArray = otp.padEnd(6, '').split('');
    otpArray[index] = sanitized.slice(-1);
    const newOtp = otpArray.join('');
    setOtp(newOtp);

    if (sanitized && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pasteData);
    pasteData.split('').forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });
  };

  const handleVerify = () => {
    if (otp.length !== 6 || isVerifying) return;
    setIsVerifying(true);

    const savedCode = sessionStorage.getItem('verificationCode');
    const role = sessionStorage.getItem('userRole');

    if (otp === savedCode) {
      sessionStorage.removeItem('verificationCode');
      sessionStorage.removeItem('userRole');
      onClose();

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

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsResending(true);

    try {
      // Simulate API resend here
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('verificationCode', newCode);

      setOtp('');
      inputRefs.current[0]?.focus();
      setResendTimer(60);
      setExpiryTimer(otpExpiresIn);
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md w-80 text-center">
          <h2 className="text-2xl font-semibold mb-2">{auth.enterSmsCode}</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter the 6-digit code sent to your {otpType === 'sms' ? 'phone number' : 'email'}. Expires in{' '}
            <span className="font-semibold text-red-600">{formatTime(expiryTimer)}</span>.
          </p>

          <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ''}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => { if (el) inputRefs.current[i] = el; }}
                className={`w-9 h-11 md:w-10 md:h-12 rounded-lg border text-center text-xl font-semibold tracking-widest
                  ${otp[i] ? 'border-red-500 text-gray-900' : 'border-gray-300 text-gray-800'}
                  focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none`}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Verifying...
              </>
            ) : 'Verify'}
          </button>

          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Didn’t get the code? <span className="font-medium text-gray-800">Resend in {resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-red-600 font-medium hover:underline disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {isResending ? <><Loader2 className="animate-spin w-4 h-4" /> Sending...</> : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
