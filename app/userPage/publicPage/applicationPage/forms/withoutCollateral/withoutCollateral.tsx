'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import desktop/mobile layouts
const DesktopForm = dynamic(() => import("./desktop"), { ssr: false });
const MobileForm = dynamic(() => import("./mobile"), { ssr: false });

// Props interface
interface WithoutCollateralWrapperProps {
  language: "en" | "ceb";
}

// Hook to detect mobile screens
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function WithoutCollateralWrapper({ language }: WithoutCollateralWrapperProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileForm language={language} />
  ) : (
    <DesktopForm language={language} />
  );
}
