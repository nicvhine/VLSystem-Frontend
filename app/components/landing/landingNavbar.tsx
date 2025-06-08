'use client';

import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './loginModal';
import SimulatorModal from './loanSimulator';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItems = [
    { name: 'Loan Simulator', href: '#', onClick: () => setIsCalculationOpen(true) },
    { name: 'Team', href: '#team' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#footer' },
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
            {navItems.map((item) => (
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
              Login
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
            {navItems.map((item) => (
              <Link
                key={item.name}
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
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SimulatorModal isOpen={isCalculationOpen} onClose={() => setIsCalculationOpen(false)} />
    </header>
  );
}
