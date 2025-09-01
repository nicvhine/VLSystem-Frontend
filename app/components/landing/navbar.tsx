"use client";

import Link from 'next/link';
import { useState, Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import SimulatorModal from './loanSimulator';
import LoginModal from './LoginModal/page';
import TrackModal from './trackModal';

interface NavbarProps {
  language: 'en' | 'ceb';
  setLanguage: Dispatch<SetStateAction<'en' | 'ceb'>>;
}

export default function Navbar({ language, setLanguage }: NavbarProps) {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoanSimulatorOpen, setIsLoanSimulatorOpen] = useState(false);
  
  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const navItems = [
    { name: language === 'en' ? 'Loan Simulator' : 'Simulasyon sa Utang', href: '#', onClick: () => setIsLoanSimulatorOpen(true),},
    { name: 'Team', href: '#team', onClick: () => smoothScrollTo('team') },
    { name: language === 'en' ? 'About Us' : 'Mahitungod Kanamo', href: "#about", onClick: () => smoothScrollTo('about') },
    { name: language === 'en' ? 'Contact Us' : 'Kontaka Kami', href: '#footer', onClick: () => smoothScrollTo('footer') },
  ];

  const isActive = (href: string) => pathname === href || (href === '#' && pathname !== '/');

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-md sticky top-0 z-20">
      <div className="w-full px-6 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            href="/ApplicationPage/page.tsx"
            className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text hover:from-red-700 hover:to-red-900 transition-all"
          >
            VLSystem
          </Link>

          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={language === "ceb"}
                onChange={() => setLanguage(language === "ceb" ? "en" : "ceb")}
              />
              <div className="relative w-12 h-6 bg-gray-300 rounded-full transition-all">
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${language === "ceb" ? "translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {language === "en" ? "English" : "Cebuano"}
              </span>
            </label>

            <button
              className="sm:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <nav className={`sm:flex ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
              <ul className="flex gap-6 items-center">
              {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                {item.onClick ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      item.onClick();
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'text-gray-600 '
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'text-gray-600 '
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}


                <li>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    {language === 'en' ? 'Login' : 'Sulod'}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <TrackModal isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
      {isLoanSimulatorOpen && (
      <SimulatorModal
        isOpen={isLoanSimulatorOpen}
        onClose={() => setIsLoanSimulatorOpen(false)}
      />
    )}
    </div>
  );
}
