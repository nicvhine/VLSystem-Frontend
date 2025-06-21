"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../navbar';

const API_URL = "http://localhost:3001/loans";

interface CharacterReference {
  name: string;
  contactNumber: string;
}

interface CurrentLoan {
  purpose: string;
  type: string;
  amount: number;
  terms: number;
  interestRate: number;
  paymentSchedule: string;
  startDate: string;
  maturityDate: string;
  remainingBalance: number;
}

interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  principal: number;
  termsInMonths: number;
  totalPayable: number;
  balance: number;
  status: string;
  dateReleased: string;

  id?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  numberOfChildren?: number;
  contactNumber?: string;
  emailAddress?: string;
  address?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  houseStatus?: string;
  sourceOfIncome?: string;
  occupation?: string;
  monthlyIncome?: number;
  score?: number;
  activeLoan?: "Yes" | "No";
  numberOfLoans?: number;
  characterReferences?: CharacterReference[];
  currentLoan?: CurrentLoan;
  imageUrl?: string;
}

export default function LoansDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("loan");
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<LoanDetails | null>(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${params.id}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Failed to fetch loan details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!client) {
    return <div className="p-6 text-red-500">Client not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      {/* Client Header */}
      <div className="w-full bg-white shadow-sm py-6 mb-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-600 flex-shrink-0">
            <img
              src={client.imageUrl || "/default-avatar.png"}
              alt="Client"
              className="w-full h-full object-cover"
            />
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

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex border-b border-gray-200 mb-6">
          {["personal", "loan", "references"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-md font-medium ${activeTab === tab ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "personal" ? "Personal Information" : tab === "loan" ? "Loan Information" : "References"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-3">
                  <div><span className="text-sm text-gray-500">Full Name</span><div className="font-medium">{client.name}</div></div>
                  <div><span className="text-sm text-gray-500">Date of Birth</span><div className="font-medium">{client.dateOfBirth}</div></div>
                  <div><span className="text-sm text-gray-500">Marital Status</span><div className="font-medium">{client.maritalStatus}</div></div>
                  <div><span className="text-sm text-gray-500">Number of Children</span><div className="font-medium">{client.numberOfChildren}</div></div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div><span className="text-sm text-gray-500">Mobile Number</span><div className="font-medium">{client.contactNumber}</div></div>
                  <div><span className="text-sm text-gray-500">Email Address</span><div className="font-medium">{client.emailAddress}</div></div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                <div className="space-y-3">
                  <div><span className="text-sm text-gray-500">Home Address</span><div className="font-medium">{client.address}</div></div>
                  <div><span className="text-sm text-gray-500">Barangay</span><div className="font-medium">{client.barangay}</div></div>
                  <div><span className="text-sm text-gray-500">Municipality</span><div className="font-medium">{client.municipality}</div></div>
                  <div><span className="text-sm text-gray-500">Province</span><div className="font-medium">{client.province}</div></div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
                <div className="space-y-3">
                  <div><span className="text-sm text-gray-500">House Status</span><div className="font-medium">{client.houseStatus}</div></div>
                  <div><span className="text-sm text-gray-500">Source of Income</span><div className="font-medium">{client.sourceOfIncome}</div></div>
                  <div><span className="text-sm text-gray-500">Occupation</span><div className="font-medium">{client.occupation}</div></div>
                  <div><span className="text-sm text-gray-500">Monthly Income</span><div className="font-medium">{client.monthlyIncome}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* LOAN TAB */}
          {activeTab === "loan" && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <span className="text-sm text-blue-600">Total Loans</span>
                    <p className="text-2xl font-bold text-blue-700">{client.numberOfLoans}</p>
                  </div>
                  <div className={client.activeLoan === "Yes" ? "bg-green-50 p-4" : "bg-yellow-50 p-4"}>
                    <span className={client.activeLoan === "Yes" ? "text-sm text-green-600" : "text-sm text-yellow-600"}>
                      Loan Status
                    </span>
                    <p className={client.activeLoan === "Yes" ? "text-2xl font-bold text-green-700" : "text-2xl font-bold text-yellow-700"}>
                      {client.activeLoan === "Yes" ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4">
                    <span className="text-sm text-purple-600">Credit Score</span>
                    <p className="text-2xl font-bold text-purple-700">{client.score}</p>
                  </div>
                </div>
              </div>

              {client.currentLoan ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Current Loan Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div><span className="text-sm text-gray-500">Loan Purpose</span><div className="font-medium">{client.currentLoan.purpose}</div></div>
                      <div><span className="text-sm text-gray-500">Loan Type</span><div className="font-medium">{client.currentLoan.type}</div></div>
                      <div><span className="text-sm text-gray-500">Loan Amount</span><div className="font-medium">{client.currentLoan.amount}</div></div>
                      <div><span className="text-sm text-gray-500">Terms</span><div className="font-medium">{client.currentLoan.terms} months</div></div>
                    </div>
                    <div className="space-y-3">
                      <div><span className="text-sm text-gray-500">Interest Rate</span><div className="font-medium">{client.currentLoan.interestRate}% monthly</div></div>
                      <div><span className="text-sm text-gray-500">Payment Schedule</span><div className="font-medium">{client.currentLoan.paymentSchedule}</div></div>
                      <div><span className="text-sm text-gray-500">Start Date</span><div className="font-medium">{client.currentLoan.startDate}</div></div>
                      <div><span className="text-sm text-gray-500">Maturity Date</span><div className="font-medium">{client.currentLoan.maturityDate}</div></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700">Remaining Balance</span>
                      <span className="text-xl font-bold text-red-600">{client.currentLoan.remainingBalance}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No active loans at the moment</p>
                </div>
              )}
            </div>
          )}

          {/* REFERENCES TAB */}
          {activeTab === "references" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Character References</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {client.characterReferences?.map((ref, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{ref.name}</p>
                    <p className="text-sm text-gray-600">{ref.contactNumber}</p>
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
