"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import axios from "axios";

// Map component temporarily disabled to fix runtime errors
// const MapComponent = dynamic(
//   () => import('./MapComponent'),
//   { ssr: false }
// );

// Props interface for Common form component
interface CommonProps {
  // Applicant personal information
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
  
  // Spouse information
  appSpouseName: string;
  setAppSpouseName: React.Dispatch<React.SetStateAction<string>>;
  appSpouseOccupation: string;
  setAppSpouseOccupation: React.Dispatch<React.SetStateAction<string>>;
  
  // Address and location information
  appAddress: string;
  setAppAddress: React.Dispatch<React.SetStateAction<string>>;
  appTypeBusiness: string;
  setAppTypeBusiness: React.Dispatch<React.SetStateAction<string>>;
  appDateStarted: string;
  setAppDateStarted: React.Dispatch<React.SetStateAction<string>>;
  appBusinessLoc: string;
  setAppBusinessLoc: React.Dispatch<React.SetStateAction<string>>;
  
  // Income and employment information
  appMonthlyIncome: number;
  setAppMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  appOccupation: string;
  setAppOccupation: React.Dispatch<React.SetStateAction<string>>;
  appEmploymentStatus: string;
  setAppEmploymentStatus: React.Dispatch<React.SetStateAction<string>>;
  appCompanyName: string;
  setAppCompanyName: React.Dispatch<React.SetStateAction<string>>;
  sourceOfIncome: string;
  setSourceOfIncome: React.Dispatch<React.SetStateAction<string>>;
  
  // References and language
  appReferences: { name: string; contact: string; relation: string }[];
  setAppReferences: React.Dispatch<React.SetStateAction<{ name: string; contact: string; relation: string }[]>>;
  language: 'en' | 'ceb';
  reloanData?: any; 
};

// MapComponent implementation moved to MapComponent.tsx

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
 
  useEffect(() => {
    if (props.reloanData) {
      const { personalInfo } = props.reloanData;
      props.setAppName(personalInfo.name);
      props.setAppDob(personalInfo.dateOfBirth);
      props.setAppContact(personalInfo.contactNumber);
      props.setAppEmail(personalInfo.emailAddress);
      props.setAppMarital(personalInfo.maritalStatus);
      props.setAppChildren(personalInfo.numberOfChildren);
      props.setAppAddress(personalInfo.address);
      props.setSourceOfIncome(personalInfo.sourceOfIncome);
      props.setAppOccupation(personalInfo.occupation);
      props.setAppMonthlyIncome(personalInfo.monthlyIncome);
      props.setAppReferences(personalInfo.characterReferences);
      props.setAppTypeBusiness(personalInfo.appTypeBusiness || "");
      props.setAppDateStarted(personalInfo.appDateStarted || "");
      props.setAppBusinessLoc(personalInfo.appBusinessLoc || "");
      props.setAppEmploymentStatus(personalInfo.appEmploymentStatus || "");
      props.setAppCompanyName(personalInfo.appCompanyName || "");
    }
  }, [props.reloanData]);


  const handleReferenceChange = (index: number, field: 'name' | 'contact' | 'relation', value: string) => {
  const updated = [...props.appReferences];
  updated[index][field] = value;
  props.setAppReferences(updated);
  };


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

        {/* Map component temporarily disabled - will be re-enabled after fixing import issues */}
        <div className="h-64 w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">
            {props.language === 'en' ? 'Map functionality temporarily disabled' : 'Ang map ay pansamantalang hindi available'}
          </p>
        </div>
      </div>
      
      {/* Source of Income */}
<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
  <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
    {language === 'en' ? 'Source of Income' : 'Mga Source ng Kita'}
  </h4>

  {/* Radio Buttons */}
  <div className="flex gap-6 mb-4">
    {[
      { value: 'business', label: 'Business Owner' },
      { value: 'employed', label: 'Employed' },
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
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Type of Business:' : 'Uri ng Trabaho:'}</label>
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
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Business Location:' : 'Lokasyon ng Trabaho:'}</label>
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
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Employment Status:' : 'Status ng Trabaho:'}</label>
        <select
          value={appEmploymentStatus}
          onChange={(e) => setAppEmploymentStatus(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
        <option value="">{language === 'en' ? 'Select Employment status' : 'Pili ang status ng trabaho'}</option>
        <option value="regular">{language === 'en' ? 'Regular' : 'Regular'}</option>
        <option value="irregular">{language === 'en' ? 'Irregular' : 'Iregular'}</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">{language === 'en' ? 'Company Name:' : 'Ngalan ng Trabaho:'}</label>
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
    {language === 'en' ? 'Character References' : 'Mga Sanggunian'}
  </h4>

  {[1, 2, 3].map((i) => (
    <div key={i} className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          {language === 'en' ? `Reference ${i} Name:` : `Pangalan ng Sanggunian ${i}:`}
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={language === 'en' ? 'Full name' : 'Buong pangalan'}
          value={props.appReferences[i - 1]?.name || ""}
          onChange={(e) => handleReferenceChange(i - 1, 'name', e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          {language === 'en' ? 'Contact Number:' : 'Numero ng Telepono:'}
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="09XXXXXXXXX"
          value={props.appReferences[i - 1]?.contact || ""}
          onChange={(e) => handleReferenceChange(i - 1, 'contact', e.target.value)}
        />
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