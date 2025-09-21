'use client';
import { useState, useEffect } from "react";
import DesktopApplicationPage from "./desktop/page";
import MobileApplicationPage from "./mobile/page";

export default function ApplicationPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          return parsed.language || 'en';
        } catch (e) { return 'en'; }
      }
    }
    return 'en';
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Keep language updated in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          localStorage.setItem('reloanInfo', JSON.stringify({ ...parsed, language }));
        } catch (e) { console.error('Error updating language:', e); }
      }
    }
  }, [language]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? (
    <MobileApplicationPage
      language={language}
      setLanguage={setLanguage}
      isLoginOpen={isLoginOpen}
      setIsLoginOpen={setIsLoginOpen}
      showSuccessModal={showSuccessModal}
      setShowSuccessModal={setShowSuccessModal}
    />
  ) : (
    <DesktopApplicationPage
      language={language}
      setLanguage={setLanguage}
      isLoginOpen={isLoginOpen}
      setIsLoginOpen={setIsLoginOpen}
      showSuccessModal={showSuccessModal}
      setShowSuccessModal={setShowSuccessModal}
    />
  );
}
