'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ceb';
}

export default function LoginModal({ isOpen, onClose, language = 'en' }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRole, setForgotRole] = useState<'borrower' | 'staff' | ''>('');
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen || showForgotModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, showForgotModal]);

  if (!isOpen && !showForgotModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!username || !password) {
    alert(language === 'en' ? 'Please enter both username and password.' : 'Palihog isulod ang username ug password.');
    return;
  }

  try {
    const borrowerRes = await fetch('http://localhost:3001/borrowers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (borrowerRes.ok) {
  const data = await borrowerRes.json();
  console.log('Logged in as borrower:', data);

  // Store JWT token
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  localStorage.setItem('fullName', data.fullName || data.name || data.username);
  localStorage.setItem('role', 'borrower');
  if (data.borrowersId) localStorage.setItem('borrowersId', data.borrowersId);

  if (data.isFirstLogin) {
    localStorage.setItem('forcePasswordChange', 'true');
  } else {
    localStorage.removeItem('forcePasswordChange');
  }

  onClose();
  router.push('components/borrower');
  return;
}


    const staffRes = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (staffRes.ok) {
      const data = await staffRes.json();
      console.log('Logged in as staff:', data);

      // Store JWT token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      localStorage.setItem('fullName', data.fullName || data.name || data.username || data.email);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role?.toLowerCase() || 'staff');

      if (data.role?.toLowerCase() === 'collector') {
        localStorage.setItem('collectorName', data.name); 
      }

      if (data.userId) localStorage.setItem('userId',data.userId);

      if(data.isFirstLogin){
        localStorage.setItem('forcePasswordChange', 'true');
      } else{
        localStorage.removeItem('forcePasswordChange');
      }
      onClose();

      switch (data.role?.toLowerCase()) {
        case 'head':
          router.push('components/head');
          break;
        case 'manager':
          router.push('components/manager');
          break;
        case 'loan officer':
          router.push('components/loanOfficer');
          break;
         case 'collector':
          router.push('components/collector');
          break;
        default:
          router.push('/');
      }
      return;
    }

    alert(language === 'en' ? 'Invalid credentials or user not found.' : 'Sayop nga credentials o wala makit-an ang user.');
  } catch (error) {
    console.error('Login error:', error);
    alert(language === 'en' ? 'Error connecting to the server.' : 'Sayop sa pagkonekta sa server.');
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
        <button
          onClick={() => {
            onClose();
            setShowForgotModal(false);
            setForgotRole('');
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>

        {/* Forgot Password Modal */}
        {showForgotModal && forgotRole === '' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              {language === 'en' ? 'Forgot Password' : 'Nakalimot sa Password'}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              {language === 'en' ? 'Select your role to proceed:' : 'Pilia ang imong role aron magpadayon:'}
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                {language === 'en' ? 'Borrower' : 'Nagpahulam'}
              </button>
              <button
                onClick={() => setForgotRole('staff')}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                {language === 'en' ? 'Staff' : 'Staff'}
              </button>
            </div>
          </>
        )}

        {showForgotModal && forgotRole === 'staff' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              {language === 'en' ? 'Staff Assistance' : 'Tabang sa Staff'}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {language === 'en' 
                ? 'Please contact your system administrator to retrieve your username or reset your password.'
                : 'Palihog kontaka ang imong system administrator aron makuha ang imong username o i-reset ang imong password.'
              }
            </p>
          </>
        )}

        {/* Login Form */}
        {!showForgotModal && (
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
                  {showPassword ? (language === 'en' ? 'Hide' : 'Tagoa') : (language === 'en' ? 'Show' : 'Ipakita')}
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
        )}
      </div>
    </div>
  );
}