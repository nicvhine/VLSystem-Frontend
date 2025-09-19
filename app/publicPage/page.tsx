'use client';

import { useState, useEffect } from 'react';

// Sections
import HeroSection from './Sections/heroSection';
import AboutUsSection from './Sections/aboutUsSection';
import FeatureSection from './Sections/featuresection';
import TestimonialSection from './Sections/testimonialSection';
import TeamSection from './Sections/teamSection';
import Footer from './Sections/footer';

// Components
import LandingNavbar from './Navbar/landingNavbar';

// Modals
import LoginModal from './loginForm/page';
import SimulatorModal from './loanSimulator/page';
import TrackModal from './applicationTracker/page';

export default function LandingPage() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [pageLoaded, setPageLoaded] = useState(false);

  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // Trigger page fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle logo click animation
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger fade animation
    setPageLoaded(false);
    setTimeout(() => setPageLoaded(true), 100);
  };

  return (
    <>
      {/* Main Page Container */}
      <div
        className={`w-full bg-white transform transition-all duration-1000 ease-out ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
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

        {/* Main Sections */}
        <HeroSection
          language={language}
          isTrackOpen={isTrackOpen}
          setIsTrackOpen={setIsTrackOpen}
        />
        <FeatureSection language={language} />
        <TestimonialSection language={language} />

        <section id="team">
          <TeamSection language={language} />
        </section>

        <section id="about">
          <AboutUsSection language={language} />
        </section>

        <section id="footer">
          <Footer language={language} />
        </section>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <SimulatorModal
        isOpen={isCalculationOpen}
        onClose={() => setIsCalculationOpen(false)}
        language={language}
      />
      <TrackModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />
    </>
  );
}
