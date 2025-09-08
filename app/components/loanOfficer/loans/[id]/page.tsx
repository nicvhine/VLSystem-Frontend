"use client";

import { useEffect, useState } from 'react';
import LoanOfficer from '../../page';

const API_URL = "http://localhost:3001/loans";

interface CharacterReference {
  name: string;
  contact: string;
  relation?: string;
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

interface ProfilePic {
  fileName: string;
  filePath: string;
  mimeType: string;
}

interface LoanDetails {
  loanId: string;
  name: string;
  loanType: string;
  borrowersId: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  spouseName?: string;
  spouseOccupation?: string;
  numberOfChildren?: number;
  contactNumber?: string;
  emailAddress?: string;
  address?: string;
  incomeSource?: string;
  employmentStatus?: string;
  occupation?: string;
  monthlyIncome?: number;
  score?: number;
  activeLoan?: "Yes" | "No";
  numberOfLoans?: number;
  characterReferences?: CharacterReference[];
  currentLoan?: CurrentLoan;
  profilePic?: ProfilePic;
  previousLoans?: CurrentLoan[];

  //collateral
  collateralType: string;
  collateralValue: string;
  collateralDescription: string;
  ownershipStatus: string;
}

const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

const capitalizeWords = (text?: string) => {
  if (!text) return "—";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LoansDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("loan");
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<LoanDetails | null>(null);
  const [activeTab2, setActiveTab2] = useState('general'); 

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

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!client) return <div className="p-6 text-red-500">Client not found.</div>;

  const formatCurrency = (amount?: number) =>
    amount
      ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
      : '—';

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
                src={client.profilePic ? `http://localhost:3001/${client.profilePic.filePath}` : "/default-avatar.png"}
                alt={client.name}
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
          {["personal", "loan"].map((tab) => {
            const labels: Record<string, string> = {
              personal: "Personal Information",
              loan: "Loan Information",
            };

            return (
              <button
                key={tab}
                className={`px-6 py-3 text-md font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            );
          })}
          </div>

          {/* Tab Contents */}
          <div className="w-full space-y-6">
            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <div className="w-full flex flex-col space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col w-full">
                  {/* Sub Tabs Navigation */}
                  <div className="px-6 py-4 border-b border-gray-200 flex space-x-8">
                    <button
                      onClick={() => setActiveTab2('general')}
                      className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
                        activeTab2 === 'general'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      General 
                    </button>
                    <button
                      onClick={() => setActiveTab2('contact')}
                      className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
                        activeTab2 === 'contact'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Contact 
                    </button>
                    <button
                      onClick={() => setActiveTab2('income')}
                      className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
                        activeTab2 === 'income'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Income 
                    </button>
                    <button
                      onClick={() => setActiveTab2('references')}
                      className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
                        activeTab2 === 'references'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Character References
                    </button>
                    {(client.loanType === "Regular Loan With Collateral" || client.loanType === "Open-Term Loan") && (
                      <button
                        onClick={() => setActiveTab2('collateral')}
                        className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
                          activeTab2 === 'collateral'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Collateral
                      </button>
                    )}
                  </div>

                  {/* Sub Tabs Content */}
                  <div className="p-6 flex-grow overflow-y-auto min-h-[400px] w-full">
                  
                  {/* general */}
                  {activeTab2 === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailRow label="Address" value={client.address || '—'} />
                      <DetailRow label="Date of Birth" value={client.dateOfBirth || '—'} />
                      <DetailRow label="Marital Status" value={client.maritalStatus || '—'} />
                      {client.maritalStatus === "Married" && (
                        <>
                          <DetailRow label="Spouse Name" value={client.spouseName || '—'} />
                          <DetailRow label="Spouse Occupation" value={client.spouseOccupation || '—'} />
                        </>
                      )}
                      <DetailRow label="Number of Children" value={client.numberOfChildren ?? '—'} />
                    </div>
                  )}

                  {/* contact */}
                  {activeTab2 === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailRow label="Contact Number" value={client.contactNumber || '—'} />
                      <DetailRow label="Email Address" value={client.emailAddress || '—'} />
                    </div>
                  )}

                  {/* income */}
                  {activeTab2 === 'income' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailRow label="Source of Income" value={capitalizeWords(client.incomeSource || '—')} />
                        {client.incomeSource === "business" && (
                          <>
                            <DetailRow label="Business Type" value={client.spouseName || '—'} />
                            <DetailRow label="Spouse Occupation" value={client.spouseOccupation || '—'} />
                          </>
                        )}
                        {client.incomeSource === "employed" && (
                          <>
                            <DetailRow label="Occupation" value={capitalizeWords(client.occupation || '—')} />
                            <DetailRow label="Employment Status" value={capitalizeWords(client.employmentStatus || '—')} />
                          </>
                        )}
                            <DetailRow label="Monthly Income" value={formatCurrency(client.monthlyIncome || '—')} />

                    </div>
                  )}

                  {activeTab2 === 'references' && (
                    <div className="space-y-4">
                      {client.characterReferences?.length ? (
                        client.characterReferences.map((ref, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  Reference {i + 1}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{ref.name}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{ref.contact}</span></p>
                                <p className="text-sm break-words"><span className="font-medium text-gray-700">Relationship:</span> <span className="text-gray-900">{ref.relation}</span></p>
                              </div>
                            </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No character references provided</p>
                      )}
                    </div>
                  )}


                  {/* collateral */}
                    {activeTab2 === 'collateral' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailRow label="Collateral Type" value={capitalizeWords(client.collateralType || '—')} />
                        <DetailRow label="Collateral Value" value={capitalizeWords(client.collateralValue || '—')} />
                        <DetailRow label="Collateral Description" value={capitalizeWords(client.collateralDescription || '—')} />
                        <DetailRow label="Ownership Status" value={capitalizeWords(client.ownershipStatus || '—')} />
                      </div>
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
                      <div className="space-y-4">
                        <DetailRow label="Loan Type" value={client.currentLoan.type} />
                        <DetailRow label="Principal Amount" value={formatCurrency(client.currentLoan.amount)} />
                        <DetailRow label="Interest Rate" value={`${client.currentLoan.interestRate}%`} />
                        <DetailRow label="Loan Term" value={`${client.currentLoan.terms} months`} />
                        <DetailRow label="Total Payable" value={formatCurrency(client.currentLoan.totalPayable)} />
                      </div>
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
                        <p className="text-sm text-gray-600">Amount: {formatCurrency(loan.amount)}</p>
                        <p className="text-sm text-gray-600">Released: {formatDate(loan.dateDisbursed)}</p>
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
                      <p className="text-sm text-gray-600">Contact: {ref.contactNumber}</p>
                      {ref.relation && <p className="text-sm text-gray-600">Relationship: {ref.relation}</p>}
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
