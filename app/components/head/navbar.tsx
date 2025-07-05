'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const [originalPic, setOriginalPic] = useState<string | null>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [username, setUsername] = useState('');


  useEffect(() => {
  const storedName = localStorage.getItem('fullName');
  const storedEmail = localStorage.getItem('email');
  const storedPic = localStorage.getItem('profilePic');

  if (storedName) setName(storedName);
  if (storedEmail) setEmail(storedEmail);
  if (storedPic) {
    setProfilePic(storedPic);
    setOriginalPic(storedPic);
  }
}, []);


  const navItems = [
    { name: 'Loans', href: '/components/head/loans' },
    { name: 'Applications', href: '/components/head/applications' },
    { name: 'Agents', href: '/head/agents' },
    { name: 'Collections', href: '/components/head/collections' },
    { name: 'Users', href: '/components/head/userPage' },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleEdit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
    } else {
      setPasswordError('');
      setIsEditing(false);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const previewURL = URL.createObjectURL(file);
  setProfilePic(previewURL);

  const formData = new FormData();
  formData.append('profilePic', file);

  const userId = localStorage.getItem('userId');
  try {
    const res = await fetch(`http://localhost:3001/users/${userId}/upload-profile`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload failed:', errorText);
      return;
    }

    const data = await res.json();
    if (data.profilePic) {
      const fullUrl = `http://localhost:3001${data.profilePic}`;
      setProfilePic(fullUrl);
      localStorage.setItem('profilePic', fullUrl);
    }
  } catch (err) {
    console.error('Upload failed:', err);
  }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const previewURL = URL.createObjectURL(file);
  setPreviewPic(previewURL);
  setIsUploadingPic(true);
};


const handleSaveProfilePic = async () => {
  if (!previewPic) return;

  const fileInput = document.getElementById('profileUpload') as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('profilePic', file);

  const userId = localStorage.getItem('userId');
  try {
    const res = await fetch(`http://localhost:3001/users/${userId}/upload-profile`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.profilePic) {
      const fullUrl = `http://localhost:3001${data.profilePic}`;
      setProfilePic(fullUrl);
      setOriginalPic(fullUrl);
      localStorage.setItem('profilePic', fullUrl);
      setIsUploadingPic(false);
      setPreviewPic(null);
    }
  } catch (err) {
    console.error('Upload failed:', err);
  }
};

const handleCancelUpload = () => {
  setPreviewPic(null);
  setIsUploadingPic(false);
};

const handleLogout = () => {
  router.push('/');
};

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/components/head"
            className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
          >
            <span>VLSystem</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded text-gray-600 border-gray-400 hover:text-gray-900 hover:border-gray-600"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                onClick={toggleDropdown}
              >
                <Image
                  src={profilePic || '/idPic.jpg'}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                  onClick={() => document.getElementById('profileUpload')?.click()}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  Change
                </div>
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileUpload}
                />
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-30 p-0 transition-all ${
                    darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  } border border-gray-200`}
                >
                  {/* Profile Header */}
                 <div className="flex flex-col items-center py-6 border-b border-gray-200 dark:border-gray-800">
  <div
    className="relative group w-16 h-16 rounded-full overflow-hidden ring-2 ring-red-900 cursor-pointer"
    onClick={() => document.getElementById('profileUpload')?.click()}
  >
    <Image
      src={previewPic || profilePic || '/idPic.jpg'}
      alt="Profile"
      width={64}
      height={64}
      className="w-full h-full object-cover rounded-full"
    />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition">
      Change
    </div>
    <input
      type="file"
      id="profileUpload"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  </div>

  <div className="font-semibold text-lg mt-2">{name}</div>
  <div className="text-gray-400 text-sm">{email}</div>

  {isUploadingPic && (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleSaveProfilePic}
        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
      >
        Save
      </button>
      <button
        onClick={handleCancelUpload}
        className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 transition"
      >
        Cancel
      </button>
    </div>
  )}
                  </div>

                  {/* Menu */}
                  <div className="flex flex-col py-2">
                    <button
                      className="flex items-center px-6 py-3 hover:bg-gray-50 transition"
                      onClick={() => setIsEditing((s) => !s)}
                    >
                      <svg
                        className="mr-3 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                      </svg>
                      Settings
                    </button>
                    {/* Settings Form */}
                    {isEditing && (
                      <div className="px-6 py-3 space-y-2">
                        <input
                          type="email"
                          placeholder="Change Email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-3 py-2 rounded border"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded border"
                        />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded border"
                        />
                        {passwordError && (
                          <p className="text-sm text-red-600">{passwordError}</p>
                        )}
                        <button
                          onClick={handleEdit}
                          className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-50 transition-all"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    <div className="flex items-center px-6 py-3 justify-between hover:bg-gray-50 transition">
                      <span className="flex items-center">
                        <svg
                          className="mr-3 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 12.79A9 9 0 1111.21 3h.01" />
                          <path d="M21 12.79V21h-8.21" />
                        </svg>
                        Switch to Dark
                      </span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={() => setDarkMode((d) => !d)}
                          className="sr-only"
                        />
                        <span
                          className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                            darkMode ? 'bg-orange-500' : ''
                          }`}
                        >
                          <span
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                              darkMode ? 'translate-x-5' : ''
                            }`}
                          ></span>
                        </span>
                      </label>
                    </div>
                    <button
                      className="flex items-center px-6 py-3 hover:bg-gray-50 transition text-red-600"
                      onClick={handleLogout}
                    >
                      <svg
                        className="mr-3 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        <path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                  <div className="text-xs text-center text-gray-400 py-2 border-t border-gray-200 dark:border-gray-800">
                    Privacy Policy · Terms of Service
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <ul className="space-y-2">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center space-x-3 px-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={language === 'ceb'}
                  onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${language === 'ceb' ? 'translate-x-6' : ''}`} />
                </div>
                <span className="text-gray-900 ml-3 text-sm font-medium">
                  {language === 'en' ? 'English' : 'Cebuano'}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}