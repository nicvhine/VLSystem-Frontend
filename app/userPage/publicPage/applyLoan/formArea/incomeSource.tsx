'use client';

import { useState } from "react";

interface SourceOfIncomeProps {
  language: 'en' | 'ceb';
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
  occupationError: boolean;
  setOccupationError: (value: boolean) => void;
  appEmploymentStatus: string;
  setAppEmploymentStatus: (value: string) => void;
  appCompanyName: string;
  setAppCompanyName: (value: string) => void;
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
}: SourceOfIncomeProps) {
  return (
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
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Type of Business:' : 'Matang sa Negosyo:'}
            </label>
            <input
              type="text"
              value={appTypeBusiness}
              onChange={(e) => setAppTypeBusiness(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Business Name:' : 'Pangalan sa Negosyo:'}
            </label>
            <input
              type="text"
              value={appBusinessName}
              onChange={(e) => setAppBusinessName(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Date Started:' : 'Petsa sa Pagsimula:'}
            </label>
            <input
              type="date"
              value={appDateStarted}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const today = new Date().toISOString().split("T")[0];
                if (selectedDate > today) {
                  alert(
                    language === "en"
                      ? "Date cannot be in the future."
                      : "Ang petsa dili mahimong sa umaabot."
                  );
                  setAppDateStarted("");
                } else {
                  setAppDateStarted(selectedDate);
                }
              }}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Business Location:' : 'Lokasyon sa Negosyo:'}
            </label>
            <input
              type="text"
              value={appBusinessLoc}
              onChange={(e) => setAppBusinessLoc(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Monthly Income:' : 'Buwanang Kita:'}
            </label>
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
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Occupation:' : 'Trabaho:'}
            </label>
            <input
              type="text"
              value={appOccupation}
              onChange={(e) => {
                const value = e.target.value;
                const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
                setAppOccupation(value);
                setOccupationError(wordCount > 5);
              }}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter occupation' : 'Isulod ang trabaho'}
            />
            {occupationError && (
              <p className="text-sm text-red-600 mt-1">
                {language === 'en'
                  ? 'Maximum 5 words allowed.'
                  : 'Limitado sa 5 ka pulong.'}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Employment Status:' : 'Kahimtang sa Trabaho:'}
            </label>
            <select
              value={appEmploymentStatus}
              onChange={(e) => setAppEmploymentStatus(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">
                {language === 'en' ? 'Select Employment status' : 'Pili ang status ng trabaho'}
              </option>
              <option value="regular">{language === 'en' ? 'Regular' : 'Regular'}</option>
              <option value="irregular">{language === 'en' ? 'Irregular' : 'Dili Regular'}</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Company Name:' : 'Ngalan sa Kompanya:'}
            </label>
            <input
              type="text"
              value={appCompanyName}
              onChange={(e) => setAppCompanyName(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Monthly Income:' : 'Buwanang Kita:'}
            </label>
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
  );
}
