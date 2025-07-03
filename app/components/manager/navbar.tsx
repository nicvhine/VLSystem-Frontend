'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type User = {
  fullName: string;
};

export default function Navbar() {
  const [language, setLanguage] = useState<'English' | 'Cebuano'>('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const navItems = [
    { name: 'Loans', href: '/components/manager/loans' },
    { name: 'Applications', href: '/components/manager/applications' },
    { name: 'Agents', href: '/head/agents' },
    { name: 'Collections', href: '/components/manager/collections' },
  ];

  useEffect(() => {
    const storedFullName = localStorage.getItem('fullName');
    if (storedFullName) {
      setUser({ fullName: storedFullName });
    } else {
      router.push('/');
    }
  }, [router]);

  if (!user) return null;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/');
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      // You can add your save logic here
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Password changed successfully');
        closeModal();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'English' ? 'Cebuano' : 'English'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
          >
            <span>VLSystem</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
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

          <div className="hidden md:flex items-center space-x-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'Cebuano'}
                onChange={toggleLanguage}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    language === 'Cebuano' ? 'translate-x-6' : ''
                  }`}
                />
              </div>
              <span className="ml-3 text-sm text-gray-900 font-medium">
                {language}
              </span>
            </label>

            <ul className="flex items-center space-x-6">
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

            {/* Profile Dropdown */}
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
                    <div className="font-semibold text-lg">{username}</div>
                    <div className="text-gray-400 text-sm">
                      john_doe@email.com
                    </div>
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
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
                  checked={language === 'Cebuano'}
                  onChange={toggleLanguage}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                      language === 'Cebuano' ? 'translate-x-6' : ''
                    }`}
                  />
                </div>
                <span className="text-gray-900 ml-3 text-sm font-medium">
                  {language}
                </span>
              </label>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword(currentPassword, newPassword, confirmPassword);
                }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Current Password
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </label>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  New Password
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </label>
                <label className="block mb-4 text-sm font-medium text-gray-700">
                  Confirm New Password
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </label>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
