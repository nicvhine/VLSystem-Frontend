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
  
  // Updated states for enhanced settings
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'notifications'>('account');
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: false,
    email: true
  });
  const [editingEmail, setEditingEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [isEditingEmailField, setIsEditingEmailField] = useState(false);
  const [isEditingPasswordField, setIsEditingPasswordField] = useState(false);
  const [isEditingPhoneField, setIsEditingPhoneField] = useState(false);
  const [editingPhone, setEditingPhone] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('fullName');
    const storedEmail = localStorage.getItem('email');
    const storedPic = localStorage.getItem('profilePic');
    const storedNotifications = localStorage.getItem('notificationPreferences');

    if (storedName) setName(storedName);
    if (storedEmail) {
      setEmail(storedEmail);
      setEditingEmail(storedEmail);
    }
    if (storedPic) {
      setProfilePic(storedPic);
      setOriginalPic(storedPic);
    }
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      // Handle migration from old format
      if (parsed.both) {
        setNotificationPreferences({ sms: true, email: true });
      } else {
        setNotificationPreferences({
          sms: parsed.sms || false,
          email: parsed.email !== undefined ? parsed.email : true
        });
      }
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

  const handleNotificationToggle = (type: 'sms' | 'email') => {
    const newPrefs = {
      ...notificationPreferences,
      [type]: !notificationPreferences[type]
    };
    setNotificationPreferences(newPrefs);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPrefs));
  };

  const handleAccountSettingsUpdate = () => {
    // Reset errors
    setPasswordError('');
    setSettingsSuccess('');

    // Validate passwords if changing
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingEmail)) {
      setPasswordError('Please enter a valid email address.');
      return;
    }

    // Update localStorage
    localStorage.setItem('email', editingEmail);
    setEmail(editingEmail);
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSettingsSuccess('Settings updated successfully!');
    
    // Hide success message after 3 seconds
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setActiveSettingsTab('account');
    setPasswordError('');
    setSettingsSuccess('');
    setIsEditingEmailField(false);
    setIsEditingPasswordField(false);
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
                  src={previewPic || profilePic || '/idPic.jpg'}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl z-30 p-0 transition-all ${
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
                      onClick={handleEdit}
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

                    {/* Enhanced Settings Section */}
                    {isEditing && (
                      <div className="px-6 py-4 bg-gray-50 rounded-lg mx-4 mb-4">
                        {/* Settings Tabs */}
                        <div className="flex mb-4 bg-white rounded-lg p-1 relative">
                          {/* Sliding background indicator */}
                          <div
                            className={`absolute top-1 h-8 bg-red-600 rounded-md transition-all duration-300 ease-in-out ${
                              activeSettingsTab === 'account' 
                                ? 'left-1 w-[calc(50%-4px)]' 
                                : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                            }`}
                          />
                          
                          <button
                            onClick={() => setActiveSettingsTab('account')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 relative z-10 ${
                              activeSettingsTab === 'account'
                                ? 'text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Account
                          </button>
                          <button
                            onClick={() => setActiveSettingsTab('notifications')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 relative z-10 ${
                              activeSettingsTab === 'notifications'
                                ? 'text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Notifications
                          </button>
                        </div>

                        {/* Tab Content Container with Animation */}
                        <div className="relative overflow-hidden">
                          {/* Account Settings Tab */}
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              activeSettingsTab === 'account'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-full absolute top-0 left-0 w-full'
                            }`}
                          >
                            <div className="space-y-2">
                              {/* Username Section (plain text) */}
                              <div>
                                <span className="block text-sm text-gray-700 mb-1">
                                  Username
                                </span>
                                <span className="block text-base text-gray-900 pl-1">
                                  username
                                </span>
                              </div>

                              {/* Email Address Section */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="block text-sm text-gray-700 mb-1">
                                    Email Address
                                  </span>
                                  <button
                                    onClick={() => setIsEditingEmailField(!isEditingEmailField)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    {isEditingEmailField ? 'Cancel' : 'Edit'}
                                  </button>
                                </div>
                                {!isEditingEmailField ? (
                                  <span className="block text-base text-gray-900 pl-1">
                                    {email || 'No email set'}
                                  </span>
                                ) : (
                                  <input
                                    type="email"
                                    value={editingEmail}
                                    onChange={(e) => setEditingEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                  />
                                )}
                              </div>
                              
                              {/* Phone Number Section */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="block text-sm text-gray-700 mb-1">
                                    Phone Number
                                  </span>
                                  <button
                                    onClick={() => setIsEditingPhoneField(!isEditingPhoneField)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    {isEditingPhoneField ? 'Cancel' : 'Edit'}
                                  </button>
                                </div>
                                {!isEditingPhoneField ? (
                                  <span className="block text-base text-gray-900 pl-1">
                                    {editingPhone || 'No phone number set'}
                                  </span>
                                ) : (
                                  <input
                                    type="tel"
                                    value={editingPhone}
                                    onChange={(e) => setEditingPhone(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                  />
                                )}
                              </div>

                              {/* Password Section */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Password
                                  </label>
                                  <button
                                    onClick={() => setIsEditingPasswordField(!isEditingPasswordField)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    {isEditingPasswordField ? 'Cancel' : 'Edit'}
                                  </button>
                                </div>
                                {isEditingPasswordField && (
                                  <div className="space-y-3">
                                    <input
                                      type="password"
                                      value={currentPassword}
                                      onChange={(e) => setCurrentPassword(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      placeholder="Enter current password"
                                    />
                                    <input
                                      type="password"
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      placeholder="Enter new password"
                                    />
                                    <input
                                      type="password"
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      placeholder="Confirm new password"
                                    />
                                  </div>
                                )}
                              </div>

                              {passwordError && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{passwordError}</p>
                              )}
                              
                              {settingsSuccess && (
                                <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">{settingsSuccess}</p>
                              )}

                              {(isEditingEmailField || isEditingPasswordField) && (
                                <button
                                  onClick={handleAccountSettingsUpdate}
                                  className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                                >
                                  Update Account
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Notifications Settings Tab */}
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              activeSettingsTab === 'notifications'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-full absolute top-0 left-0 w-full'
                            }`}
                          >
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                  Notification Preferences
                                </h4>
                                <div className="space-y-4">
                                  {/* Email Toggle */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                                        <p className="text-xs text-gray-500">Receive notifications via email</p>
                                      </div>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={notificationPreferences.email}
                                        onChange={() => handleNotificationToggle('email')}
                                        className="sr-only"
                                      />
                                      <span
                                        className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                                          notificationPreferences.email ? 'bg-red-600' : ''
                                        }`}
                                      >
                                        <span
                                          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                            notificationPreferences.email ? 'translate-x-5' : ''
                                          }`}
                                        ></span>
                                      </span>
                                    </label>
                                  </div>
                                  
                                  {/* SMS Toggle */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                                        <p className="text-xs text-gray-500">Receive notifications via text message</p>
                                      </div>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={notificationPreferences.sms}
                                        onChange={() => handleNotificationToggle('sms')}
                                        className="sr-only"
                                      />
                                      <span
                                        className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                                          notificationPreferences.sms ? 'bg-red-600' : ''
                                        }`}
                                      >
                                        <span
                                          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                            notificationPreferences.sms ? 'translate-x-5' : ''
                                          }`}
                                        ></span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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