'use client';

import { FormEvent, useState } from 'react';
import { loginHandler } from './loginHandlers';

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

  if (!isVisible) return null;

  const handleVerify = () => {
    const savedCode = sessionStorage.getItem('verificationCode');
    const role = sessionStorage.getItem('userRole');

    if (codeInput === savedCode) {
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
      setErrorMsg('Incorrect verification code.');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">Enter SMS Code</h2>
        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="6-digit code"
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleVerify}
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Verify
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Pass setShowSMSModal and error modal callbacks to loginHandler
    await loginHandler({ username, password, onClose, router, setShowSMSModal, setShowErrorModal, setErrorMsg });
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
        {language === 'en' ? 'Welcome Back' : 'Maayong Pagbalik'}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        {language === 'en' ? 'Login to your VLSystem account' : 'Sulod sa imong VLSystem account'}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-sm text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <p
          className="text-sm text-blue-600 hover:underline cursor-pointer text-center mb-4"
          onClick={() => {
            setShowForgotModal(true);
            setForgotRole('');
          }}
        >
          {language === 'en' ? 'Forgot Password or Username?' : 'Nakalimot sa Password o Username?'}
        </p>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-20 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            {language === 'en' ? 'Login' : 'Sulod'}
          </button>
        </div>
      </form>

      {/* SMS verification modal */}
      <SMSModal isVisible={showSMSModal} onClose={() => setShowSMSModal(false)} router={router} />
      {/* Error modal */}
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
    </>
  );
}
