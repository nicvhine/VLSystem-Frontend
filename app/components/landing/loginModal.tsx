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

    if (!username || !password || !forgotRole) {
      alert('Please fill in all fields and select a role');
      return;
    }

    const endpoint =
      forgotRole === 'borrower'
        ? 'http://localhost:3001/borrowers/login'
        : 'http://localhost:3001/users/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert('Invalid server response');
        return;
      }

      if (res.ok) {
        console.log('Login success data:', data);

        localStorage.setItem('fullName', data.fullName || data.name || data.username);
        localStorage.setItem('role', forgotRole);

        if (forgotRole === 'borrower' && data.borrowersId) {
          localStorage.setItem('borrowersId', data.borrowersId); 
        }

        onClose();

        const role = data.role?.toLowerCase() || forgotRole;

        if (role === 'head') {
          router.push('components/head');
        } else if (role === 'manager') {
          router.push('components/manager');
        } else if (role === 'loan officer') {
          router.push('components/loanOfficer');
        } else if (role === 'borrower') {
          router.push('components/borrower');
        } else {
          router.push('/');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
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
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Login as:</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                  value={forgotRole}
                  onChange={(e) => setForgotRole(e.target.value as 'borrower' | 'staff')}
                  required
                >
                  <option value="" disabled>Select role</option>
                  <option value="staff">Internal Staff</option>
                  <option value="borrower">Borrower</option>
                </select>
              </div>
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
