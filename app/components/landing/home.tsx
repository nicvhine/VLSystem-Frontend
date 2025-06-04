'use client';

// Import all your section components
import HeroSection from './heroSection';
import LandingNavbar from './landingNavbar';
import AboutUsSection from './aboutussection';
import Calculator from './calculation'; // Fixed path to match your import
import FeatureSection from './featuresection';
import Footer from './footer';
import LoginModal from './loginModal';
import Navbar from './navbar';
import Page from './page';

export default function Home() {
  return (
    <div className="w-full">
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Main Content Sections */}
      <HeroSection />
      <AboutUsSection />
      <FeatureSection />
      <Calculator />
      
      {/* Footer */}
      <Footer />
      
      {/* Modal components (these typically render conditionally) */}
      {/* <LoginModal /> - Usually controlled by state */}
    </div>
  );
}