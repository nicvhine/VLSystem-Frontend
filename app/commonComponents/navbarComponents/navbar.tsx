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
import { NavbarProps } from '../utils/Types/navbar';

export default function Navbar({ role, isBlurred = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Single language state synced with localStorage
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en');
      }
      return (localStorage.getItem('language') as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  // Load user data, role, notifications
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
          const notificationsArray = data.notifications || [];
          const normalized = notificationsArray.map((n: any) => ({
            ...n,
            read: n.read ?? n.viewed ?? false,
          }));
          setNotifications(normalized);        
        })
        .catch(console.error);
    }
  }, [role]);

  // Sync language with localStorage and nav items
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('language', language);

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
              {/* Notifications dropdown styled like profile dropdown */}
              <div
                className={`bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-xl w-96 mt-3 p-0 mr-4 relative transition-all duration-300 ease-out transform
                  ${showNotifs ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                style={{ position: 'fixed', top: '4rem', right: 0, zIndex: 9999, maxHeight: '68vh', overflowY: 'auto' }}
                aria-hidden={!showNotifs}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 sticky top-0">
                  <h3 className="text-sm font-semibold text-gray-700">
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
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {language === 'ceb' ? 'Markahi tanan nga nabasa' : 'Mark all as read'}
                    </button>
                  )}
                </div>

                <div className="max-h-[52vh] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => {
                      const displayName =
                        notif.actorName || notif.actor?.name || notif.userName || notif.sender || 'System';
                      const roleText = (notif.actorRole || notif.actor?.role || notif.role || '').toString();
                      const initial = (displayName || 'S').toString().trim().charAt(0).toUpperCase();
                      const dateValue = pickNotifDate(notif);
                      const rel = formatRelative(dateValue);
                      const full = formatFull(dateValue);
                      return (
                        <div
                          key={idx}
                          className={`px-4 py-2 border-b border-gray-100 last:border-none cursor-pointer transition-colors duration-150 ${
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
                                  prev.map((n) => ((n._id || n.id) === notifId ? { ...n, read: true } : n))
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
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-sm">
                              {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                                  {roleText && <p className="text-[11px] text-gray-500 capitalize -mt-0.5">{roleText}</p>}
                                </div>
                                <div className="ml-2 shrink-0">{getStatusIcon(notif.message)}</div>
                              </div>
                              <p
                                className="text-[13px] text-gray-800 mt-0.5 leading-snug break-words"
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                title={notif.message}
                              >
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500" title={full}>
                                <span>{full || '-'}</span>
                                {rel && (
                                  <>
                                    <span className="text-[10px] text-gray-400">•</span>
                                    <span>{rel}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-5">
                      {language === 'ceb' ? 'Walay notipikasyon' : 'No notifications'}
                    </p>
                  )}
                </div>
              </div>
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

              {/* Always render ProfileDropdown to allow open/close animation like notifications */}
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
                  isEditing={isEditingProfile}
                  setIsEditing={setIsEditingProfile}
                />
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
