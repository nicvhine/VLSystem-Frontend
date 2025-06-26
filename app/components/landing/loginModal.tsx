'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      return;
    }

    alert('Invalid credentials or user not found.');
  } catch (error) {
    console.error('Login error:', error);
    alert('Error connecting to the server.');
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
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Forgot Password</h2>
            <p className="text-sm text-gray-600 text-center mb-6">Select your role to proceed:</p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Borrower
              </button>
              <button
                onClick={() => setForgotRole('staff')}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Staff
              </button>
            </div>
          </>
        )}

        {showForgotModal && forgotRole === 'staff' && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Staff Assistance</h2>
            <p className="text-sm text-gray-600 text-center">
              Please contact your system administrator to retrieve your username or reset your password.
            </p>
          </>
        )}

        {/* Login Form */}
        {!showForgotModal && (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Login to your VLSystem account
            </p>
            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
                className="text-sm text-blue-600 hover:underline cursor-pointer text-center mb-4"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotRole('');
                }}
              >
                Forgot Password or Username?
              </p>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-20 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}