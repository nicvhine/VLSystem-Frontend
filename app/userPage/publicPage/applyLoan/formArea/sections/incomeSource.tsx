'use client';

import { useState } from "react";
import ErrorModal from '../../../../../commonComponents/modals/errorModal/modal';

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
  // Error modal state for date validation
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  // ...existing code...
  {/* Error Modal for date validation */}
  {errorModalOpen && (
    <ErrorModal
      isOpen={errorModalOpen}
      message={errorModalMessage}
      onClose={() => setErrorModalOpen(false)}
    />
  )}
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
  export default function SourceOfIncome(props: SourceOfIncomeProps) {
    const {
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
    } = props;
    // Error modal state for date validation
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
            </label>
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          {/* ...existing JSX... */}
        </div>
        {errorModalOpen && (
          <ErrorModal
            isOpen={errorModalOpen}
            message={errorModalMessage}
            onClose={() => setErrorModalOpen(false)}
          />
        )}
      </>
    );
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
                  setErrorModalMessage(language === "en"
                    ? "Date cannot be in the future."
                    : "Ang petsa dili mahimong sa umaabot.");
                  setErrorModalOpen(true);
                  setAppDateStarted("");
                } else {
                  setAppDateStarted(selectedDate);
                }
// Add error modal state and modal at top-level of component
const [errorModalOpen, setErrorModalOpen] = useState(false);
const [errorModalMessage, setErrorModalMessage] = useState("");

// ...existing code...

{errorModalOpen && (
  <ErrorModal
    isOpen={errorModalOpen}
    message={errorModalMessage}
    onClose={() => setErrorModalOpen(false)}
  />
)}
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      {errorModalOpen && (
        <ErrorModal
          isOpen={errorModalOpen}
          message={errorModalMessage}
          onClose={() => setErrorModalOpen(false)}
        />
      )}
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter your monthly income' : 'Isulod ang buwanang kita'}
            />
          </div>
        </div>
      ) : null}
    </div>
      {errorModalOpen && (
        <ErrorModal
          isOpen={errorModalOpen}
          message={errorModalMessage}
          onClose={() => setErrorModalOpen(false)}
        />
      )}
    </>
  );
}
