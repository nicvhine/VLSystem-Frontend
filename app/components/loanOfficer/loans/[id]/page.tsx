"use client";

import { useEffect, useState } from 'react';
import LoanOfficer from '../../page';


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
  totalPayable: number;
  dateDisbursed: string;
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
  borrowersId: string;
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
  incomeSource?: string;
  occupation?: string;
  monthlyIncome?: number;
  score?: number;
  activeLoan?: "Yes" | "No";
  numberOfLoans?: number;
  characterReferences?: CharacterReference[];
  currentLoan?: CurrentLoan;
  imageUrl?: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );

  return (
    <LoanOfficer>
    <div className="min-h-screen bg-gray-50 text-black">
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
              <span className="text-sm font-medium text-gray-700">{client.borrowersId}</span>
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
            {tab === "personal"
              ? "Personal Information"
              : tab === "loan"
              ? "Active Loan Information"
              : tab === "history"
              ? "Loan History"
              : "References"}
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
                  <div><span className="text-sm text-gray-500">Name</span><div className="font-medium">{client.name}</div></div>
                  <div><span className="text-sm text-gray-500">Date of Birth</span><div className="font-medium">{client.dateOfBirth}</div></div>
                  <div><span className="text-sm text-gray-500">Marital Status</span><div className="font-medium">{client.maritalStatus}</div></div>
                  <div><span className="text-sm text-gray-500">Number of Children</span><div className="font-medium">{client.numberOfChildren}</div></div>
                  <div><span className="text-sm text-gray-500">Home Address</span><div className="font-medium">{client.address}</div></div>
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
                </div>
              </div>
              <div>
              <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Source of Income</span>
                  <div className="font-medium">
                    {client.incomeSource 
                      ? client.incomeSource.charAt(0).toUpperCase() + client.incomeSource.slice(1) 
                      : "-"}
                  </div>
                </div>  

                {client.incomeSource === "Business Owner" && (
                  <>
                    <div>
                      <span className="text-sm text-gray-500">Type of Business</span>
                      <div className="font-medium">{client.businessType}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Business Location</span>
                      <div className="font-medium">{client.businessLocation}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Date Started</span>
                      <div className="font-medium">{client.businessDateStarted}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Monthly Income</span>
                      <div className="font-medium">{client.monthlyIncome}</div>
                    </div>
                  </>
                )}

                {client.incomeSource === "employed" && (
                  <>
                    <div>
                      <span className="text-sm text-gray-500">Occupation</span>
                      <div className="font-medium">{client.occupation}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Employment Status</span>
                      <div className="font-medium">{client.employmentStatus}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Company Name</span>
                      <div className="font-medium">{client.companyName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Monthly Income</span>
                      <div className="font-medium">{client.monthlyIncome}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            </div>
          )}
          
          {/* LOAN TAB */}
{activeTab === "loan" && (
  <div className="space-y-10">
    {/* Loan Summary */}
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Loan Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center flex flex-col items-center justify-center shadow-sm">
          <span className="text-sm text-blue-600 font-medium">Total Loans</span>
          <p className="text-3xl font-bold text-blue-700">{client.numberOfLoans}</p>
        </div>
        <div className={`${client.activeLoan === "Yes" ? "bg-green-50" : "bg-yellow-50"} rounded-lg p-4 text-center flex flex-col items-center justify-center shadow-sm`}>
          <span className={`text-sm font-medium ${client.activeLoan === "Yes" ? "text-green-600" : "text-yellow-600"}`}>Loan Status</span>
          <p className={`text-3xl font-bold ${client.activeLoan === "Yes" ? "text-green-700" : "text-yellow-700"}`}>
            {client.activeLoan === "Yes" ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center flex flex-col items-center justify-center shadow-sm">
          <span className="text-sm text-purple-600 font-medium">Credit Score</span>
          <p className="text-3xl font-bold text-purple-700">{client.score}</p>
        </div>
      </div>
    </section>

    {/* Current Loan Details */}
    {client.currentLoan ? (
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Current Loan Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <DetailRow label="Loan Type" value={client.currentLoan.type} />
            <DetailRow label="Principal Amount" value={formatCurrency(client.currentLoan.amount)} />
            <DetailRow label="Interest Rate" value={`${client.currentLoan.interestRate}%`} />
            <DetailRow label="Loan Term" value={`${client.currentLoan.terms} months`} />
            <DetailRow label="Total Payable" value={formatCurrency(client.currentLoan.totalPayable)} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <DetailRow label="Disbursed Date" value={formatDate(client.currentLoan.dateDisbursed)} />
            <DetailRow label="Payment Schedule" value={client.currentLoan.paymentSchedule} />
            <DetailRow label="Maturity Date" value={formatDate(client.currentLoan.maturityDate)} />
            <div className="pt-4 border-t mt-4">
              <span className="text-sm text-gray-500">Remaining Balance</span>
              <div className="font-bold text-red-600 text-xl">{formatCurrency(client.currentLoan.remainingBalance)}</div>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-gray-500 text-lg font-medium">No active loans at the moment</p>
      </div>
    )}
  </div>
)}


        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Loan History</h2>
            {client.previousLoans?.length ? (
              <ul className="space-y-2">
                {client.previousLoans.map((loan, idx) => (
                  <li key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{loan.type}</p>
                    <p className="text-sm text-gray-600">Amount: {loan.amount}</p>
                    <p className="text-sm text-gray-600">Released: {formatDate(loan.dateReleased)}</p>
                    <p className="text-sm text-gray-600">Status: {loan.status}</p>
                  </li> 
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No previous loans.</p>
            )}
          </div>
        )}



          {/* REFERENCES TAB */}
          {activeTab === "references" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Character References</h2>
              <div className="space-y-4">
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
    </LoanOfficer>
  );
}
