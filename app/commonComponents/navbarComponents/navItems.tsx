import navbarTranslation from "../Translation/navbarTranslation";

export interface LandingNavItem {
  name: string;
  href: string;
  onClick?: () => void;
}

export const getHeadNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslation[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab3, href: '/commonComponents/collection' },
    { name: t.tab5, href: '/userPage/headPage/userPage' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};

export const getManagerNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslation[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab3, href: '/commonComponents/collection' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};

export const getLoanOfficerNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslation[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};

export function getBorrowerNavItems(language: 'en' | 'ceb') {
  const t = navbarTranslation[language];
  return [
    { name: t.tab11, href: '/' },
  ];
}


export const getLandingNavItems = (
  language: 'en' | 'ceb',
  smoothScrollTo: (id: string) => void,
  setIsCalculationOpen: (open: boolean) => void
): LandingNavItem[] => {
  const t = navbarTranslation[language]; 
  return [
    { name: t.tab6, href: '#', onClick: () => setIsCalculationOpen(true) },
    { name: t.tab7, href: '#team', onClick: () => smoothScrollTo('team') },
    { name: t.tab8, href: '#about', onClick: () => smoothScrollTo('about') },
    { name: t.tab9, href: '#footer', onClick: () => smoothScrollTo('footer') },
  ];
};
