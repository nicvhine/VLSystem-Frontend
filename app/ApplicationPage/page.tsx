'use client';

import { useState } from "react";
import Navbar from "../components/landing/landingNavbar";
import WithCollateralLoanForm from "./forms/withCollateral";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import WithoutCollateralLoanForm from "./forms/withoutCollateral";
import OpenTermLoanForm from "./forms/openTerm";
import axios from "axios";



export default function ApplicationPage() {
  const [address, setAddress] = useState('');
  const [loanType, setLoanType] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mockLoanId] = useState("VL-" + Math.floor(100000 + Math.random() * 900000));
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [houseStatus, setHouseStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<{ amount: number; interest: number; months: number } | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [numberOfChildren, setNumberOfChildren] = useState<number | "">("");
  const [spouseName, setSpouseName] = useState("");
  const [spouseOccupation, setSpouseOccupation] = useState("");
  const handleSubmit = () => setShowSuccessModal(true);
  const closeModal = () => setShowSuccessModal(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(e.target.files);
    }
  };
  
  const loanOptions = [
    { amount: 10000, interest: 10, months: 5 },
    { amount: 15000, interest: 10, months: 6 },
    { amount: 20000, interest: 10, months: 8 },
    { amount: 30000, interest: 10, months: 10 },
  ];


  const loanTypes = [
    'Regular Loan Without Collateral',
    'Regular Loan With Collateral', 
    'Open-Term Loan'
  ];

  const getRequirements = (type: string) => {
    switch(type) {
      case 'Regular Loan Without Collateral':
        return [
          'Valid Government-issued ID',
          'Proof of Income',
          'Certificate of Employment / Business Permit',
          'Proof of Billing'
        ];
      case 'Regular Loan With Collateral':
        return [
          'Valid Government-issued ID',
          'Proof of Income',
          'Certificate of Employment / Business Permit',
          'Proof of Billing',
          'Collateral Document',
          'Appraisal Report of Collateral'
        ];
      case 'Open-Term Loan':
        return [
          'Valid Government-issued ID',
          'Proof of Income',
          'Certificate of Employment / Business Permit',
          'Proof of Billing'
        ];
      default:
        return [];
    }
  };

  const loanProcessSteps = [
    'Application Submission',
    'Document Verification', 
    'Credit Assessment',
    'Approval Process',
    'Loan Disbursement'
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-sm p-6 space-y-6">
          {/* Type of Loan Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-center">Type of Loan</h3>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <select 
                  value={loanType} 
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full p-3 text-center font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">-- TYPE OF LOAN --</option>
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
              <h3 className="font-semibold text-gray-800 text-center">Loan Requirements</h3>
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
                  Select a loan type to view requirements
                </div>
              )}
            </div>
          </div>

          {/* Loan Process Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-center">Application Process</h3>
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
        <div className="flex-1 bg-white shadow-sm m-6 ml-0 rounded-lg">
          <div className="h-full flex items-center justify-center">
            {!loanType ? (
              <div className="text-center px-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-2">Application</h1>
                <h2 className="text-5xl font-bold text-gray-800 mb-6">Form</h2>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                  Please select a loan type from the sidebar to begin your application
                </p>
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{loanType}</h1>
                    <div className="w-16 h-1 bg-red-600 rounded"></div>
                  </div>
                  
                  {/* Basic Info Section - Common to all loan types */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">Name:</label>
                        <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">Date of Birth:</label>
                        <input type="date" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">Contact Number:</label>
                        <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter contact number" />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">Email Address:</label>
                        <input type="email" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter email address" />
                      </div>
                    </div>
                
                        <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Marital Status:</label>
                            <select
                              value={maritalStatus}
                              onChange={(e) => setMaritalStatus(e.target.value)}
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
                              value={numberOfChildren}
                              onChange={(e) => setNumberOfChildren(e.target.value === "" ? "" : Number(e.target.value))}
                              min={0}
                            />
                          </div>
                        </div>
                        {maritalStatus === "Married" && (
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Name:</label>
                              <input
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter spouse name"
                                value={spouseName}
                                onChange={(e) => setSpouseName(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Occupation:</label>
                              <input
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter spouse occupation"
                                value={spouseOccupation}
                                onChange={(e) => setSpouseOccupation(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                         {/* ==== Address Section ==== */}
                                <div className="mb-4">
                                  <label className="block font-medium mb-2 text-gray-700">Home Address:</label>
                                  <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Click on the map or type here"
                                  />
                                </div>
                        
                                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                  <MapContainer
                                                              center={[12.8797, 121.774]}
                                                              zoom={6}
                                                              style={{ height: "300px", width: "100%" }}
                                                            >
                                                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                              <MapComponent setAddress={setAddress} />
                                                            </MapContainer>
                                </div>
                  </div>

              {loanType === "Regular Loan With Collateral" && (
                <WithCollateralLoanForm
                  maritalStatus={maritalStatus}
                  setMaritalStatus={setMaritalStatus}
                  incomeSource={incomeSource}
                  setIncomeSource={setIncomeSource}
                  address={address}
                  setAddress={setAddress}
                  employmentStatus={employmentStatus}
                  setEmploymentStatus={setEmploymentStatus}
                />
              )}

                {loanType === "Regular Loan Without Collateral" && (
                <WithoutCollateralLoanForm
                  maritalStatus={maritalStatus}
                  setMaritalStatus={setMaritalStatus}
                  incomeSource={incomeSource}
                  setIncomeSource={setIncomeSource}
                  address={address}
                  setAddress={setAddress}
                  employmentStatus={employmentStatus}
                  setEmploymentStatus={setEmploymentStatus}
                />
                )}

                  {loanType === "Open-Term Loan" && (
                <OpenTermLoanForm
                  maritalStatus={maritalStatus}
                  setMaritalStatus={setMaritalStatus}
                  incomeSource={incomeSource}
                  setIncomeSource={setIncomeSource}
                  address={address}
                  setAddress={setAddress}
                  employmentStatus={employmentStatus}
                  setEmploymentStatus={setEmploymentStatus}
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Application Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">Your loan application has been received and is being processed.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Your Application ID:</p>
                <p className="text-lg font-semibold text-red-600">{mockLoanId}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}