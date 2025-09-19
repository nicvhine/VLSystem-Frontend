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
  );
}
