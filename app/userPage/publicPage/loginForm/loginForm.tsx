'use client';

// Login form with SMS verification step
import { FormEvent, useState } from 'react';
import { loginHandler } from './loginHandlers';
import ErrorModal from '@/app/commonComponents/modals/errorModal';
import { ButtonContentLoading } from '@/app/commonComponents/utils/loading';
import translationData from '@/app/commonComponents/translation';

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
  const auth = translationData.authTranslation[language];
  const e = translationData.errorTranslation[language];

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (!username || !password) {
        setErrorMsg(e.usernamePasswordRequired);
        setShowErrorModal(true);
        return;
      }
      if (isLoggingIn) return;
      setIsLoggingIn(true);
      loginHandler({ username, password, onClose, setErrorMsg, setShowErrorModal, setShowSMSModal, router })
        .finally(() => setIsLoggingIn(false));
    };

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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={auth.username}
                className="w-full px-4 py-2.5 mb-3 border border-gray-200 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={auth.password}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
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
                  disabled={isLoggingIn}
                  className="w-36 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <ButtonContentLoading label={auth.loggingIn} />
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
