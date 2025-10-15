'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useProfilePic from '../../../commonComponents/navbarComponents/profilePic';
import { getManagerNavItems } from '../../../commonComponents/navbarComponents/navItems';
import useAccountSettings from '../../../commonComponents/navbarComponents/accountSettings';
import MobileMenu from '../../../commonComponents/navbarComponents/mobileMenu';
import ProfileDropdown from '../../../commonComponents/navbarComponents/dropdown';
import { Bell } from 'lucide-react';
import { capitalizeWords } from '../../../commonComponents/modals/loanAgreement/logic';

/**
 * Navbar component for manager pages
 * Provides navigation, profile management, notifications, and language switching functionality
 * @param isBlurred - Optional prop to apply blur effect to the navbar
 * @returns JSX element containing the manager navbar
 */
export default function ManagerNavbar({ isBlurred = false }: { isBlurred?: boolean }) {
  // UI state management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Language state with localStorage persistence
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('managerLanguage') as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });
  const [navItems, setNavItems] = useState(getManagerNavItems(language));

  // Navigation and routing
  const pathname = usePathname();
  const router = useRouter();

  // User profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState('');
  
  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const {
    profilePic,
    setProfilePic,
    previewPic,
    setPreviewPic,
    originalPic,
    setOriginalPic,
    isUploadingPic,
    handleFileChange,
    handleSaveProfilePic,
    handleCancelUpload,
  } = useProfilePic();

  const { setNotificationPreferences } = useAccountSettings();

  // Update nav items whenever language changes
  useEffect(() => {
    setNavItems(getManagerNavItems(language));
  }, [language]);

  // Load user data and notifications
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedName = localStorage.getItem('fullName');
    const storedEmail = localStorage.getItem('email');
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    const storedUsername = localStorage.getItem('username');
    const storedPic = localStorage.getItem('profilePic');
    const storedNotifications = localStorage.getItem('notificationPreferences');
    const storedRole = localStorage.getItem('role');

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
    if (storedUsername) setUsername(storedUsername);
    if (storedPic) {
      setProfilePic(storedPic);
      setOriginalPic(storedPic);
    }
    if (storedRole) setRole(storedRole);

    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotificationPreferences({
        sms: parsed.sms || false,
        email: parsed.email ?? true,
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:3001/notifications/manager`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const normalized = (data || []).map((n: any) => ({
            ...n,
            read: n.read ?? n.viewed ?? false,
          }));
          setNotifications(normalized);
        })
        .catch((err) => console.error('Failed to load notifications:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
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

  return (
    <div
      className={`w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm ${
        isBlurred ? 'relative z-40 blur-sm' : 'sticky top-0 z-50'
      } transition-all duration-150`}
    >
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/userPage/managerPage/dashboard"
            className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
          >
            <span>VLSystem</span>
          </Link>

          {/* Mobile menu toggle */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-white bg-red-600 hover:bg-red-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Language switcher */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'ceb'}
                onChange={() => {
                  const newLang = language === 'en' ? 'ceb' : 'en';
                  setLanguage(newLang);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('managerLanguage', newLang);
                    window.dispatchEvent(
                      new CustomEvent('languageChange', { detail: { language: newLang, userType: 'manager' } })
                    );
                  }
                }}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    language === 'ceb' ? 'translate-x-6' : ''
                  }`}
                />
              </div>
              <span className="text-gray-900 ml-3 text-sm font-medium">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-full hover:bg-gray-100" onClick={handleToggleNotifs}>
                <Bell className="h-5 w-5 text-gray-700" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div
                  className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-96 mt-3 overflow-hidden"
                  style={{ position: 'fixed', top: '4rem', right: '1rem', zIndex: 9999 }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {language === 'ceb' ? 'Mga Notipikasyon' : 'Notifications'}
                    </h3>
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await fetch('http://localhost:3001/notifications/manager/read-all', {
                              method: 'PUT',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                          } catch (err) {
                            console.error('Failed to mark all as read:', err);
                          }
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {language === 'ceb' ? 'Markahi tanan nga nabasa' : 'Mark all as read'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-3 border-b last:border-none cursor-pointer transition-colors duration-150 ${
                            !notif.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const notifId = notif._id || notif.id;
                              if (!notif.read) {
                                await fetch(`http://localhost:3001/notifications/manager/${notifId}/read`, {
                                  method: 'PUT',
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    (n._id || n.id) === notifId ? { ...n, read: true } : n
                                  )
                                );
                              }
                              if (notif.applicationId) {
                                router.push(`/commonComponents/loanApplication/${notif.applicationId}`);
                              }
                            } catch (err) {
                              console.error('Failed to mark notification as read:', err);
                            }
                          }}
                        >
                          <div className="flex items-start gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                              {notif.actorProfilePic ? (
                                <Image
                                  src={notif.actorProfilePic}
                                  alt={notif.actorName || 'Profile'}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <span className="text-gray-400 text-2xl font-bold">
                                  {notif.actorName ? notif.actorName.charAt(0).toUpperCase() : 'U'}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                              <div className="font-semibold text-base text-gray-900 leading-tight">
                                {capitalizeWords(notif.actorName) || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500 mb-2">
                                {notif.actorRole ? capitalizeWords(notif.actorRole) : 'Loan Officer'}
                              </div>
                              <div className="text-sm text-gray-800 mb-1">
                                {translateNotificationMessage(notif, language)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(notif.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                        {language === 'ceb' ? 'Walay mga notipikasyon' : 'No notifications'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
            <div
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
              onClick={handleToggleDropdown}
            >
              {previewPic || profilePic ? (
                <Image
                  src={previewPic || profilePic || '/idPic.jpg'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="text-gray-700 font-semibold text-sm">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
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

        {isMobileMenuOpen && (
          <MobileMenu navItems={navItems} language={language} setLanguage={setLanguage} />
        )}
      </div>
    </div>
  );
}

// Notification translation helper
function translateNotificationMessage(notif: any, language: 'en' | 'ceb') {
  const msg: string = notif?.message || '';
  const changedRegex = /has changed application\s+(\S+)\s+to\s+(\w+)/i;
  const m = msg.match(changedRegex);
  if (m) {
    const applicationId = m[1];
    const status = (m[2] || '').toLowerCase();
    const statusMap: Record<string, { en: string; ceb: string }> = {
      disbursed: { en: 'Disbursed', ceb: 'Gi-hatag' },
      cleared: { en: 'Cleared', ceb: 'Gi-clear' },
      pending: { en: 'Pending', ceb: 'Naghulat' },
      approved: { en: 'Approved', ceb: 'Gi-aprubahan' },
      denied: { en: 'Denied', ceb: 'Gi-balibaran' },
    };
    const statusText = statusMap[status]?.[language] || m[2];
    return language === 'ceb'
      ? `Ang Loan Officer nag-usab sa aplikasyon ${applicationId} ngadto sa ${statusText}`
      : `Loan Officer has changed application ${applicationId} to ${statusText}`;
  }
  return msg;
}
