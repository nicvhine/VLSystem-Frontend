'use client';

import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal/page';
import SimulatorModal from './loanSimulator';

interface LandingNavbarProps {
  language: 'en' | 'ceb';
  setLanguage: (lang: 'en' | 'ceb') => void;
}

export default function LandingNavbar({ language, setLanguage }: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItems = [
    { name: language === 'en' ? 'Loan Simulator' : 'Simulasyon sa Utang', href: '#', onClick: () => setIsCalculationOpen(true) },
    { name: 'Team', href: '#team' },
    { name: language === 'en' ? 'About Us' : 'Mahitungod Kanamo', href: '#about' },
    { name: language === 'en' ? 'Contact Us' : 'Kontaka Kami', href: '#footer' },
  ];

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

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-9">
            {/* Language Toggle - left of Loan Simulator */}
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
            {/* Loan Simulator (first nav item) */}
            <Link
              key={navItems[0].name}
              href={navItems[0].href}
              onClick={(e) => {
                e.preventDefault();
                if (navItems[0].onClick) navItems[0].onClick();
              }}
              className="text-sm font-medium text-black hover:text-gray-900 transition"
            >
              {navItems[0].name}
            </Link>
            {/* Other nav items */}
            {navItems.slice(1).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className="text-sm font-medium text-black hover:text-gray-900 transition"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {language === 'en' ? 'Login' : 'Sulod'}
            </button>
          </nav>

          {/* Mobile menu button */}
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

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
          <div className="flex flex-col gap-4">
            {/* Language Toggle - left of Loan Simulator */}
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
            {/* Loan Simulator (first nav item) */}
            <Link
              key={navItems[0].name + '-mobile'}
              href={navItems[0].href}
              onClick={(e) => {
                e.preventDefault();
                if (navItems[0].onClick) navItems[0].onClick();
              }}
              className="text-base font-medium text-gray-900 hover:text-gray-700"
            >
              {navItems[0].name}
            </Link>
            {/* Other nav items */}
            {navItems.slice(1).map((item) => (
              <Link
                key={item.name + '-mobile'}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className="text-base font-medium text-gray-900 hover:text-gray-700"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
            >
              {language === 'en' ? 'Login' : 'Sulod'}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* @ts-expect-error: language prop is supported in our LoginModal and SimulatorModal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} language={language} />
      <SimulatorModal isOpen={isCalculationOpen} onClose={() => setIsCalculationOpen(false)} language={language} />
    </header>
  );
}
