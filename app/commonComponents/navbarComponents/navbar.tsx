'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useProfilePic from './profilePic';
import { getManagerNavItems, getLoanOfficerNavItems, getHeadNavItems} from './navItems';
import useAccountSettings from './accountSettings';
import MobileMenu from './mobileMenu';
import ProfileDropdown from './dropdown';
import { Bell } from 'lucide-react';

interface NavbarProps {
  role: 'manager' | 'loanOfficer' | 'head' | 'collector';
  isBlurred?: boolean;
}

export default function Navbar({ role, isBlurred = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Language state
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(`${role}Language`) as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // Nav items
  const [navItems, setNavItems] = useState(() => {
    if (role === 'manager') return getManagerNavItems(language);
    if (role === 'head') return getHeadNavItems(language);
    if (role === 'loanOfficer') return getLoanOfficerNavItems(language);
    return []; 
  });
  

  // Profile & dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [roleState, setRoleState] = useState('');

  const { profilePic, setProfilePic, previewPic, setPreviewPic, originalPic, setOriginalPic, isUploadingPic, handleFileChange, handleSaveProfilePic, handleCancelUpload } = useProfilePic();
  const { setNotificationPreferences } = useAccountSettings();

  const [notifications, setNotifications] = useState<any[]>([]);

  // Load user data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedName = localStorage.getItem('fullName');
    const storedEmail = localStorage.getItem('email');
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    const storedUsername = localStorage.getItem('username');
    const storedPic = localStorage.getItem('profilePic');
    const storedRole = localStorage.getItem('role');
    const storedNotifications = localStorage.getItem('notificationPreferences');

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
    if (storedUsername) setUsername(storedUsername);
    if (storedPic) {
      setProfilePic(storedPic);
      setOriginalPic(storedPic);
    }
    if (storedRole) setRoleState(storedRole);

    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotificationPreferences({
        sms: parsed.sms || false,
        email: parsed.email ?? true,
      });
    }

    // Only load notifications for manager
    if (role === 'manager') {
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
          .catch(console.error);
      }
    }
  }, [role]);

  // Language change
  useEffect(() => {
    localStorage.setItem(`${role}Language`, language);
  
    if (role === 'manager') setNavItems(getManagerNavItems(language));
    else if (role === 'head') setNavItems(getHeadNavItems(language));
    else if (role === 'loanOfficer') setNavItems(getLoanOfficerNavItems(language));
    else setNavItems([]);
  
    window.dispatchEvent(
      new CustomEvent('languageChange', { detail: { language, userType: role } })
    );
  }, [language, role]);
  
  

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleToggleNotifs = () => setShowNotifs((prev) => {
    if (!prev) setIsDropdownOpen(false);
    return !prev;
  });
  const handleToggleDropdown = () => setIsDropdownOpen((prev) => {
    if (!prev) setShowNotifs(false);
    return !prev;
  });

  return (
    <div className={`w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm ${isBlurred ? 'relative z-40 blur-sm' : 'sticky top-0 z-50'} transition-all duration-150`}>
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href={role === 'manager' ? '/userPage/managerPage/dashboard' : '/userPage/loanOfficerPage/dashboard'} className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all">
            <span>VLSystem</span>
          </Link>

          <button className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-white bg-red-600 hover:bg-red-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Language switcher */}
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={language === 'ceb'} onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')} />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${language === 'ceb' ? 'translate-x-6' : ''}`} />
              </div>
              <span className="text-gray-900 ml-3 text-sm font-medium">{language === 'en' ? 'English' : 'Cebuano'}</span>
            </label>

            {/* Manager notifications */}
            {role === 'manager' && (
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
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 mt-3 overflow-hidden" style={{ position: 'fixed', top: '4rem', right: '1rem', zIndex: 9999 }}>
                    {/* ...notifications UI same as before */}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all" onClick={handleToggleDropdown}>
                {previewPic || profilePic ? (
                  <Image src={previewPic || profilePic || '/idPic.jpg'} alt="Profile" width={40} height={40} className="object-cover w-full h-full rounded-full" />
                ) : (
                  <span className="text-gray-700 font-semibold text-sm">{name ? name.charAt(0).toUpperCase() : 'U'}</span>
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
                  isEditing={false} // handle editing logic separately if needed
                  setIsEditing={() => {}}
                />
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && <MobileMenu navItems={navItems} language={language} setLanguage={setLanguage} />}
      </div>
    </div>
  );
}
