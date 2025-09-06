'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiBell } from 'react-icons/fi';

interface NavbarProps {
  language: 'en' | 'ceb';
  setLanguage: (lang: 'en' | 'ceb') => void;
}

interface ProfilePic {
  fileName: string;
  filePath: string;
  mimeType: string;
}

const Navbar: React.FC<NavbarProps> = ({ language, setLanguage }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  const storedId = localStorage.getItem('borrowersId');
  console.log('Current borrowersId from localStorage:', storedId);
  
  if (!storedId) return;

  fetch(`http://localhost:3001/notifications/${storedId}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) return;
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.viewed).length);
    })
    .catch(err => console.error('Fetch notif error:', err));
}, [pathname]); 


  const handleEdit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
    } else {
      setPasswordError('');
      setIsEditing(!isEditing);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
  <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/borrower"
            className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
          >
            <span>VLSystem</span>
          </Link>

          <div className="flex items-center space-x-8">
            {/* Language Toggle */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'ceb'}
                onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    language === 'ceb' ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
              <span className="text-gray-600 ml-3 text-sm font-medium">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            {/* Notifications */}
            <div className="relative">
              <div
                className="relative cursor-pointer"
                onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
              >
                <FiBell className="text-2xl text-gray-700 hover:text-red-800 transition" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999] p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Notifications</h3>
                  <ul className="space-y-2 text-sm text-gray-700 max-h-64 overflow-y-auto">
                    {Array.isArray(notifications) && notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <li
                          key={n.id || `${n.referenceNumber}-${i}`}
                          className="hover:bg-gray-50 p-2 rounded-md transition flex justify-between items-start"
                        >
                          <span>{n.message}</span>
                          <span className="text-xs text-gray-400">
                            {n.date ? new Date(n.date).toLocaleDateString() : 'N/A'}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-sm italic">No notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <Image
                  src="/idPic.jpg"
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-30 p-0 transition-all bg-white border border-gray-200">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center py-6 border-b border-gray-200">
                    <Image
                      src="/idPic.jpg"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                    <div className="font-semibold text-lg">{username || "Borrower"}</div>
                    <div className="text-gray-400 text-sm">{/* You can show email here if available */}</div>
                  </div>

                  {/* Settings Form */}
                  <div className="flex flex-col py-4 px-6">
                    {isEditing && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        {passwordError && (
                          <p className="text-sm text-red-600">{passwordError}</p>
                        )}
                      </>
                    )}

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between mt-4 mb-2">
                      <span className="flex items-center text-gray-700">
                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 12.79A9 9 0 1111.21 3h.01" />
                          <path d="M21 12.79V21h-8.21" />
                        </svg>
                        Switch to Dark
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={false /* Replace with your dark mode state */}
                          onChange={() => {/* Add your dark mode toggle logic here */}}
                          className="sr-only"
                        />
                        <span className="w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out">
                          <span className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"></span>
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-3">
                      <button
                        onClick={handleEdit}
                        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-50 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-center text-gray-400 py-2 border-t border-gray-200">
                    Privacy Policy · Terms of Service
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
