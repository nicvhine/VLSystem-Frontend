'use client';

import { useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import axios from "axios";
import Navbar from "../../components/landing/landingNavbar";
import { Dispatch, SetStateAction } from "react";


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
type Props = {
  maritalStatus: string;
  setMaritalStatus: Dispatch<SetStateAction<string>>;
  incomeSource: string;
  setIncomeSource: Dispatch<SetStateAction<string>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  employmentStatus: string;
  setEmploymentStatus: Dispatch<SetStateAction<string>>;
};

type LoanOption = {
  amount: number;
  months: number;
  interest: number;
};

const loanOptions: LoanOption[] = [
  { amount: 10000, months: 6, interest: 1.5 },
  { amount: 20000, months: 12, interest: 1.2 },
  { amount: 50000, months: 24, interest: 1.0 },
];

const LocationSelector = ({ setAddress }: { setAddress: Dispatch<SetStateAction<string>> }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    },
  });
  return null;
};

const BasicLoanForm = ({
  maritalStatus,
  setMaritalStatus,
  incomeSource,
  setIncomeSource,
  address,
  setAddress,
  employmentStatus,
  setEmploymentStatus,
}: Props) => {
  const [numberOfChildren, setNumberOfChildren] = useState<number | "">("");
  const [spouseName, setSpouseName] = useState("");
  const [spouseOccupation, setSpouseOccupation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessMonthlyIncome, setBusinessMonthlyIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employmentMonthlyIncome, setEmploymentMonthlyIncome] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(e.target.files);
  };

  const handleSubmit = () => {
    alert("Submitted!");
  };

  return (
    <>
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
                    </>
                  )}

export default BasicLoanForm;
