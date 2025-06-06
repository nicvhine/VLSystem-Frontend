'use client';

import { useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import axios from "axios";
import Navbar from "../components/landing/landingNavbar";

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
            <div className="p-4 h-48 overflow-y-auto">
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
                  </div>

                  {/* Dynamic Form Content Based on Loan Type */}
                  {loanType === 'Regular Loan With Collateral' && (
                    <>
                      {/* Personal Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
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
                            <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter number of children" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Occupation:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Section */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Address Information
                        </h4>
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

                      {/* Collateral Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Collateral Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Collateral Type:</label>
                            <select className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                              <option value="">Select collateral type</option>
                              <option value="real-estate">Real Estate</option>
                              <option value="vehicle">Vehicle</option>
                              <option value="equipment">Equipment</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Estimated Value:</label>
                            <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter estimated value" />
                          </div>
                          <div className="col-span-2">
                            <label className="block font-medium mb-2 text-gray-700">Collateral Description:</label>
                            <textarea 
                              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                              placeholder="Provide detailed description of your collateral"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Ownership Status:</label>
                            <select className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                              <option value="">Select ownership status</option>
                              <option value="sole-owner">Sole Owner</option>
                              <option value="joint-owner">Joint Owner</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Source of Income */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Source of Income
                        </h4>
                        <div className="flex gap-6 mb-4">
                          {['business', 'employed'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="employmentType"
                                value={type}
                                checked={incomeSource === type}
                                onChange={() => setIncomeSource(type)}
                                className="mr-2 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-gray-700">
                                {type === 'business' ? 'Business Owner' : 'Employed'}
                              </span>
                            </label>
                          ))}
                        </div>

                        {incomeSource === 'business' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Type of Business:</label>
                              <select className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="">Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="food">Food & Beverage</option>
                                <option value="services">Services</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Date Started:</label>
                              <input type="date" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Business Location:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Business Location" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}

                        {incomeSource === 'employed' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Occupation/Position:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Occupation/Position" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Employment Status:</label>
                              <select
                                value={employmentStatus}
                                onChange={(e) => setEmploymentStatus(e.target.value)}
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="">Select employment status</option>
                                <option value="regular">Regular</option>
                                <option value="irregular">Irregular</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Company Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Company Name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Loan Details */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Loan Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Purpose:</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Loan Purpose" />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Amount:</label>
                            <select
                              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onChange={(e) => {
                                const selected = loanOptions.find((opt) => opt.amount === parseInt(e.target.value));
                                if (selected) setSelectedLoan(selected);
                              }}
                            >
                              <option value="">Select amount</option>
                              {loanOptions.map((opt) => (
                                <option key={opt.amount} value={opt.amount}>
                                  ₱{opt.amount.toLocaleString()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Terms (months):</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" value={selectedLoan?.months || ''} readOnly />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Monthly Interest Rate (%):</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" value={selectedLoan?.interest || ''} readOnly />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Document Upload
                        </h4>
                        <div>
                          <label className="block font-medium mb-3 text-gray-700">Upload Required Documents:</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                                        file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors shadow-sm"
                      >
                        Submit Application
                      </button>
                    </>
                  )}

                  {/* Similar structure for other loan types with same styling */}
                  {loanType === 'Regular Loan Without Collateral' && (
                    <>
                      {/* Personal Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
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
                            <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter number of children" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Occupation:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Section */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Address Information
                        </h4>
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

                      {/* Source of Income */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Source of Income
                        </h4>
                        <div className="flex gap-6 mb-4">
                          {['business', 'employed'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="employmentType"
                                value={type}
                                checked={incomeSource === type}
                                onChange={() => setIncomeSource(type)}
                                className="mr-2 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-gray-700">
                                {type === 'business' ? 'Business Owner' : 'Employed'}
                              </span>
                            </label>
                          ))}
                        </div>

                        {incomeSource === 'business' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Type of Business:</label>
                              <select className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="">Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="food">Food & Beverage</option>
                                <option value="services">Services</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Date Started:</label>
                              <input type="date" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Business Location:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Business Location" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}

                        {incomeSource === 'employed' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Occupation/Position:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Occupation/Position" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Employment Status:</label>
                              <select
                                value={employmentStatus}
                                onChange={(e) => setEmploymentStatus(e.target.value)}
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="">Select employment status</option>
                                <option value="regular">Regular</option>
                                <option value="irregular">Irregular</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Company Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Company Name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Loan Details */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Loan Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Purpose:</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Loan Purpose" />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Amount:</label>
                            <select
                              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onChange={(e) => {
                                const selected = loanOptions.find((opt) => opt.amount === parseInt(e.target.value));
                                if (selected) setSelectedLoan(selected);
                              }}
                            >
                              <option value="">Select amount</option>
                              {loanOptions.map((opt) => (
                                <option key={opt.amount} value={opt.amount}>
                                  ₱{opt.amount.toLocaleString()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Terms (months):</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" value={selectedLoan?.months || ''} readOnly />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Monthly Interest Rate (%):</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" value={selectedLoan?.interest || ''} readOnly />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Document Upload
                        </h4>
                        <div>
                          <label className="block font-medium mb-3 text-gray-700">Upload Required Documents:</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                                        file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors shadow-sm"
                      >
                        Submit Application
                      </button>
                    </>
                  )}

                  {/* Open-Term Loan */}
                  {loanType === 'Open-Term Loan' && (
                    <>
                      {/* Personal Information */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
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
                            <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter number of children" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Spouse Occupation:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Section */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Address Information
                        </h4>
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

                      {/* Source of Income */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Source of Income
                        </h4>
                        <div className="flex gap-6 mb-4">
                          {['business', 'employed'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="employmentType"
                                value={type}
                                checked={incomeSource === type}
                                onChange={() => setIncomeSource(type)}
                                className="mr-2 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-gray-700">
                                {type === 'business' ? 'Business Owner' : 'Employed'}
                              </span>
                            </label>
                          ))}
                        </div>

                        {incomeSource === 'business' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Type of Business:</label>
                              <select className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="">Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="food">Food & Beverage</option>
                                <option value="services">Services</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Date Started:</label>
                              <input type="date" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Business Location:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Business Location" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}

                        {incomeSource === 'employed' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Occupation/Position:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Occupation/Position" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Employment Status:</label>
                              <select
                                value={employmentStatus}
                                onChange={(e) => setEmploymentStatus(e.target.value)}
                                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="">Select employment status</option>
                                <option value="regular">Regular</option>
                                <option value="irregular">Irregular</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Company Name:</label>
                              <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Company Name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-2 text-gray-700">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Open-Term Loan Specific Details */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Open-Term Loan Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Purpose:</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter Loan Purpose" />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Loan Amount:</label>
                            <select
                              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onChange={(e) => {
                                const selected = loanOptions.find((opt) => opt.amount === parseInt(e.target.value));
                                if (selected) setSelectedLoan(selected);
                              }}
                            >
                              <option value="">Select amount</option>
                              {loanOptions.map((opt) => (
                                <option key={opt.amount} value={opt.amount}>
                                  ₱{opt.amount.toLocaleString()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Preferred Credit Line:</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter preferred credit line" />
                          </div>
                          <div>
                            <label className="block font-medium mb-2 text-gray-700">Monthly Interest Rate (%):</label>
                            <input className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50" value={selectedLoan?.interest || ''} readOnly />
                          </div>
                          <div className="col-span-2">
                            <label className="block font-medium mb-2 text-gray-700">Repayment Flexibility Requirements:</label>
                            <textarea 
                              className="w-full border border-gray-200 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                              placeholder="Describe your repayment flexibility requirements for the open-term loan"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                          Document Upload
                        </h4>
                        <div>
                          <label className="block font-medium mb-3 text-gray-700">Upload Required Documents:</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0 file:text-sm file:font-medium
                                        file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors shadow-sm"
                      >
                        Submit Application
                      </button>
                    </>
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