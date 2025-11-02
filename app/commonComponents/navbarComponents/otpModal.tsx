'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  otp: string;
  setOtp: (val: string) => void;
  error: string;
  handleVerifyOtp: (otpInput?: string) => Promise<void>;
  handleResendOtp: () => Promise<void>;
};

export default function OTPModal({ otp, setOtp, error, handleVerifyOtp, handleResendOtp }: Props) {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);

  // Debugging: Modal mount
  useEffect(() => {
    console.log('OTPModal mounted');
    debugger; // <-- breakpoint
    inputRefs.current[0]?.focus();
    return () => {
      console.log('OTPModal unmounted');
      debugger; // <-- breakpoint
    };
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    console.log('handleChange', value, index);
    const sanitized = value.replace(/\D/g, '');
    const otpArray = otp.split('');
    otpArray[index] = sanitized.slice(-1);
    const newOtp = otpArray.join('').slice(0, 6);
    setOtp(newOtp);
    if (sanitized && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pasteData);
    pasteData.split('').forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });
  };

  const handleSubmit = async () => {
    console.log('Verify clicked, OTP:', otp);
    debugger; 
    if (otp.length !== 6) return;
    setIsVerifying(true);
    try {
      await handleVerifyOtp(otp);
      console.log('handleVerifyOtp completed');
    } catch (err) {
      console.error('Error verifying OTP', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    console.log('Resend clicked');
    setIsResending(true);
    try {
      await handleResendOtp();
      setTimer(60);
      setOtp('');
      inputRefs.current[0]?.focus();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">OTP Verification</h2>
      <p className="text-sm text-gray-600 mb-6 max-w-sm">
        Enter the 6-digit code sent to your registered email or phone number.
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
            ref={(el) => {
              if (el) inputRefs.current[i] = el;
            }}
            className={`w-9 h-11 md:w-10 md:h-12 rounded-lg border text-center text-xl font-semibold tracking-widest transition-all duration-150 shadow-sm 
              ${otp[i] ? 'border-red-500 text-gray-900' : 'border-gray-300 text-gray-800'}
              focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <button
        disabled={otp.length !== 6 || isVerifying}
        onClick={handleSubmit}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
      >
        {isVerifying ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Verifying...
          </>
        ) : (
          'Verify'
        )}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>
            Didn’t get the code?{' '}
            <span className="font-medium text-gray-800">Resend available in {timer}s</span>
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Didn’t get the code?</span>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-red-600 font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
