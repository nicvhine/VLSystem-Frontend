'use client';

import { useState } from 'react';
// Import all your section components
import HeroSection from './heroSection';
import LandingNavbar from './landingNavbar';
import AboutUsSection from './aboutussection';
import Calculator from './calculation'; // Fixed path to match your import
import FeatureSection from './featuresection';
import TestimonialSection from './testimonialsection';
import Footer from './footer';
import TeamSection from './teamsection';
import LoginModal from './loginModal';
import Navbar from './navbar';
import Page from './page';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  return (
    <div className="w-full bg-white">
      {/* Navigation */}
      <LandingNavbar language={language} setLanguage={setLanguage} />
      
      {/* Main Content Sections */}
      <HeroSection language={language} />
      <FeatureSection language={language} />
      <TestimonialSection language={language} />
      <TeamSection language={language} />
      <AboutUsSection language={language} />
      
      {/* Footer */}
      <Footer language={language} />
      
      {/* Modal components (these typically render conditionally) */}
      {/* <LoginModal /> - Usually controlled by state */}
    </div>
  );
}