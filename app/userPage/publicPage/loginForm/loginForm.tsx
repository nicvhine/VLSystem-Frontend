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

export default function LoginForm({ onClose, router, setShowForgotModal, setForgotRole, language = 'en' }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginHandler({ username, password, onClose, router });
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
          placeholder={language === 'en' ? 'Username' : 'Username'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={language === 'en' ? 'Password' : 'Password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-sm text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {language === 'en' 
              ? (showPassword ? 'Hide' : 'Show')
              : (showPassword ? 'Tago' : 'Ipakita')
            }
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
    </>
  );
}
