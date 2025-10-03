"use client";

import React from "react";

interface CollateralProps {
  language: "en" | "ceb";
  collateralType: string;
  setCollateralType: (value: string) => void;
  collateralValue: number;
  setCollateralValue: (value: number) => void;
  collateralDescription: string;
  setCollateralDescription: (value: string) => void;
  ownershipStatus: string;
  setOwnershipStatus: (value: string) => void;
  collateralTypeOptions: { value: string; label: string }[];
  missingFields?: string[];
}

export default function CollateralInformation({
  language,
  collateralType,
  setCollateralType,
  collateralValue,
  setCollateralValue,
  collateralDescription,
  setCollateralDescription,
  ownershipStatus,
  setOwnershipStatus,
  collateralTypeOptions,
  missingFields = [],
}: CollateralProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
        {language === "en" ? "Collateral Information" : "Impormasyon sa Kolateral"}
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Collateral Type */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en" ? "Collateral Type:" : "Klase sa Kolateral:"}
          </label>
          <select
            value={collateralType}
            onChange={(e) => setCollateralType(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingFields.includes('Collateral Type') ? 'border-red-500' : 'border-gray-200'}`}
          >
            {collateralTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            <option value="Other">{language === "en" ? "Other" : "Uban pa"}</option>
          </select>
        </div>

        {/* Estimated Value */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en" ? "Estimated Value:" : "Gibanabanang Kantidad:"}
          </label>
          <input
            type="number"
            value={collateralValue}
            onChange={(e) => setCollateralValue(parseFloat(e.target.value))}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingFields.includes('Collateral Value') ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={
              language === "en"
                ? "Enter estimated value"
                : "Isulod ang gibanabanang kantidad"
            }
          />
        </div>

        {/* Collateral Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en"
              ? "Collateral Description:"
              : "Deskripsyon sa Kolateral:"}
          </label>
          <textarea
            value={collateralDescription}
            onChange={(e) => setCollateralDescription(e.target.value)}
            className={`w-full border p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingFields.includes('Collateral Description') ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={
              language === "en"
                ? "Provide detailed description of your collateral"
                : "Isulat ang detalyadong deskripsyon sa imong kolateral"
            }
          ></textarea>
        </div>

        {/* Ownership Status */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en"
              ? "Ownership Status:"
              : "Kahimtang sa Pagpanag-iya:"}
          </label>
          <select
            value={ownershipStatus}
            onChange={(e) => setOwnershipStatus(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingFields.includes('Ownership Status') ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">
              {language === "en"
                ? "Select ownership status"
                : "Pilia ang kahimtang sa pagpanag-iya"}
            </option>
            <option value="Owned">
              {language === "en" ? "Owned" : "Gipanag-iya"}
            </option>
            <option value="Mortgaged">
              {language === "en" ? "Mortgaged" : "Naipang-utang"}
            </option>
            <option value="Other">
              {language === "en" ? "Other" : "Uban pa"}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
