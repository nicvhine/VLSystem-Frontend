"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [language, setLanguage] = useState('English');
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('john_doe');
  const [password, setPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();
  
  const navItems = [
    { name: 'Loans', href: '/loanOfficer/loans'},
    { name: 'Applications', href: '/components/loanOfficer/applications'},
    { name: 'Agents', href: '/loanOfficer/agents'},
    { name: 'Collections', href: '/loanOfficer/collections'},
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New Password and Confirm Password do not match.');
    } else {
      setPasswordError('');
      setIsEditing(!isEditing);
    }
  };

  
  const handleLogout = () => {
    router.push('/');
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

         
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
             {/* language selector */}
          <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === "ceb"}
                onChange={() => setLanguage(language === "en" ? "ceb" : "en")}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                    language === "ceb" ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className=" text-gray-900 ml-3 text-sm font-medium">
                {language === "en" ? "English" : "Cebuano"}
              </span>
            </label>
            <nav>
              <ul className="flex items-center space-x-6">
                {navItems.map((item) => {
                  // const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {/* <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} /> */}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
             

            {/* Profile Dropdown */}
                        <div className="relative">
                          <div
                            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-900 ring-offset-2 cursor-pointer hover:ring-4 transition-all"
                            onClick={toggleDropdown}
                          >
                            <Image src="/idPic.jpg" alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                          </div>
            
                          {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 p-5 transition-all">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
            
                              <div className="space-y-4">
                                {isEditing && (
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                      <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                      />
                                    </div>
            
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                      <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                      />
                                    </div>
            
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                      <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                      />
                                    </div>
            
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                      <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                      />
                                    </div>
            
                                    {passwordError && (
                                      <p className="text-sm text-red-600">{passwordError}</p>
                                    )}
                                  </>
                                )}
            
                                <div className="flex flex-col gap-2 pt-3">
                                  <button
                                    onClick={handleEdit}
                                    className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                                  >
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                  </button>
                                  <button
                                    onClick={handleLogout}
                                    className="w-full py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all"
                                  >
                                    Logout
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
