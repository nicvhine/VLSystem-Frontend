import { Dispatch, SetStateAction } from 'react';

export interface NavItem {
    name: string;
    href: string;
}

export interface LandingNavItem {
  name: string;
  href: string;
  onClick?: () => void;
}

export interface MobileMenuProps {
  navItems: NavItem[];
  language: 'en' | 'ceb';
  setLanguage: Dispatch<SetStateAction<'en' | 'ceb'>>;
}

export interface NavbarProps {
  role: 'manager' | 'loanOfficer' | 'head' | 'collector' | 'borrower';
  isBlurred?: boolean;
}
