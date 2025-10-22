'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLandingNavItems } from '@/app/commonComponents/navbarComponents/navItems';

interface LandingNavbarProps {
  language: 'en' | 'ceb';
  setLanguage: (lang: 'en' | 'ceb') => void;
  onLogoClick?: () => void;
  isLoginOpen?: boolean;
  setIsLoginOpen?: (open: boolean) => void;
  isCalculationOpen?: boolean;
  setIsCalculationOpen?: (open: boolean) => void;
}

export default function LandingNavbar({ 
  language, 
  setLanguage, 
  onLogoClick,
  isLoginOpen: parentIsLoginOpen,
  setIsLoginOpen: parentSetIsLoginOpen,
  isCalculationOpen: parentIsCalculationOpen,
  setIsCalculationOpen: parentSetIsCalculationOpen
}: LandingNavbarProps) {

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State wiring: prefer parent state when provided, fallback to local
  const [localIsCalculationOpen, setLocalIsCalculationOpen] = useState(false);
  const [localIsLoginOpen, setLocalIsLoginOpen] = useState(false);
  
  const isCalculationOpen = parentIsCalculationOpen !== undefined ? parentIsCalculationOpen : localIsCalculationOpen;
  const setIsCalculationOpen = parentSetIsCalculationOpen || setLocalIsCalculationOpen;
  const isLoginOpen = parentIsLoginOpen !== undefined ? parentIsLoginOpen : localIsLoginOpen;
  const setIsLoginOpen = parentSetIsLoginOpen || setLocalIsLoginOpen;

  // Paths that only show language toggle + login button
  const minimalPaths = ['/userPage/publicPage/applyLoan'];
  const isMinimalNavbar = minimalPaths.some(path => pathname.startsWith(path));

  // Smooth scroll (used for full nav)
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems: LandingNavItem[] = getLandingNavItems(language, smoothScrollTo, setIsCalculationOpen);

  return (
    <header className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text hover:from-red-700 hover:to-red-900 transition-all"
          >
            VLSystem
          </Link>

          {/* ✅ Minimal navbar (userPage, publicPage, applyLoan) */}
          {isMinimalNavbar ? (
            <div className="flex items-center gap-6">
              {/* Language toggle */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={language === 'ceb'}
                  onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${language === 'ceb' ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {language === 'en' ? 'English' : 'Cebuano'}
                </span>
              </label>

              {/* Login button */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {language === 'en' ? 'Login' : 'Sulod'}
              </button>
            </div>
          ) : (
            <>
              {/* 🌐 Full desktop nav */}
              <nav className="hidden sm:flex items-center gap-9">
                {/* Language toggle */}
                <label className="flex items-center cursor-pointer mr-2">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={language === 'ceb'}
                    onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
                  />
                  <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${language === 'ceb' ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {language === 'en' ? 'English' : 'Cebuano'}
                  </span>
                </label>

                {/* Loan simulator */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navItems[0].onClick && navItems[0].onClick();
                  }}
                  className="text-sm font-medium text-black hover:text-gray-900 transition"
                >
                  {navItems[0].name}
                </button>

                {/* Section links */}
                {navItems.slice(1).map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.onClick) item.onClick();
                    }}
                    className="text-sm font-medium text-black hover:text-gray-900 transition"
                  >
                    {item.name}
                  </button>
                ))}

                {/* Login button */}
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {language === 'en' ? 'Login' : 'Sulod'}
                </button>
              </nav>

              {/* 📱 Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 📱 Mobile menu (shown only when not minimal) */}
        {!isMinimalNavbar && (
          <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
            <div className="flex flex-col gap-4">
              {/* Language toggle */}
              <label className="flex items-center cursor-pointer mb-2">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={language === 'ceb'}
                  onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
                />
                <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${language === 'ceb' ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {language === 'en' ? 'English' : 'Cebuano'}
                </span>
              </label>

              {/* Loan simulator */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navItems[0].onClick && navItems[0].onClick();
                  setIsMenuOpen(false);
                }}
                className="text-base font-medium text-gray-900 hover:text-gray-700 text-left"
              >
                {navItems[0].name}
              </button>

              {/* Section links */}
              {navItems.slice(1).map((item) => (
                <button
                  key={item.name + '-mobile'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="text-base font-medium text-gray-900 hover:text-gray-700 text-left"
                >
                  {item.name}
                </button>
              ))}

              {/* Login button */}
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
              >
                {language === 'en' ? 'Login' : 'Sulod'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
