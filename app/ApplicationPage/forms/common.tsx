"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";


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
  appEmploymentStatus: string;
  setAppEmploymentStatus: React.Dispatch<React.SetStateAction<string>>;
  appCompanyName: string;
  setAppCompanyName: React.Dispatch<React.SetStateAction<string>>;
  sourceOfIncome: string;
  setSourceOfIncome: React.Dispatch<React.SetStateAction<string>>;
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
    <Marker position={markerPosition}>
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
    sourceOfIncome, setSourceOfIncome
  } = props;

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          Basic Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Name:</label>
            <input
              type="text"
              value={appName} 
              onChange={(e) => setAppName(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Date of Birth:</label>
            <input
              type="date"
              value={appDob}        
              onChange={(e) => setAppDob(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Contact Number:</label>
            <input
              type="text"
              value={appContact}
              onChange={(e) => setAppContact(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter contact number"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Email Address:</label>
            <input
              type="email"        
              value={appEmail}
              onChange={(e) => setAppEmail(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Marital Status:</label>
            <select
              value={appMarital}
              onChange={(e) => setAppMarital(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Number of Children:</label>
            <input
              type="number"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter number of children"
              value={appChildren}
              onChange={(e) => setAppChildren(parseInt(e.target.value))}
              min={0}
            />
          </div>
        </div>

        {appMarital === "Married" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Spouse Name:</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter spouse name"
                value={appSpouseName}
                onChange={(e) => setAppSpouseName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">Spouse Occupation:</label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter spouse occupation"
                value={appSpouseOccupation}
                onChange={(e) => setAppSpouseOccupation(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ==== Address Section ==== */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Home Address:</label>
          <input
            type="text"
            value={props.appAddress}
            onChange={handleAddressChange}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Click on the map or type here"
          />
        </div>

        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200" style={{ height: 300 }}>
          <MapContainer
            center={markerPosition || [12.8797, 121.774]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
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
    Source of Income
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
        <label className="block font-medium mb-2 text-gray-700">Type of Business:</label>
        <input
          type="text"
          value={appTypeBusiness}
          onChange={(e) => setAppTypeBusiness(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">Date Started:</label>
        <input
          type="date"
          value={appDateStarted}
          onChange={(e) => setAppDateStarted(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
        <div>
        <label className="block font-medium mb-2 text-gray-700">Business Location:</label>
        <input
          type="text"
          value={appBusinessLoc}
          onChange={(e) => setAppBusinessLoc(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
      <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
      <input
        type="number"
        min={0}
        value={appMonthlyIncome}
        onChange={(e) => setAppMonthlyIncome(parseFloat(e.target.value))}
        className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Enter your monthly income"
      />
    </div>

    </div>
  ) : sourceOfIncome === 'employed' ? (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-medium mb-2 text-gray-700">Occupation:</label>
        <input
          type="text"
          value={appOccupation}
          onChange={(e) => setAppOccupation(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">Employment Status:</label>
        <select
          value={appEmploymentStatus}
          onChange={(e) => setAppEmploymentStatus(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
        <option value="">Select Employment status</option>
        <option value="regular">Regular</option>
        <option value="irregular">Irregular</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-2 text-gray-700">Company Name:</label>
        <input
          type="text"
          value={appCompanyName}
          onChange={(e) => setAppCompanyName(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
       <div>
      <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
      <input
        type="number"
        min={0}
        value={appMonthlyIncome}
        onChange={(e) => setAppMonthlyIncome(parseFloat(e.target.value))}
        className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Enter your monthly income"
      />
    </div>
    </div>
  ) : null}
</div>
    </>

  )};

