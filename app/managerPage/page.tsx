'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useProfilePic from '../../commonComponents/navbarComponents/profilePic';
import { managerNavItems } from '../../commonComponents/navbarComponents/navItems'
import useAccountSettings from '../../commonComponents/navbarComponents/accountSettings';
import MobileMenu from '../../commonComponents/navbarComponents/mobileMenu';
import ProfileDropdown from '../../commonComponents/navbarComponents/dropdown';

export default function ManagerNavbar({ isBlurred = false }: { isBlurred?: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);



  const {
  profilePic,
  setProfilePic,
  previewPic,
  setPreviewPic,
  originalPic,
  setOriginalPic,
  isUploadingPic,
  setIsUploadingPic,
  handleFileChange,
  handleSaveProfilePic,
  handleCancelUpload
} = useProfilePic();

const {
  editingEmail,
  setEditingEmail,
  editingPhone,
  setEditingPhone,
  isEditingEmailField,
  setIsEditingEmailField,
  isEditingPhoneField,
  setIsEditingPhoneField,
  isEditingPasswordField,
  setIsEditingPasswordField,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  notificationPreferences,
  setNotificationPreferences,
  passwordError,
  setPasswordError,
  settingsSuccess,
  setSettingsSuccess,
  activeSettingsTab,
  setActiveSettingsTab
} = useAccountSettings();


  useEffect(() => {
    const storedName = localStorage.getItem('fullName');
    const storedEmail = localStorage.getItem('email');
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    const storedUsername = localStorage.getItem('username');
    const storedPic = localStorage.getItem('profilePic');
    const storedNotifications = localStorage.getItem('notificationPreferences');

    if (storedName) setName(storedName);
    if (storedEmail) {
      setEmail(storedEmail);
      setEditingEmail(storedEmail);
    }

    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setEditingPhone(storedPhoneNumber);
    }

    if(storedUsername) setUsername(storedUsername);
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


 const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
  <div className={`w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm ${isBlurred ? 'relative z-40' : 'sticky top-0 z-50'} ${isBlurred ? 'blur-sm' : ''} transition-all duration-150`}>
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/headPage/dashboard"
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
              {headNavItems.map(item => {
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
              <ProfileDropdown
              name={name}
              email={email}       
              phoneNumber={phoneNumber}       
              username={username}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleLogout={handleLogout}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              profilePic={profilePic || ''}
              previewPic={previewPic || ''}
              isUploadingPic={isUploadingPic}
              handleFileChange={handleFileChange}
              handleSaveProfilePic={handleSaveProfilePic}
              handleCancelUpload={handleCancelUpload}
            />

            )}

            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
            <MobileMenu navItems={headNavItems} language={language} setLanguage={setLanguage} />
        )}

      </div>
    </div>
  );
}