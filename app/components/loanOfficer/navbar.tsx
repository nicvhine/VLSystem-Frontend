'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [language, setLanguage] = useState('English');
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  const navItems = [
    { name: 'Loans', href: '/loanOfficer/loans' },
    { name: 'Applications', href: '/components/loanOfficer/applications' },
    { name: 'Agents', href: '/loanOfficer/agents' },
    { name: 'Collections', href: '/components/loanOfficer/collections' },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
    } else {
      setPasswordError('');
      setIsEditing(!isEditing);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    const storedName = localStorage.getItem('fullName'); 
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="dashboard"
            className="text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent"
          >
            VLSystem
          </Link>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switch */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'ceb'}
                onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    language === 'ceb' ? 'translate-x-6' : ''
                  }`}
                />
              </div>
              <span className="ml-3 text-sm text-gray-900 font-medium">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            {/* Nav Items */}
            <nav>
              <ul className="flex items-center space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Profile */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                onClick={toggleDropdown}
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
                <div
                  className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-30 p-0 transition-all ${
                    darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  } border border-gray-200`}
                >
                  {/* Profile Header */}
                  <div className="flex flex-col items-center py-6 border-b border-gray-200 dark:border-gray-800">
                    <Image
                      src="/idPic.jpg"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover mb-2"
                    />
                    <div className="font-semibold text-lg">{name}</div>
                    <div className="text-gray-400 text-sm">{email}</div>
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-50 transition-all"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    <div className="flex items-center px-6 py-3 justify-between hover:bg-gray-100 dark:hover:bg-gray-50 transition">
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

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={language === 'ceb'}
                  onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full">
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                      language === 'ceb' ? 'translate-x-6' : ''
                    }`}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-900 font-medium">
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
