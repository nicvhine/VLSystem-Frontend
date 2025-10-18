'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import useProfilePic from '../../../commonComponents/navbarComponents/profilePic';
import useAccountSettings from '../../../commonComponents/navbarComponents/accountSettings';
import MobileMenu from '../../../commonComponents/navbarComponents/mobileMenu';
import ProfileDropdown from '../../../commonComponents/navbarComponents/dropdown';

/**
 * Navbar component for borrower pages
 * Provides navigation, profile management, and language switching functionality
 * @param isBlurred - Optional prop to apply blur effect to the navbar
 * @returns JSX element containing the borrower navbar
 */
export default function BorrowerNavbar({ isBlurred = false }: { isBlurred?: boolean }) {
  // UI state management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  
  // Navigation and routing
  const pathname = usePathname();
  const router = useRouter();
  
  // User profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState('');



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
    const storedRole = localStorage.getItem('role');

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
    if (storedRole) setRole(storedRole);
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

  // Add new toggle functions to ensure only one dropdown is open at a time
  const [showNotifs, setShowNotifs] = useState(false);
  const handleToggleNotifs = () => {
    setShowNotifs((prev) => {
      if (!prev) setIsDropdownOpen(false);
      return !prev;
    });
  };
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => {
      if (!prev) setShowNotifs(false);
      return !prev;
    });
  };

  // Borrower notifications state and fetch
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const borrowersId = localStorage.getItem('borrowersId');
    if (!borrowersId) return;
    fetch(`http://localhost:3001/notifications/${borrowersId}`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map((n: any) => ({
          ...n,
          read: n.read ?? n.viewed ?? false,
        }));
        setNotifications(normalized);
      })
      .catch(console.error);
  }, []);

  return (
  <div className={`w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm ${isBlurred ? 'relative z-40' : 'sticky top-0 z-50'} ${isBlurred ? 'blur-sm' : ''} transition-all duration-150`}>
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/userPage/borrowerPage/dashboard"
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

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-full hover:bg-gray-100" onClick={handleToggleNotifs}>
                <Bell className="h-5 w-5 text-gray-700" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-96 mt-3 overflow-hidden" style={{ position: 'fixed', top: '4rem', right: '1rem', zIndex: 9999 }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                    <span className="text-sm font-semibold text-gray-800">Notifications</span>
                    <button
                      className="text-xs text-red-600 hover:text-red-700"
                      onClick={async () => {
                        try {
                          const borrowersId = localStorage.getItem('borrowersId');
                          if (!borrowersId) return;
                          await fetch(`http://localhost:3001/notifications/borrower/${borrowersId}/read-all`, { method: 'PUT' });
                          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                        } catch (e) { console.error(e); }
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div key={n._id || n.id || idx} className={`px-4 py-3 border-b hover:bg-gray-50 ${n.read ? 'opacity-80' : ''}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 break-words">{n.message || n.title || 'Notification'}</p>
                              <p className="text-[11px] text-gray-500 mt-1">{new Date(n.createdAt || n.date || Date.now()).toLocaleString()}</p>
                            </div>
                            {!n.read && (
                              <button
                                className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap"
                                onClick={async () => {
                                  try {
                                    const borrowersId = localStorage.getItem('borrowersId');
                                    if (!borrowersId) return;
                                    const id = n._id || n.id;
                                    if (!id) return;
                                    await fetch(`http://localhost:3001/notifications/borrower/${borrowersId}/read/${id}`, { method: 'PUT' });
                                    setNotifications((prev) => prev.map((x) => ((x._id || x.id) === (n._id || n.id) ? { ...x, read: true } : x)));
                                  } catch (e) { console.error(e); }
                                }}
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                onClick={handleToggleDropdown}
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
              role={role}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
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

        {/* Mobile menu is currently disabled */}
        {/*
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-5 md:hidden">
            <div className="fixed top-0 left-0 w-full bg-white rounded-b-xl shadow-lg p-4 pt-20 max-h-screen overflow-y-auto">
              <MobileMenu
                navItems={[
                  { name: 'Dashboard', href: '/userPage/borrowerPage/dashboard' },
                  { name: 'Loan Application', href: '/userPage/borrowerPage/application' },
                  { name: 'Payment History', href: '/userPage/borrowerPage/payment-history' },
                  // Add more nav items as needed
                ]}
                language={language}
                setLanguage={setLanguage}
              />
            </div>
          </div>
        )}
        */}

      </div>
    </div>
  );
}