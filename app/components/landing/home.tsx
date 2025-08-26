'use client';

import { useState, useEffect } from 'react';
// Import all your section components
import HeroSection from './heroSection';
import LandingNavbar from './landingNavbar';
import AboutUsSection from './aboutussection';
import Calculator from './loanSimulator'; // Fixed path to match your import
import FeatureSection from './featuresection';
import TestimonialSection from './testimonialsection';
import Footer from './footer';
import TeamSection from './teamsection';
import LoginModal from './LoginModal/page';
import SimulatorModal from './loanSimulator';
import Navbar from './navbar';
import Page from './page';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);

  // Trigger page fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle logo click animation
  const handleLogoClick = () => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Trigger page fade animation
    setPageLoaded(false);
    setTimeout(() => setPageLoaded(true), 100);
  };

  return (
    <>
      <div className={`w-full bg-white transform transition-all duration-1000 ease-out ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Navigation */}
        <LandingNavbar 
          language={language} 
          setLanguage={setLanguage} 
          onLogoClick={handleLogoClick}
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          isCalculationOpen={isCalculationOpen}
          setIsCalculationOpen={setIsCalculationOpen}
        />
        
        {/* Main Content Sections */}
        <HeroSection language={language} />
        <FeatureSection language={language} />
        <TestimonialSection language={language} />
        <section id="team">
          <TeamSection language={language} />
        </section>
        <section id="about">
          <AboutUsSection language={language} />
        </section>
        
        {/* Footer */}
        <section id="footer">
          <Footer language={language} />
        </section>
      </div>
      
      {/* Modal components - rendered outside main container to avoid transform issues */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SimulatorModal isOpen={isCalculationOpen} onClose={() => setIsCalculationOpen(false)} language={language} />
    </>
  );
}