"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});



interface CommonProps {
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
  appDateStarted: string;
  setAppDateStarted: React.Dispatch<React.SetStateAction<string>>;
  appBusinessLoc: string;
  setAppBusinessLoc: React.Dispatch<React.SetStateAction<string>>;
  appMonthlyIncome: number;
  setAppMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  appOccupation: string;
  setAppOccupation: React.Dispatch<React.SetStateAction<string>>;
  appReferences: { name: string; contact: string; relation: string }[];
  setAppReferences: React.Dispatch<React.SetStateAction<{ name: string; contact: string; relation: string }[]>>;
  appEmploymentStatus: string;
  setAppEmploymentStatus: React.Dispatch<React.SetStateAction<string>>;
  appCompanyName: string;
  setAppCompanyName: React.Dispatch<React.SetStateAction<string>>;
  sourceOfIncome: string;
  setSourceOfIncome: React.Dispatch<React.SetStateAction<string>>;
  language: 'en' | 'ceb';
};

function MapComponent({
  address,
  setAddress,
  markerPosition,
  setMarkerPosition,
}: {
  address: string;
  setAddress: (address: string) => void;
  markerPosition: [number, number] | null;
  setMarkerPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat, lon: lng, format: "json" },
        });
        const foundAddress = response.data.display_name;
        setAddress(foundAddress);
      } catch {
        setAddress(`${lat}, ${lng}`);
      }
    },
  });

  return markerPosition ? (
  <Marker position={markerPosition} icon={customIcon}>
    <Popup>{address}</Popup>
  </Marker>

  ) : null;
}

  export default function Common(props: CommonProps) {
  const {
    appName, setAppName,
    appDob, setAppDob,
    appContact, setAppContact,
    appEmail, setAppEmail,
    appMarital, setAppMarital,
    appChildren, setAppChildren,
    appSpouseName, setAppSpouseName,
    appSpouseOccupation, setAppSpouseOccupation,
    appAddress, setAppAddress,
    appTypeBusiness, setAppTypeBusiness,
    appDateStarted, setAppDateStarted,
    appBusinessLoc, setAppBusinessLoc,
    appMonthlyIncome, setAppMonthlyIncome,
    appOccupation, setAppOccupation,
    appEmploymentStatus, setAppEmploymentStatus,
    appCompanyName, setAppCompanyName,
    sourceOfIncome, setSourceOfIncome,
    appReferences, setAppReferences,
    language
  } = props;

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [refErrors, setRefErrors] = useState<string[]>(["", "", ""]);

  function validateReferenceUniqueness(
    refs: { name: string; contact: string; relation: string }[]
  ) {
    const errors = ["", "", ""];
    const nameMap = new Map<string, number[]>();
    const numberMap = new Map<string, number[]>();
  
    refs.forEach((r, idx) => {
      const nameKey = (r.name || "").trim().toLowerCase();
      const numKey = (r.contact || "").trim();
  
      if (nameKey) {
        nameMap.set(nameKey, [...(nameMap.get(nameKey) || []), idx]);
      }
      if (numKey) {
        numberMap.set(numKey, [...(numberMap.get(numKey) || []), idx]);
      }
    });
  
    nameMap.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((i) => {
          errors[i] = errors[i]
            ? errors[i] + " • Duplicate name"
            : "Duplicate name";
        });
      }
    });
  
    numberMap.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((i) => {
          errors[i] = errors[i]
            ? errors[i] + " • Duplicate contact number"
            : "Duplicate contact number";
        });
      }
    });
  
    setRefErrors(errors);
    return errors.every((e) => !e);
  }

  const handleReferenceChange = (
    index: number,
    field: "name" | "contact" | "relation",
    value: string
  ) => {
    const updated = [...props.appReferences];
  
    for (let i = 0; i < 3; i++) {
      if (!updated[i]) updated[i] = { name: "", contact: "", relation: "" };
    }
  
    updated[index][field] = value;
    props.setAppReferences(updated);
  
    validateReferenceUniqueness(updated);
  };
  
  function isValidPHMobile(num: string) {
    const trimmed = (num || "").trim();
    return /^09\d{9}$/.test(trimmed) || /^\+639\d{9}$/.test(trimmed);
  }

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setAppAddress(e.target.value);
    // Geocode the address to update the marker
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: e.target.value, format: "json", limit: 1 },
      });
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch {
      // Ignore geocode errors
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6" >
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Basic Information' : 'Pangunang Impormasyon'}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Name:' : 'Ngalan:'}</label>
            <input
              type="text"
              value={appName} 
              onChange={(e) => setAppName(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter your full name' : 'Isulod ang imong tibuok ngalan'}
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Date of Birth:' : 'Petsa sa Pagkatawo:'}</label>
            <input
              type="date"
              value={appDob}        
              onChange={(e) => setAppDob(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Contact Number:' : 'Numero sa Kontak:'}</label>
            <input
              type="text"
              value={appContact}
              onChange={(e) => setAppContact(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter contact number' : 'Isulod ang numero sa kontak'}
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Email Address:' : 'Email Address:'}</label>
            <input
              type="email"        
              value={appEmail}
              onChange={(e) => setAppEmail(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter email address' : 'Isulod ang email address'}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Marital Status:' : 'Sibil nga Kahimtang:'}</label>
            <select
              value={appMarital}
              onChange={(e) => setAppMarital(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">{language === 'en' ? 'Select Status' : 'Pilia ang Kahimtang'}</option>
              <option value="Single">{language === 'en' ? 'Single' : 'Walay Bana/Asawa'}</option>
              <option value="Married">{language === 'en' ? 'Married' : 'Minyo'}</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Number of Children:' : 'Ilang Anak:'}</label>
            <input
              type="number"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter number of children' : 'Isulod ang ihap sa anak'}
              value={appChildren}
              onChange={(e) => setAppChildren(parseInt(e.target.value))}
              min={0}
            />
          </div>
        </div>

        {appMarital === "Married" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Spouse Name:' : 'Ngalan sa Bana/Asawa:'}</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter spouse name' : 'Isulod ang ngalan sa bana/asawa'}
                value={appSpouseName}
                onChange={(e) => setAppSpouseName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Spouse Occupation:' : 'Trabaho sa Bana/Asawa:'}</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter spouse occupation' : 'Isulod ang trabaho sa bana/asawa'}
                value={appSpouseOccupation}
                onChange={(e) => setAppSpouseOccupation(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ==== Address Section ==== */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Home Address:' : 'Address sa Panimalay:'}</label>
          <input
            type="text"
            value={props.appAddress}
            onChange={handleAddressChange}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder={language === 'en' ? 'Click on the map or type here' : 'I-klik ang mapa o isulat dinhi'}
          />
        </div>

        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 relative" style={{ height: 300 }}>
          <MapContainer
            center={markerPosition || [12.8797, 121.774]}
            zoom={6}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            className="map-container"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapComponent
              address={props.appAddress}
              setAddress={props.setAppAddress}
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
            />
          </MapContainer>
        </div>
      </div>
      
      {/* Source of Income */}
<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
  <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
    {language === 'en' ? 'Source of Income' : 'Tinubdan sa Kita'}
  </h4>

  {/* Radio Buttons */}
  <div className="flex gap-6 mb-4">
    {[
      { value: 'business', label: language === 'en' ? 'Business Owner' : 'Tag-iya sa Negosyo' },
      { value: 'employed', label: language === 'en' ? 'Employed' : 'Trabahante' },
    ].map(({ value, label }) => (
      <label key={value} className="flex items-center">
        <input
          type="radio"
          name="employmentType"
          value={value}
          checked={sourceOfIncome === value}
          onChange={(e) => setSourceOfIncome(e.target.value)}
          className="mr-2 text-red-600 focus:ring-red-500"
        />
        <span className="text-gray-700">{label}</span>
      </label>
    ))}
  </div>

  {/* Conditional Inputs */}
  {sourceOfIncome === 'business' ? (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Type of Business:' : 'Matang sa Negosyo:'}</label>
        <input
          type="text"
          value={appTypeBusiness}
          onChange={(e) => setAppTypeBusiness(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Date Started:' : 'Petsa sa Pagsimula:'}</label>
        <input
          type="date"
          value={appDateStarted}
          onChange={(e) => setAppDateStarted(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
        <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Business Location:' : 'Lokasyon sa Negosyo:'}</label>
        <input
          type="text"
          value={appBusinessLoc}
          onChange={(e) => setAppBusinessLoc(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
      <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Monthly Income:' : 'Buwanang Kita:'}</label>
      <input
        type="number"
        min={0}
        value={appMonthlyIncome}
        onChange={(e) => setAppMonthlyIncome(parseFloat(e.target.value))}
        className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder={language === 'en' ? 'Enter your monthly income' : 'Isulod ang buwanang kita'}
      />
    </div>

    </div>
  ) : sourceOfIncome === 'employed' ? (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Occupation:' : 'Trabaho:'}</label>
        <input
          type="text"
          value={appOccupation}
          onChange={(e) => setAppOccupation(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Employment Status:' : 'Kahimtang sa Trabaho:'}</label>
        <select
          value={appEmploymentStatus}
          onChange={(e) => setAppEmploymentStatus(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
        <option value="">{language === 'en' ? 'Select Employment status' : 'Pili ang status ng trabaho'}</option>
        <option value="regular">{language === 'en' ? 'Regular' : 'Regular'}</option>
        <option value="irregular">{language === 'en' ? 'Irregular' : 'Dili Regular'}</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Company Name:' : 'Ngalan sa Kompanya:'}</label>
        <input
          type="text"
          value={appCompanyName}
          onChange={(e) => setAppCompanyName(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
       <div>
      <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Monthly Income:' : 'Buwanang Kita:'}</label>
      <input
        type="number"
        min={0}
        value={appMonthlyIncome}
        onChange={(e) => setAppMonthlyIncome(parseFloat(e.target.value))}
        className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder={language === 'en' ? 'Enter your monthly income' : 'Isulod ang buwanang kita'}
      />
    </div>
    </div>
  ) : null}
</div>

{/* References Section */}
<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
  <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
    {language === 'en' ? 'Character References' : 'Mga Tigi-uyonanan'}
  </h4>

  {[1, 2, 3].map((i) => (
    <div key={i} className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          {language === 'en' ? `Reference ${i} Name:` : `Pangalan sa Tig-uyon ${i}:`}
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Full name' : 'Buong pangalan'}
          value={props.appReferences[i - 1]?.name || ""}
          onChange={(e) => handleReferenceChange(i - 1, 'name', e.target.value)}
        />
        {/* Show only duplicate name error here */}
        {refErrors[i - 1] && refErrors[i - 1].toLowerCase().includes('duplicate name') && (
          <p className="text-sm text-red-600 mt-1">{refErrors[i - 1].split('•').filter(err => err.toLowerCase().includes('duplicate name')).join(' • ')}</p>
        )}
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          {language === 'en' ? 'Contact Number:' : 'Numero ng Telepono:'}
        </label>
        <input
          type="text"
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            refErrors[i - 1] && refErrors[i - 1].toLowerCase().includes('contact') ? "border-red-400" : "border-gray-200"
          }`}
          placeholder="09XXXXXXXXX"
          value={props.appReferences[i - 1]?.contact || ""}
          onChange={(e) => handleReferenceChange(i - 1, "contact", e.target.value)}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && !isValidPHMobile(v)) {
              const next = [...refErrors];
              next[i - 1] = next[i - 1]
                ? next[i - 1] + " • Invalid mobile format"
                : "Invalid mobile format";
              setRefErrors(next);
            } else {
              validateReferenceUniqueness(props.appReferences);
            }
          }}
          aria-invalid={!!refErrors[i - 1] && refErrors[i - 1].toLowerCase().includes('contact')}
        />
        {/* Show only contact-related errors here */}
        {refErrors[i - 1] && refErrors[i - 1].toLowerCase().match(/contact|mobile/) && (
          <p className="text-sm text-red-600 mt-1">{refErrors[i - 1].split('•').filter(err => err.toLowerCase().includes('contact') || err.toLowerCase().includes('mobile')).join(' • ')}</p>
        )}

      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          {language === 'en' ? 'Relationship:' : 'Relasyon:'}
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={language === 'en' ? 'e.g., Friend, Sibling' : 'hal. Higala, Igsoon'}
          value={props.appReferences[i - 1]?.relation || ""}
          onChange={(e) => handleReferenceChange(i - 1, 'relation', e.target.value)}
        />
      </div>
    </div>
  ))}
</div>

    </>

    

  )};
