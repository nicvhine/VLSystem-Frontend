"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Dynamically import desktop/mobile layouts
const DesktopForm = dynamic(() => import("./desktop"), { ssr: false });
const MobileForm = dynamic(() => import("./mobile"), { ssr: false });

// Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Props interface
export interface CommonProps {
  appName: string;
  setAppName: React.Dispatch<React.SetStateAction<string>>;
  appDob: string;
  setAppDob: React.Dispatch<React.SetStateAction<string>>;
  appContact: string;
  setAppContact: React.Dispatch<React.SetStateAction<string>>;
  appEmail: string;
  setAppEmail: React.Dispatch<React.SetStateAction<string>>;
  appMarital: string;
  setAppMarital: React.Dispatch<React.SetStateAction<string>>;
  appChildren: number;
  setAppChildren: React.Dispatch<React.SetStateAction<number>>;
  appSpouseName: string;
  setAppSpouseName: React.Dispatch<React.SetStateAction<string>>;
  appSpouseOccupation: string;
  setAppSpouseOccupation: React.Dispatch<React.SetStateAction<string>>;
  appAddress: string;
  setAppAddress: React.Dispatch<React.SetStateAction<string>>;
  appTypeBusiness: string;
  setAppTypeBusiness: React.Dispatch<React.SetStateAction<string>>;
  appBusinessName: string;
  setAppBusinessName: React.Dispatch<React.SetStateAction<string>>;
  appDateStarted: string;
  setAppDateStarted: React.Dispatch<React.SetStateAction<string>>;
  appBusinessLoc: string;
  setAppBusinessLoc: React.Dispatch<React.SetStateAction<string>>;
  appMonthlyIncome: number;
  setAppMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  appOccupation: string;
  setAppOccupation: React.Dispatch<React.SetStateAction<string>>;
  appReferences: { name: string; contact: string; relation: string }[];
  setAppReferences: React.Dispatch<
    React.SetStateAction<{ name: string; contact: string; relation: string }[]>
  >;
  appEmploymentStatus: string;
  setAppEmploymentStatus: React.Dispatch<React.SetStateAction<string>>;
  appCompanyName: string;
  setAppCompanyName: React.Dispatch<React.SetStateAction<string>>;
  sourceOfIncome: string;
  setSourceOfIncome: React.Dispatch<React.SetStateAction<string>>;
  language: "en" | "ceb";
}

// Hook to detect screen width
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

// Common wrapper component
export default function Common(props: CommonProps) {
  const isMobile = useIsMobile();

  // Marker state for map
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );

  // Shared address handler
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setAppAddress(e.target.value);
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: e.target.value, format: "json", limit: 1 },
        }
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch {}
  };

  // All props + map props to pass down
  const formProps = {
    ...props,
    markerPosition,
    setMarkerPosition,
    handleAddressChange,
    customIcon,
  };

  return isMobile ? (
    <MobileForm {...formProps} />
  ) : (
    <DesktopForm {...formProps} />
  );
}
