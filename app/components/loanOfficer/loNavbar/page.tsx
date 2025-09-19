'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useProfilePic from './profilePic';
import navItems from './navItems';
import useAccountSettings from './accountSettings';
import MobileMenu from './mobileMenu';
import ProfileDropdown from './dropdown';
import { Bell } from 'lucide-react';

export default function LoanOfficerNavbar() {
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
    setIsUploadingPic,
    handleFileChange,
    handleSaveProfilePic,
    handleCancelUpload,
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
    setActiveSettingsTab,
  } = useAccountSettings();

  // Load user info + notifications
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
    if (storedUsername) setUsername(storedUsername);
    if (storedPic) {
      setProfilePic(storedPic);
      setOriginalPic(storedPic);
    }
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      if (parsed.both) {
        setNotificationPreferences({ sms: true, email: true });
      } else {
        setNotificationPreferences({
          sms: parsed.sms || false,
          email: parsed.email !== undefined ? parsed.email : true,
        });
      }
    }
 
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:3001/notifications/loan-officer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          const normalized = (data || []).map((n: any) => ({
            ...n,
            read: n.read ?? n.viewed ?? false,
          }));
          setNotifications(normalized);
        })
        .catch(err => console.error("Failed to load notifications:", err));
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => {
      if (!prev) setShowNotifs(false);
      return !prev;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/notifications/loan-officer/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Mark single notif as read
  const handleMarkOneRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark one as read:', err);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/components/loanOfficer/dashboard"
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all 
                        ${
                          isActive
                            ? 'bg-red-600/90 text-white shadow-sm'
                            : 'text-gray-600 hover:text-white hover:bg-red-600/70'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Notification bell */}
            <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                setShowNotifs(prev => {
                  if (!prev) setIsDropdownOpen(false);
                  return !prev;
                });
              }}
            >
              <Bell className="h-5 w-5 text-gray-700" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {showNotifs && (
              <div
                className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-96 mt-3 overflow-hidden"
                style={{ position: "fixed", top: "4rem", right: "1rem", zIndex: 9999 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                  {notifications.some(n => !n.read) && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          await fetch("http://localhost:3001/notifications/loan-officer/read-all", {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        } catch (err) {
                          console.error("Failed to mark all as read:", err);
                        }
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 border-b last:border-none cursor-pointer transition-colors duration-150 
                          ${!notif.read ? "bg-blue-50" : "hover:bg-gray-50"}`}
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              const notifId = notif._id || notif.id;
                          
                              if (!notif.read) {
                                await fetch(
                                  `http://localhost:3001/notifications/loan-officer/${notifId}/read`,
                                  {
                                    method: "PUT",
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                          
                                setNotifications(prev =>
                                  prev.map(n =>
                                    (n._id || n.id) === notifId ? { ...n, read: true } : n
                                  )
                                );
                              }
                          
                              if (notif.applicationId) {
                                router.push(`/components/loanOfficer/applications/${notif.applicationId}`);
                              }
                              
                            } catch (err) {
                              console.error("Failed to mark notification as read:", err);
                            }
                          }}
                          
                      >
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  )}
                </div>  
                  
                </div>
              )}
            </div>

            {/* Profile dropdown */}
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
          <MobileMenu
            navItems={navItems}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </div>
    </div>
  );
}
