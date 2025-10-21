'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface LandingNavbarProps {
  language: 'en' | 'ceb';
  setLanguage: (lang: 'en' | 'ceb') => void;
  onLogoClick?: () => void;
  isLoginOpen?: boolean;
  setIsLoginOpen?: (open: boolean) => void;
  isCalculationOpen?: boolean;
  setIsCalculationOpen?: (open: boolean) => void;
  isModalOpen?: boolean;
  isMobile?: boolean;
}

export default function Navbar({
  language,
  setLanguage,
  onLogoClick,
  isLoginOpen: parentIsLoginOpen,
  setIsLoginOpen: parentSetIsLoginOpen,
  isCalculationOpen: parentIsCalculationOpen,
  setIsCalculationOpen: parentSetIsCalculationOpen,
  isModalOpen,
  isMobile,
}: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Local modal states (fallback if no parent props provided)
  const [localIsCalculationOpen, setLocalIsCalculationOpen] = useState(false);
  const [localIsLoginOpen, setLocalIsLoginOpen] = useState(false);

  const isCalculationOpen =
    parentIsCalculationOpen !== undefined
      ? parentIsCalculationOpen
      : localIsCalculationOpen;
  const setIsCalculationOpen =
    parentSetIsCalculationOpen || setLocalIsCalculationOpen;

  const isLoginOpen =
    parentIsLoginOpen !== undefined ? parentIsLoginOpen : localIsLoginOpen;
  const setIsLoginOpen = parentSetIsLoginOpen || setLocalIsLoginOpen;

  // Hide navbar if modal is open
  if (isModalOpen) return null;

  // Debug logs (optional)
  useEffect(() => {
    console.log('isCalculationOpen changed:', isCalculationOpen);
  }, [isCalculationOpen]);

  // Smooth scroll helper
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 border-b border-gray-200 shadow-md bg-white transition-all
        ${isModalOpen ? 'opacity-30 pointer-events-none backdrop-blur-md' : 'opacity-100'}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          {onLogoClick ? (
            <button
              onClick={onLogoClick}
              className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text hover:from-red-700 hover:to-red-900 transition-all"
            >
              VLSystem
            </button>
          ) : (
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text hover:from-red-700 hover:to-red-900 transition-all"
            >
              VLSystem
            </Link>
          )}

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-9">
            {/* Language Toggle */}
            <label className="flex items-center cursor-pointer mr-2">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'ceb'}
                onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    language === 'ceb' ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            {/* Login Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {language === 'en' ? 'Login' : 'Sulod'}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
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
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
          <div className="flex flex-col gap-4">
            {/* Language Toggle */}
            <label className="flex items-center cursor-pointer mb-2">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === 'ceb'}
                onChange={() => setLanguage(language === 'en' ? 'ceb' : 'en')}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    language === 'ceb' ? 'translate-x-6' : ''
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {language === 'en' ? 'English' : 'Cebuano'}
              </span>
            </label>

            {/* Login Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
            >
              {language === 'en' ? 'Login' : 'Sulod'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
