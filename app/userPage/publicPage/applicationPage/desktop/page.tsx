'use client';

import { useState, useEffect } from "react";
import Navbar from "../navbar";
import WithCollateralLoanForm from "../forms/withCollateral/withCollateral";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import WithoutCollateralLoanForm from "../forms/withoutCollateral/withoutCollateral";
import OpenTermLoanForm from "../forms/openTerm";
import axios from "axios";
import LoginModal from "../../loginForm/page";


export default function ApplicationPage() {
  // Initialize language from reloan info if it exists, otherwise default to 'en'
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          return parsed.language || 'en';
        } catch (e) {
          return 'en';
        }
      }
    }
    return 'en';
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  
  // Update language in local storage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reloanInfo = localStorage.getItem('reloanInfo');
      if (reloanInfo) {
        try {
          const parsed = JSON.parse(reloanInfo);
          localStorage.setItem('reloanInfo', JSON.stringify({
            ...parsed,
            language: language
          }));
        } catch (e) {
          console.error('Error updating reloan info with language:', e);
        }
      }
    }
  }, [language]);
  const [address, setAddress] = useState('');
  const [loanType, setLoanType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mockLoanId] = useState("VL-" + Math.floor(100000 + Math.random() * 900000));
  const [maritalStatus, setMaritalStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const handleSubmit = () => setShowSuccessModal(true);
  const closeModal = () => setShowSuccessModal(false);

  const loanTypes = [
    language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)',
    language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)',
    language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam',
  ];

  const getRequirements = (type: string) => {
    switch(type) {
      case (language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
        ];
      case (language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
      case (language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam'):
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
        ];
      default:
        return [];
    }
  };

  const loanProcessSteps = [
    language === 'en' ? 'Application Submission' : 'Pagsumite sa Aplikasyon',
    language === 'en' ? 'Document Verification' : 'Pag-verify sa Dokumento',
    language === 'en' ? 'Credit Assessment' : 'Pagsusi sa Kredito',
    language === 'en' ? 'Approval Process' : 'Proseso sa Pag-apruba',
    language === 'en' ? 'Loan Disbursement' : 'Pagpagawas sa Pahulam',
  ];

  function MapComponent({ setAddress }: { setAddress: (address: string) => void }) {
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();

      const newMarker = L.marker([lat, lng]).addTo(e.target);
      setMarker(newMarker);

      axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
      })
        .then((response) => {
          const address = response.data.display_name;
          setAddress(address);
          newMarker.bindPopup(address).openPopup();
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
        });
    },
  });

  return null;
}

return (
  <div className="h-screen bg-white text-black overflow-hidden">
    <Navbar
  language={language}
  setLanguage={setLanguage}
  isLoginOpen={isLoginOpen}
  setIsLoginOpen={setIsLoginOpen}
  isModalOpen={showSuccessModal} 
/>

    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

  <div className="flex h-[calc(100vh-64px)] items-start">  {/* 64px = approx navbar height, adjust if needed */}
      {/* Left Sidebar - sticky and full height */}
      <div className="w-80 bg-white shadow-sm p-6 space-y-6 sticky top-0 h-screen overflow-y-auto">
        {/* Type of Loan Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Type of Loan' : 'Klase sa Pahulam'}</h3>
          </div>
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <select 
                value={loanType} 
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full p-3 text-center font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{language === 'en' ? '-- TYPE OF LOAN --' : '-- KLASE SA PAHULAM --'}</option>
                {loanTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Type of Loan Requirements Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Loan Requirements' : 'Mga Kinahanglanon sa Pahulam'}</h3>
          </div>
          <div className="p-4 overflow-y-auto">
            {loanType ? (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-red-600 mb-3">{loanType}</h4>
                <ul className="space-y-2 text-sm">
                  {getRequirements(loanType).map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-red-500 text-xs font-bold mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center flex items-center justify-center h-full">
                {language === 'en' ? 'Select a loan type to view requirements' : 'Pilia ang klase sa pahulam aron makita ang mga kinahanglanon'}
              </div>
            )}
          </div>
        </div>

        {/* Loan Process Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-center">{language === 'en' ? 'Application Process' : 'Proseso sa Aplikasyon'}</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <ul className="space-y-3 text-sm">
                {loanProcessSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium min-w-[24px] text-center">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - allow independent scrolling */}
  <div className="flex-1 bg-white shadow-sm ml-0 rounded-lg overflow-y-auto h-full">
        <div className="h-full flex items-center justify-center">
          {!loanType ? (
            <div className="flex flex-col items-center justify-center w-full px-4 pt-12">
              <div className="max-w-2xl w-full text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2 break-words leading-tight">
                  {language === 'en' ? 'Application' : 'Aplikasyon'}
                  <br />
                  {language === 'en' ? 'Form' : 'Porma'}
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
                  {language === 'en'
                    ? 'Please select a loan type from the sidebar to begin your application'
                    : 'Pilia ang klase sa pahulam sa sidebar aron magsugod sa imong aplikasyon'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{loanType}</h1>
                  <div className="w-16 h-1 bg-red-600 rounded"></div>
                </div>

                {loanType === (language === 'en' ? 'Regular Loan With Collateral' : 'Regular nga Pahulam (Naay Kolateral)') && (
                  <WithCollateralLoanForm
                    maritalStatus={maritalStatus}
                    setMaritalStatus={setMaritalStatus}
                    incomeSource={incomeSource}
                    setIncomeSource={setIncomeSource}
                    address={address}
                    setAddress={setAddress}
                    employmentStatus={employmentStatus}
                    setEmploymentStatus={setEmploymentStatus}
                    language={language}
                  />
                )}

                {loanType === (language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)') && (
                  <WithoutCollateralLoanForm 
                    language={language} 
                  />
                )}

                {loanType === (language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam') && (
                  <OpenTermLoanForm
                    maritalStatus={maritalStatus}
                    setMaritalStatus={setMaritalStatus}
                    incomeSource={incomeSource}
                    setIncomeSource={setIncomeSource}
                    address={address}
                    setAddress={setAddress}
                    employmentStatus={employmentStatus}
                    setEmploymentStatus={setEmploymentStatus}
                    language={language}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}