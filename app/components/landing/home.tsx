'use client';
import HeroSection from './heroSection';
import LandingNavbar from './landingNavbar';

export default function Home() {
  return (
    <div className="w-full">
      <LandingNavbar /> 
      <HeroSection />
    </div>
  );
}
