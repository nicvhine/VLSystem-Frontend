'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

import useProfilePic from './profilePic';
import useAccountSettings from './accountSettings';
import MobileMenu from './mobileMenu';
import ProfileDropdown from './dropdown';
import {
  getManagerNavItems,
  getLoanOfficerNavItems,
  getHeadNavItems,
  getBorrowerNavItems,
} from './navItems';

interface NavbarProps {
  role: 'manager' | 'loanOfficer' | 'head' | 'collector' | 'borrower';
  isBlurred?: boolean;
}

export default function Navbar({ role, isBlurred = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(`${role}Language`) as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // 🌐 Dynamic Nav Items
  const [navItems, setNavItems] = useState(() => {
    switch (role) {
      case 'manager':
        return getManagerNavItems(language);
      case 'head':
        return getHeadNavItems(language);
      case 'loanOfficer':
        return getLoanOfficerNavItems(language);
      case 'borrower':
        return getBorrowerNavItems(language);
      default:
        return [];
    }
  });

  // 👤 Profile and dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [roleState, setRoleState] = useState('');

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

  // 🧩 Load user data and notifications
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setName(localStorage.getItem('fullName') || '');
    setEmail(localStorage.getItem('email') || '');
    setPhoneNumber(localStorage.getItem('phoneNumber') || '');
    setUsername(localStorage.getItem('username') || '');
    setRoleState(localStorage.getItem('role') || '');

    const storedPic = localStorage.getItem('profilePic');
    if (storedPic) {
      setProfilePic(storedPic);
      setOriginalPic(storedPic);
    }

    const storedNotifications = localStorage.getItem('notificationPreferences');
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotificationPreferences({
        sms: parsed.sms || false,
        email: parsed.email ?? true,
      });
    }

    const token = localStorage.getItem('token');
    if (token && role) {
      fetch(`http://localhost:3001/notifications/${role}`, {
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
        .catch(console.error);
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem(`${role}Language`, language);

    switch (role) {
      case 'manager':
        setNavItems(getManagerNavItems(language));
        break;
      case 'head':
        setNavItems(getHeadNavItems(language));
        break;
      case 'loanOfficer':
        setNavItems(getLoanOfficerNavItems(language));
        break;
      case 'borrower':
        setNavItems(getBorrowerNavItems(language));
        break;
      default:
        setNavItems([]);
    }

    window.dispatchEvent(
      new CustomEvent('languageChange', { detail: { language, userType: role } })
    );
  }, [language, role]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);
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
          {/* Logo / Home Link */}
          <Link
            href={
              role === 'manager'
                ? '/userPage/managerPage/dashboard'
                : role === 'loanOfficer'
                ? '/userPage/loanOfficerPage/dashboard'
                : role === 'borrower'
                ? '/userPage/borrowerPage/dashboard'
                : '/'
            }
            className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
          >
            <span>VLSystem</span>
          </Link>

          {/* Mobile Toggle */}
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
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation */}
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
                />
              </div>
              <span className="text-gray-900 ml-3 text-sm font-medium">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={handleToggleNotifs}
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div
                  className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 mt-3 overflow-hidden fixed right-4 top-16 z-[9999]"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-700">
                      {language === 'ceb' ? 'Mga Notipikasyon' : 'Notifications'}
                    </h3>
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:3001/notifications/${role}/read-all`, {
                              method: 'PUT',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                          } catch (err) {
                            console.error('Failed to mark all as read:', err);
                          }
                        }}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        {language === 'ceb' ? 'Markahi tanan nga nabasa' : 'Mark all as read'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2.5 border-b last:border-none cursor-pointer transition-colors duration-150 ${
                            !notif.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const notifId = notif._id || notif.id;
                              if (!notif.read) {
                                await fetch(`http://localhost:3001/notifications/${role}/${notifId}/read`, {
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
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500">{notif.date}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        {language === 'ceb' ? 'Walay notipikasyon' : 'No notifications'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                onClick={handleToggleDropdown}
              >
                {previewPic || profilePic ? (
               <Image
               src={profilePic || '/idPic.jpg'} 
               alt="Profile"
               width={40}
               height={40}
               className="object-cover w-full h-full rounded-full"
             />
             
                   
                        
                ) : (
                  <span className="text-gray-700 font-semibold text-sm">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>

              {isDropdownOpen && (
                <ProfileDropdown
                  name={name}
                  email={email}
                  phoneNumber={phoneNumber}
                  username={username}
                  role={roleState}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  profilePic={profilePic || ''}
                  previewPic={previewPic || ''}
                  isUploadingPic={isUploadingPic}
                  handleFileChange={handleFileChange}
                  handleSaveProfilePic={handleSaveProfilePic}
                  handleCancelUpload={handleCancelUpload}
                  isEditing={false}
                  setIsEditing={() => {}}
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
