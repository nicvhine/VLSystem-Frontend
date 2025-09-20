'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProfileDropdown from '../../../commonComponents/navbarComponents/dropdown';
import useProfilePic from '../../../commonComponents/navbarComponents/profilePic';
import axios from 'axios';

export default function BorrowerNavbar({ isBlurred = false }: { isBlurred?: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // User state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [borrowersId, setBorrowersId] = useState('');

  // Profile pic state/hooks
  const {
    profilePic,
    previewPic,
    isUploadingPic,
    handleFileChange,
    handleSaveProfilePic,
    handleCancelUpload,
    setProfilePic
  } = useProfilePic();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
    const storedId = localStorage.getItem('borrowersId');
    const token = localStorage.getItem('token');

    if (!storedId || !token) return;

    axios
      .get(`http://localhost:3001/borrowers/${storedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setName(user.fullName || '');
        setEmail(user.email || '');
        setPhoneNumber(user.contactNumber || '');
        setUsername(user.username || '');
        setBorrowersId(user.borrowersId || '');
        if (user.profilePic) setProfilePic(user.profilePic);
      })
      .catch((err) => {
        console.error('Failed to fetch borrower info:', err);
      });
  }, [setProfilePic]);

  // Add new toggle functions to ensure only one dropdown is open at a time
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
      <div className="w-full px-6 py-3 flex items-center justify-between">
        <Link
          href="/userPage/borrowerPage/dashboard"
          className="flex items-center space-x-2 text-xl font-semibold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all"
        >
          <span>VLSystem</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
              onClick={toggleDropdown}
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

            {/* Notification bell */}
            <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100"
              onClick={handleToggleNotifs}
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
                          await fetch("http://localhost:3001/notifications/collector/read-all", {
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
                                router.push(`/components/collector/applications/${notif.applicationId}`);
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
      </div>
    </div>
  );
}
