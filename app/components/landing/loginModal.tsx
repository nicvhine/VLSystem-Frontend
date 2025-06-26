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
  const [showForgotModal, setShowForgotModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen || showForgotModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, showForgotModal]);

  if (!isOpen && !showForgotModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
<<<<<<< vine
  e.preventDefault();

  if (!username || !password) {
    alert('Please enter both username and password.');
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

      localStorage.setItem('fullName', data.fullName || data.name || data.username);
      localStorage.setItem('role', data.role?.toLowerCase() || 'staff');
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
        default:
          router.push('/');
      }
=======
    e.preventDefault();
    if (!username || !password) {
      alert(language === 'en' ? 'Please fill in all fields' : 'Palihug pun-a ang tanang field');
>>>>>>> main
      return;
    }
    // Example login logic (replace with your own)
    try {
      // ... login logic here ...
      onClose();
      router.push('/');
    } catch (error) {
      alert(language === 'en' ? 'Login failed' : 'Napakyas ang pagsulod');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in text-black">
        <button
          onClick={() => {
            onClose();
            setShowForgotModal(false);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">{language === 'en' ? 'Welcome Back' : 'Balik, Palihug!'}</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          {language === 'en' ? 'Login to your VLSystem account' : 'Sulod sa imong VLSystem nga account'}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={language === 'en' ? 'Username' : 'Username'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder={language === 'en' ? 'Password' : 'Password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p
            className="text-sm text-blue-600 hover:underline cursor-pointer text-center mb-4"
            onClick={() => setShowForgotModal(true)}
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
      </div>
    </div>
  );
}
