"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../navbar';

// Extended client data structure with all fields from application form
const sampleClients = [
  { 
    id: "CLT001", 
    name: "John Doe", 
    dateOfBirth: "15/04/1985",
    contactNumber: "+63 912 345 6789",
    emailAddress: "john.doe@email.com",
    address: "123 Main St", 
    municipality: "Cebu City",
    province: "Cebu",
    barangay: "Lahug",
    maritalStatus: "Married",
    numberOfChildren: 2,
    houseStatus: "Owned",
    sourceOfIncome: "Business Owner",
    occupation: "Restaurant Owner",
    monthlyIncome: "₱45,000",
    
    // Loan related information
    numberOfLoans: 3, 
    activeLoan: "Yes", 
    score: 85,
    
    // Current/Active loan details
    currentLoan: {
      purpose: "Business Expansion",
      amount: "₱150,000",
      type: "Regular Loan Without Collateral",
      terms: 12, // months
      interestRate: 1.5, // percentage
      paymentSchedule: "Monthly",
      startDate: "10/01/2025",
      maturityDate: "10/01/2026",
      remainingBalance: "₱125,000"
    },
    
    // Character references
    characterReferences: [
      { name: "Jane Smith", contactNumber: "+63 917 123 4567" },
      { name: "Michael Johnson", contactNumber: "+63 918 765 4321" },
      { name: "Sarah Williams", contactNumber: "+63 919 222 3333" }
    ]
  },
  { 
    id: "CLT002", 
    name: "Jane Smith", 
    dateOfBirth: "22/07/1990",
    contactNumber: "+63 923 456 7890",
    emailAddress: "jane.smith@email.com",
    address: "456 Oak Ave", 
    municipality: "Mandaue City",
    province: "Cebu",
    barangay: "Banilad",
    maritalStatus: "Single",
    numberOfChildren: 0,
    houseStatus: "Rented",
    sourceOfIncome: "Employed",
    occupation: "Senior Developer",
    monthlyIncome: "₱65,000",
    
    numberOfLoans: 2, 
    activeLoan: "No", 
    score: 92,
    
    currentLoan: null,
    
    characterReferences: [
      { name: "John Doe", contactNumber: "+63 912 345 6789" },
      { name: "Robert Brown", contactNumber: "+63 920 111 2222" },
      { name: "Emily Davis", contactNumber: "+63 925 333 4444" }
    ]
  },
];

const imageUrl = '../idPic.jpg'; 

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [client, setClient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (id) {
      const foundClient = sampleClients.find((client) => client.id === id);
      setClient(foundClient || null);
    }
  }, [id]);

  if (!client) return <div className="text-center text-xl font-semibold text-gray-800 p-10">Client not found or Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <Navbar />

      {/* Client Header */}
      <div className="w-full bg-white shadow-sm py-6 mb-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-600 flex-shrink-0">
            <img src={imageUrl} alt="Client" className="w-full h-full object-cover" />
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700">ID: {client.id}</span>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${client.activeLoan === "Yes" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {client.activeLoan === "Yes" ? "Active Loan" : "No Active Loan"}
              </span>
              <span className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">Score: {client.score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Detail Container */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`px-6 py-3 text-md font-medium ${activeTab === "personal" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button 
            className={`px-6 py-3 text-md font-medium ${activeTab === "loan" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("loan")}
          >
            Loan Information
          </button>
          <button 
            className={`px-6 py-3 text-md font-medium ${activeTab === "references" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("references")}
          >
            References
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Basic Information</h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="font-medium">{client.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Date of Birth</span>
                    <span className="font-medium">{client.dateOfBirth}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Marital Status</span>
                    <span className="font-medium">{client.maritalStatus}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Number of Children</span>
                    <span className="font-medium">{client.numberOfChildren}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Mobile Number</span>
                    <span className="font-medium">{client.contactNumber}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email Address</span>
                    <span className="font-medium">{client.emailAddress}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Address Information</h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Home Address</span>
                    <span className="font-medium">{client.address}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Barangay</span>
                    <span className="font-medium">{client.barangay}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Municipality</span>
                    <span className="font-medium">{client.municipality}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Province</span>
                    <span className="font-medium">{client.province}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Financial Information</h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">House Status</span>
                    <span className="font-medium">{client.houseStatus}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Source of Income</span>
                    <span className="font-medium">{client.sourceOfIncome}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Occupation</span>
                    <span className="font-medium">{client.occupation}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Monthly Income</span>
                    <span className="font-medium">{client.monthlyIncome}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "loan" && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Loan Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <span className="text-sm text-blue-600 font-medium">Total Loans</span>
                    <p className="text-2xl font-bold text-blue-700">{client.numberOfLoans}</p>
                  </div>
                  <div className={client.activeLoan === "Yes" ? "bg-green-50 rounded-lg p-4" : "bg-yellow-50 rounded-lg p-4"}>
                    <span className={client.activeLoan === "Yes" ? "text-sm text-green-600 font-medium" : "text-sm text-yellow-600 font-medium"}>Loan Status</span>
                    <p className={client.activeLoan === "Yes" ? "text-2xl font-bold text-green-700" : "text-2xl font-bold text-yellow-700"}>
                      {client.activeLoan === "Yes" ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <span className="text-sm text-purple-600 font-medium">Credit Score</span>
                    <p className="text-2xl font-bold text-purple-700">{client.score}</p>
                  </div>
                </div>
              </div>

              {client.currentLoan ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Current Loan Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Loan Details */}
                    <div>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Loan Purpose</span>
                          <span className="font-medium">{client.currentLoan.purpose}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Loan Type</span>
                          <span className="font-medium">{client.currentLoan.type}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Loan Amount</span>
                          <span className="font-medium">{client.currentLoan.amount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Terms (months)</span>
                          <span className="font-medium">{client.currentLoan.terms} months</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Interest Rate</span>
                          <span className="font-medium">{client.currentLoan.interestRate}% monthly</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Payment Schedule</span>
                          <span className="font-medium">{client.currentLoan.paymentSchedule}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Start Date</span>
                          <span className="font-medium">{client.currentLoan.startDate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Maturity Date</span>
                          <span className="font-medium">{client.currentLoan.maturityDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remaining Balance */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700">Remaining Balance</span>
                      <span className="text-xl font-bold text-red-600">{client.currentLoan.remainingBalance}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 font-medium">No active loans at the moment</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "references" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-200 mb-4">Character References</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {client.characterReferences.map((reference: {name: string, contactNumber: string}, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{reference.name}</p>
                    <p className="text-sm text-gray-600">{reference.contactNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}