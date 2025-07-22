'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/borrower/navbar";
import WithCollateralLoanForm from "./forms/withCollateral";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import WithoutCollateralLoanForm from "./forms/withoutCollateral";
import OpenTermLoanForm from "./forms/openTerm";
import axios from "axios";
import Common from "./forms/common";


export default function ApplicationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [address, setAddress] = useState('');
  const [loanType, setLoanType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mockLoanId] = useState("VL-" + Math.floor(100000 + Math.random() * 900000));
  const [maritalStatus, setMaritalStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [reloanData, setReloanData] = useState<any>(null);

  useEffect(() => {
    const reloanInfo = localStorage.getItem('reloanInfo');
    if (reloanInfo) {
      setReloanData(JSON.parse(reloanInfo));
      localStorage.removeItem('reloanInfo');
    }
  }, []);

  const handleSubmit = () => setShowSuccessModal(true);
  const closeModal = () => setShowSuccessModal(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(e.target.files);
    }
  };



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

const handleGoBack = () => {
    router.push('/components/borrower');
  };

return (
<div className="min-h-screen bg-gray-50 text-black">
  <Navbar language={language} setLanguage={setLanguage} />
  
  {/* Simple Back Button */}
  <div className="bg-white border-b border-gray-200 px-6 py-3">
    <button
      onClick={handleGoBack}
      className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
    >
      <svg 
        className="w-5 h-5 mr-2 text-red-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      <span className="font-medium">
        {language === 'en' ? 'Back to Dashboard' : 'Balik sa Dashboard'}
      </span>
    </button>
  </div>
  
  <div className="flex min-h-screen">
       
{/* Left Sidebar */}
<div className="w-80 bg-white shadow-sm p-6 space-y-6">

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
            <div className="p-4 h-48 overflow-y-auto">
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

        {/* Main Content Area */}
        <div className="flex-1 bg-white shadow-sm ml-0 rounded-lg">
          <div className="h-full flex items-center justify-center">
            {!loanType ? (
              <div className="text-center px-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-2">{language === 'en' ? 'Application' : 'Aplikasyon'}</h1>
                <h2 className="text-5xl font-bold text-gray-800 mb-6">{language === 'en' ? 'Form' : 'Porma'}</h2>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                  {language === 'en'
                    ? 'Please select a loan type from the sidebar to begin your application'
                    : 'Pilia ang klase sa pahulam sa sidebar aron magsugod sa imong aplikasyon'}
                </p>
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
                  reloanData={reloanData}
                />
              )}

                {loanType === (language === 'en' ? 'Regular Loan Without Collateral' : 'Regular nga Pahulam (Walay Kolateral)') && (
                <WithoutCollateralLoanForm 
                  language={language} 
                  reloanData={reloanData}
                />
                )}

                  {loanType === (language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam') && (
                <OpenTermLoanForm
                  language={language}
                  reloanData={reloanData}
                />
                )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{language === 'en' ? 'Application Submitted Successfully!' : 'Malampusong Napasa ang Aplikasyon!'}</h3>
              <p className="text-gray-600 mb-4">{language === 'en' ? 'Your loan application has been received and is being processed.' : 'Nadawat na ang imong aplikasyon ug gi-proseso na.'}</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">{language === 'en' ? 'Your Application ID:' : 'Imong Application ID:'}</p>
                <p className="text-lg font-semibold text-red-600">{mockLoanId}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                {language === 'en' ? 'Close' : 'Sirado'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}