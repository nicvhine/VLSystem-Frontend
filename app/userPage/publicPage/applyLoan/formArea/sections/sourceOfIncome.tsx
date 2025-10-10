"use client";

import React from "react";

interface SourceOfIncomeProps {
  language: "en" | "ceb";
  sourceOfIncome: string;
  setSourceOfIncome: (value: string) => void;
  appTypeBusiness: string;
  setAppTypeBusiness: (value: string) => void;
  appBusinessName: string;
  setAppBusinessName: (value: string) => void;
  appDateStarted: string;
  setAppDateStarted: (value: string) => void;
  appBusinessLoc: string;
  setAppBusinessLoc: (value: string) => void;
  appMonthlyIncome: number;
  setAppMonthlyIncome: (value: number) => void;
  appOccupation: string;
  setAppOccupation: (value: string) => void;
  occupationError: string;
  setOccupationError: (value: string) => void;
  appEmploymentStatus: string;
  setAppEmploymentStatus: (value: string) => void;
  appCompanyName: string;
  setAppCompanyName: (value: string) => void;
  missingFields?: string[];
}

export default function SourceOfIncome({
  language,
  sourceOfIncome,
  setSourceOfIncome,
  appTypeBusiness,
  setAppTypeBusiness,
  appBusinessName,
  setAppBusinessName,
  appDateStarted,
  setAppDateStarted,
  appBusinessLoc,
  setAppBusinessLoc,
  appMonthlyIncome,
  setAppMonthlyIncome,
  appOccupation,
  setAppOccupation,
  occupationError,
  setOccupationError,
  appEmploymentStatus,
  setAppEmploymentStatus,
  appCompanyName,
  setAppCompanyName,
  missingFields = [],
}: SourceOfIncomeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
        {language === "en" ? "Source of Income" : "Tinubdan sa Kita"}
      </h4>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">
          {language === "en" ? "Source of Income:" : "Tinubdan sa Kita:"}
        </label>
        <select
          value={sourceOfIncome}
          onChange={(e) => setSourceOfIncome(e.target.value)}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            missingFields.includes("Source of Income")
              ? "border-red-500"
              : "border-gray-200"
          }`}
        >
          <option value="">
            {language === "en" ? "Select" : "Pilia"}
          </option>
          <option value="employed">
            {language === "en" ? "Employed" : "Naa Nagtrabaho"}
          </option>
          <option value="business">
            {language === "en" ? "Business" : "Negosyo"}
          </option>
        </select>
      </div>
      {sourceOfIncome === "business" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Type of Business:" : "Klase sa Negosyo:"}
            </label>
            <input
              type="text"
              value={appTypeBusiness}
              onChange={(e) => setAppTypeBusiness(e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                missingFields.includes("Type of Business")
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeholder={
                language === "en"
                  ? "Enter business type"
                  : "Isulod ang klase sa negosyo"
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Business Name:" : "Ngalan sa Negosyo:"}
            </label>
            <input
              type="text"
              value={appBusinessName}
              onChange={(e) => setAppBusinessName(e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                missingFields.includes("Business Name")
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeholder={
                language === "en"
                  ? "Enter business name"
                  : "Isulod ang ngalan sa negosyo"
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Date Started:" : "Petsa Nagsugod:"}
            </label>
            <input
              type="date"
              value={appDateStarted}
              onChange={(e) => setAppDateStarted(e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                missingFields.includes("Date Started")
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Business Location:" : "Lokasyon sa Negosyo:"}
            </label>
            <input
              type="text"
              value={appBusinessLoc}
              onChange={(e) => setAppBusinessLoc(e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                missingFields.includes("Business Location")
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeholder={
                language === "en"
                  ? "Enter business location"
                  : "Isulod ang lokasyon sa negosyo"
              }
            />
          </div>
        </div>
      )}
      {(sourceOfIncome === "business" || sourceOfIncome === "employed") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {sourceOfIncome === "employed" && (
            <>
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  {language === "en" ? "Occupation:" : "Trabaho:"}
                </label>
                <input
                  type="text"
                  value={appOccupation}
                  onChange={(e) => setAppOccupation(e.target.value)}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    missingFields.includes("Occupation")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={
                    language === "en" ? "Enter occupation" : "Isulod ang trabaho"
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  {language === "en" ? "Employment Status:" : "Kahimtang sa Trabaho:"}
                </label>
                <select
                  value={appEmploymentStatus}
                  onChange={(e) => setAppEmploymentStatus(e.target.value)}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    missingFields.includes("Employment Status")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">
                    {language === "en" ? "Select status" : "Pilia ang kahimtang"}
                  </option>
                  <option value="regular">{language === "en" ? "Regular" : "Regular"}</option>
                  <option value="irregular">{language === "en" ? "Irregular" : "Dili Regular"}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  {language === "en" ? "Company Name:" : "Ngalan sa Kompanya:"}
                </label>
                <input
                  type="text"
                  value={appCompanyName}
                  onChange={(e) => setAppCompanyName(e.target.value)}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    missingFields.includes("Company Name")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={
                    language === "en"
                      ? "Enter company name"
                      : "Isulod ang ngalan sa kompanya"
                  }
                />
              </div>
            </>
          )}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Monthly Income:" : "Bulanang Kita:"}
            </label>
            <input
              type="number"
              value={appMonthlyIncome}
              onChange={(e) => setAppMonthlyIncome(Number(e.target.value))}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                missingFields.includes("Monthly Income")
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeholder={
                language === "en"
                  ? "Enter monthly income"
                  : "Isulod ang bulanang kita"
              }
              min={0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
