'use client';

// Mobile navigation list with language toggle

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  language: 'en' | 'ceb';
  setLanguage: Dispatch<SetStateAction<'en' | 'ceb'>>;
}

export default function MobileMenu({ navItems, language, setLanguage }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div className="md:hidden mt-4 space-y-2">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center space-x-3 px-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={language === 'ceb'}
            onChange={() => {
              const newLanguage = language === 'en' ? 'ceb' : 'en';
              setLanguage(newLanguage);
              // Also dispatch event for mobile menu (navbar will handle the storage)
            }}
          />
          <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                language === 'ceb' ? 'translate-x-6' : ''
              }`}
            />
          </div>
          <span className="text-gray-900 ml-3 text-sm font-medium">
            {language === 'en' ? 'English' : 'Cebuano'}
          </span>
        </label>
      </div>
    </div>
  );
}
