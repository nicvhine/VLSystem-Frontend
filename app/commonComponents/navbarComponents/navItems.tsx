import navbarTranslations from "./translations";

// Role-specific nav item generators

export const getHeadNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslations[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab3, href: '/commonComponents/collection' },
    { name: t.tab5, href: '/userPage/headPage/userPage' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};

export const getManagerNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslations[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab3, href: '/commonComponents/collection' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};

export const getLoanOfficerNavItems = (language: 'en' | 'ceb') => {
  const t = navbarTranslations[language];
  return [
    { name: t.tab1, href: '/commonComponents/loan' },
    { name: t.tab2, href: '/commonComponents/loanApplication' },
    { name: t.tab4, href: '/commonComponents/agent' },
  ];
};