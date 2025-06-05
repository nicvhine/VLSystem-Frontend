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
    <div className="min-h-screen bg-gray-100">
    <Navbar />

      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r-2 border-black p-4 space-y-4">
          {/* Type of Loan Section */}
          <div className="border-2 border-black">
            <div className="bg-gray-200 p-3 border-b-2 border-black">
              <h3 className="font-semibold text-center">Type of Loan</h3>
            </div>
            <div className="p-4">
              <div className="border-2 border-black rounded-lg p-3">
                <select 
                  value={loanType} 
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full p-2 text-center font-semibold bg-white"
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
          <div className="border-2 border-black">
            <div className="bg-gray-200 p-3 border-b-2 border-black">
              <h3 className="font-semibold text-center">Type of Loan Requirements</h3>
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              {loanType ? (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-2">{loanType}</h4>
                  <ul className="space-y-1 text-sm">
                    {getRequirements(loanType).map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center">
                  Select a loan type to view requirements
                </div>
              )}
            </div>
          </div>

          {/* Loan Status or Process Section */}
          <div className="border-2 border-black">
            <div className="bg-gray-200 p-3 border-b-2 border-black">
              <h3 className="font-semibold text-center">Loan Status or Process</h3>
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm mb-2">Application Process</h4>
                <ul className="space-y-2 text-sm">
                  {loanProcessSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-gray-300 text-xs px-2 py-1 rounded">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 border-2 border-black m-4 ml-0">
          <div className="h-full flex items-center justify-center">
            {!loanType ? (
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">Application</h1>
                <h2 className="text-6xl font-bold text-gray-800">Form</h2>
                <p className="text-lg text-gray-600 mt-6">Please select a loan type to begin your application</p>
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold text-red-600 mb-6">{loanType}</h1>
                  
                  {/* Basic Info Section - Common to all loan types */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-1">Name:</label>
                        <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter name" />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Date of Birth:</label>
                        <input type="date" className="w-full border border-gray-300 p-2 rounded" />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Contact Number:</label>
                        <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter contact number" />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Email Address:</label>
                        <input type="email" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter email address" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form Content Based on Loan Type */}
                  {loanType === 'Regular Loan With Collateral' && (
                    <>
                      {/* Personal Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Marital Status:</label>
                            <select
                              value={maritalStatus}
                              onChange={(e) => setMaritalStatus(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded"
                            >
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Number of Children:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter number of children" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-1">Spouse Name:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Spouse Occupation:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Section */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Address Information</h4>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Home Address:</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Click on the map or type here"
                          />
                        </div>

                        <div className="rounded overflow-hidden shadow border">
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
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Collateral Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Collateral Type:</label>
                            <select className="w-full border border-gray-300 p-2 rounded">
                              <option value="">Select collateral type</option>
                              <option value="real-estate">Real Estate</option>
                              <option value="vehicle">Vehicle</option>
                              <option value="equipment">Equipment</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Estimated Value:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter estimated value" />
                          </div>
                          <div className="col-span-2">
                            <label className="block font-medium mb-1">Collateral Description:</label>
                            <textarea 
                              className="w-full border border-gray-300 p-2 rounded h-24" 
                              placeholder="Provide detailed description of your collateral"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Ownership Status:</label>
                            <select className="w-full border border-gray-300 p-2 rounded">
                              <option value="">Select ownership status</option>
                              <option value="sole-owner">Sole Owner</option>
                              <option value="joint-owner">Joint Owner</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Source of Income */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Source of Income</h4>
                        <div className="flex gap-6 mb-4">
                          {['business', 'employed'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="employmentType"
                                value={type}
                                checked={incomeSource === type}
                                onChange={() => setIncomeSource(type)}
                                className="mr-2"
                              />
                              {type === 'business' ? 'Business Owner' : 'Employed'}
                            </label>
                          ))}
                        </div>

                        {incomeSource === 'business' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">Type of Business:</label>
                              <select className="w-full border border-gray-300 p-2 rounded">
                                <option value="">Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="food">Food & Beverage</option>
                                <option value="services">Services</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Date Started:</label>
                              <input type="date" className="w-full border border-gray-300 p-2 rounded" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Business Location:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Business Location" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}

                        {incomeSource === 'employed' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">Occupation/Position:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Occupation/Position" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Employment Status:</label>
                              <select
                                value={employmentStatus}
                                onChange={(e) => setEmploymentStatus(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded"
                              >
                                <option value="">Select employment status</option>
                                <option value="regular">Regular</option>
                                <option value="irregular">Irregular</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Company Name:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Company Name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Loan Details */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Loan Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Loan Purpose:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Loan Purpose" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Loan Amount:</label>
                            <select
                              className="w-full border border-gray-300 p-2 rounded"
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
                            <label className="block font-medium mb-1">Loan Terms (months):</label>
                            <input className="w-full border border-gray-300 p-2 rounded" value={selectedLoan?.months || ''} readOnly />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Monthly Interest Rate (%):</label>
                            <input className="w-full border border-gray-300 p-2 rounded" value={selectedLoan?.interest || ''} readOnly />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Document Upload</h4>
                        <div>
                          <label className="block font-medium mb-2">Upload Required Documents:</label>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                                      file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold"
                      >
                        Submit Application
                      </button>
                    </>
                  )}

                  {loanType === 'Regular Loan Without Collateral' && (
                    <>
                      {/* Personal Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Marital Status:</label>
                            <select
                              value={maritalStatus}
                              onChange={(e) => setMaritalStatus(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded"
                            >
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Number of Children:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter number of children" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-1">Spouse Name:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Spouse Occupation:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address and Housing */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Address & Housing Information</h4>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Home Address:</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Click on the map or type here"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block font-medium mb-2">House Status:</label>
                          <div className="flex gap-6">
                            {['owned', 'rented'].map((status) => (
                              <label key={status} className="flex items-center">
                                <input
                                  type="radio"
                                  name="houseStatus"
                                  value={status}
                                  checked={houseStatus === status}
                                  onChange={() => setHouseStatus(status)}
                                  className="mr-2"
                                />
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="rounded overflow-hidden shadow border">
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

                      {/* Income Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Income Information</h4>
                        <div className="flex gap-6 mb-4">
                          {['business', 'employed'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="incomeType"
                                value={type}
                                checked={incomeSource === type}
                                onChange={() => setIncomeSource(type)}
                                className="mr-2"
                              />
                              {type === 'business' ? 'Business Owner' : 'Employed'}
                            </label>
                          ))}
                        </div>

                        {incomeSource === 'business' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">Type of Business:</label>
                              <select className="w-full border border-gray-300 p-2 rounded">
                                <option value="">Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="food">Food & Beverage</option>
                                <option value="services">Services</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Date Started:</label>
                              <input type="date" className="w-full border border-gray-300 p-2 rounded" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Business Location:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Business Location" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Monthly Income" />
                            </div>
                          </div>
                        )}

                        {incomeSource === 'employed' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">Occupation/Position:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Occupation/Position" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Company Name:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Company Name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Company Address:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Company Address" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Monthly Income:</label>
                              <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Monthly Income" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Length of Service:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Length of Service" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Other Income Source:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Other Source of Income" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Character References and Loan Details */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Character References</h4><div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Reference 1 - Name:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter reference name" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 1 - Contact:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter contact number" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 2 - Name:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter reference name" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 2 - Contact:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter contact number" />
                          </div>
                        </div>
                      </div>

                      {/* Loan Details */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Loan Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Loan Purpose:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter Loan Purpose" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Loan Amount:</label>
                            <select
                              className="w-full border border-gray-300 p-2 rounded"
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
                            <label className="block font-medium mb-1">Loan Terms (months):</label>
                            <input className="w-full border border-gray-300 p-2 rounded" value={selectedLoan?.months || ''} readOnly />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Monthly Interest Rate (%):</label>
                            <input className="w-full border border-gray-300 p-2 rounded" value={selectedLoan?.interest || ''} readOnly />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Document Upload</h4>
                        <div>
                          <label className="block font-medium mb-2">Upload Required Documents:</label>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                                      file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold"
                      >
                        Submit Application
                      </button>
                    </>
                  )}

                  {loanType === 'Open-Term Loan' && (
                    <>
                      {/* Personal Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Marital Status:</label>
                            <select
                              value={maritalStatus}
                              onChange={(e) => setMaritalStatus(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded"
                            >
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Number of Dependents:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter number of dependents" />
                          </div>
                        </div>

                        {maritalStatus === 'Married' && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium mb-1">Spouse Name:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse name" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Spouse Occupation:</label>
                              <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter spouse occupation" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Address Information</h4>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Home Address:</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Click on the map or type here"
                          />
                        </div>

                        <div className="rounded overflow-hidden shadow border">
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

                      {/* Business Information */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Business Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Business Name:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter business name" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Business Type:</label>
                            <select className="w-full border border-gray-300 p-2 rounded">
                              <option value="">Select business type</option>
                              <option value="retail">Retail</option>
                              <option value="food">Food & Beverage</option>
                              <option value="services">Services</option>
                              <option value="manufacturing">Manufacturing</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Years in Operation:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter years in operation" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Business Address:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter business address" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Business Contact Number:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter business contact" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Monthly Gross Income:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter monthly gross income" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Monthly Net Income:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter monthly net income" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Number of Employees:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter number of employees" />
                          </div>
                        </div>
                      </div>

                      {/* Loan Purpose and Terms */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Loan Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Loan Purpose:</label>
                            <select className="w-full border border-gray-300 p-2 rounded">
                              <option value="">Select loan purpose</option>
                              <option value="business-expansion">Business Expansion</option>
                              <option value="inventory">Inventory Purchase</option>
                              <option value="equipment">Equipment Purchase</option>
                              <option value="working-capital">Working Capital</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Requested Amount:</label>
                            <input type="number" className="w-full border border-gray-300 p-2 rounded" placeholder="Enter requested amount" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Preferred Payment Schedule:</label>
                            <select className="w-full border border-gray-300 p-2 rounded">
                              <option value="">Select payment schedule</option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Expected Repayment Period:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter expected period (flexible)" />
                          </div>
                        </div>
                      </div>

                      {/* Character References */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Character References</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Reference 1 - Name:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter reference name" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 1 - Contact:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter contact number" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 2 - Name:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter reference name" />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Reference 2 - Contact:</label>
                            <input className="w-full border border-gray-300 p-2 rounded" placeholder="Enter contact number" />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-200 pb-2">Document Upload</h4>
                        <div>
                          <label className="block font-medium mb-2">Upload Required Documents:</label>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                                      file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG. You can upload multiple files.</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold"
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
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Your loan application has been submitted. Your application ID is:
              </p>
              <div className="bg-gray-100 p-3 rounded font-mono text-lg font-bold mb-6">
                {mockLoanId}
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Please save this ID for future reference. You will be contacted within 2-3 business days.
              </p>
              <button
                onClick={closeModal}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
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