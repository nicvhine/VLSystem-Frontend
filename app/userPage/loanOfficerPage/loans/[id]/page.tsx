"use client";

import { useEffect, useState } from "react";
import LoanOfficer from "../../page";

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
  paidAmount: number;
  remainingBalance: number;
  totalPayable: number;
  dateDisbursed: string;
  status?: string;
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
  

  collateralType: string;
  collateralValue: string;
  collateralDescription: string;
  ownershipStatus: string;
}

const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const capitalizeWords = (text?: string) => {
  if (!text) return "—";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LoansDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("loan");
  const [loanSubTab, setLoanSubTab] = useState("active");
  const [client, setClient] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <div className="p-8 text-gray-500 text-center">Loading client details...</div>;
  if (!client)
    return <div className="p-8 text-red-500 text-center">Client not found.</div>;

  const formatCurrency = (amount?: number) =>
    amount
      ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount)
      : "—";

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );

  return (
    <LoanOfficer>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header */}
        <div className="bg-white shadow py-8 mb-8">
          <div className="max-w-6xl mx-auto px-6 flex items-center space-x-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-red-600 flex-shrink-0 shadow">
              <img
                src={
                  client.profilePic
                    ? `http://localhost:3001/${client.profilePic.filePath}`
                    : "/default-avatar.png"
                }
                alt={client.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{client.borrowersId}</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-12">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {["personal", "loan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-lg ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "personal" ? "Personal Information" : "Loan Information"}
              </button>
            ))}
          </div>

          {/* PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* General Info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">General Information</h3>
                <div className="space-y-3">
                  <DetailRow label="Address" value={client.address || "—"} />
                  <DetailRow label="Date of Birth" value={client.dateOfBirth || "—"} />
                  <DetailRow label="Marital Status" value={client.maritalStatus || "—"} />
                  {client.maritalStatus === "Married" && (
                    <>
                      <DetailRow label="Spouse Name" value={client.spouseName || "—"} />
                      <DetailRow label="Spouse Occupation" value={client.spouseOccupation || "—"} />
                    </>
                  )}
                  <DetailRow label="Number of Children" value={client.numberOfChildren ?? "—"} />
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h3>
                <div className="space-y-3">
                  <DetailRow label="Contact Number" value={client.contactNumber || "—"} />
                  <DetailRow label="Email Address" value={client.emailAddress || "—"} />
                </div>
              </div>

              {/* Income Info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Income Information</h3>
                <div className="space-y-3">
                  <DetailRow label="Source of Income" value={capitalizeWords(client.incomeSource)} />
                  {client.incomeSource === "business" && (
                    <>
                      <DetailRow label="Business Type" value={client.spouseName || "—"} />
                      <DetailRow label="Spouse Occupation" value={client.spouseOccupation || "—"} />
                    </>
                  )}
                  {client.incomeSource === "employed" && (
                    <>
                      <DetailRow label="Occupation" value={capitalizeWords(client.occupation)} />
                      <DetailRow label="Employment Status" value={capitalizeWords(client.employmentStatus)} />
                    </>
                  )}
                  <DetailRow label="Monthly Income" value={formatCurrency(client.monthlyIncome)} />
                </div>
              </div>

              {/* Character References */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Character References</h3>
                <div className="space-y-3">
                  {client.characterReferences?.length ? (
                    client.characterReferences.map((ref, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="font-medium text-gray-700">{ref.name}</p>
                        <p className="text-sm text-gray-500">Contact: {ref.contact}</p>
                        {ref.relation && <p className="text-sm text-gray-500">Relationship: {ref.relation}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No character references provided</p>
                  )}
                </div>
              </div>

              {/* Collateral Info */}
              {(client.loanType === "Regular Loan With Collateral" ||
                client.loanType === "Open-Term Loan") && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-4 border-b pb-2">Collateral Information</h3>
                  <div className="space-y-3">
                    <DetailRow label="Collateral Type" value={capitalizeWords(client.collateralType)} />
                    <DetailRow label="Collateral Value" value={capitalizeWords(client.collateralValue)} />
                    <DetailRow label="Collateral Description" value={capitalizeWords(client.collateralDescription)} />
                    <DetailRow label="Ownership Status" value={capitalizeWords(client.ownershipStatus)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOAN TAB */}
{activeTab === "loan" && (
  <div className="space-y-8">
    {/* Loan Summary */}
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Loan Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Loans */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 text-center shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Total Loans</span>
          <p className="text-3xl font-bold text-blue-700 mt-2">{client.numberOfLoans}</p>
        </div>

        {/* Borrower Status */}
        <div
          className={`${
            client.activeLoan === "Yes" ? "bg-gradient-to-r from-green-50 to-green-100" : "bg-gradient-to-r from-yellow-50 to-yellow-100"
          } rounded-xl p-5 text-center shadow hover:shadow-lg transition transform hover:-translate-y-1`}
        >
          <span
            className={`text-sm font-semibold uppercase tracking-wide ${
              client.activeLoan === "Yes" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            Borrower Status
          </span>
          <p
            className={`text-3xl font-bold mt-2 ${
              client.activeLoan === "Yes" ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {client.activeLoan === "Yes" ? "Active" : "Inactive"}
          </p>
        </div>

        {/* Credit Score */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 text-center shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Credit Score</span>
          <p className="text-3xl font-bold text-purple-700 mt-2">{client.score}</p>
        </div>
      </div>
    </section>

    {/* Loan Sub-Tabs */}
    <div className="flex border-b border-gray-200">
      {["active", "past"].map((tab) => (
        <button
          key={tab}
          className={`px-6 py-3 font-medium ${
            loanSubTab === tab ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setLoanSubTab(tab)}
        >
          {tab === "active" ? "Active Loan" : "Past Loans"}
        </button>
      ))}
    </div>

    {/* Active Loan */}
    {loanSubTab === "active" && client.currentLoan && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-900">Current Loan</h3>
          <DetailRow label="Loan Type" value={client.currentLoan.type} />
          <DetailRow label="Disbursed Date" value={formatDate(client.currentLoan.dateDisbursed)} />
          <DetailRow label="Principal Amount" value={formatCurrency(client.currentLoan.amount)} />
          <DetailRow label="Interest Rate" value={`${client.currentLoan.interestRate}%`} />
          <DetailRow label="Loan Term" value={`${client.currentLoan.terms} months`} />
          <DetailRow label="Total Payable" value={formatCurrency(client.currentLoan.totalPayable)} />
          <DetailRow label="Paid Amount" value={formatCurrency(client.currentLoan.paidAmount)} />
          <DetailRow label="Remaining Balance" value={formatCurrency(client.currentLoan.remainingBalance)} />
        </div>
      </div>
    )}

    {/* Past Loans */}
    {loanSubTab === "past" && (
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Loan History</h2>
        {client.previousLoans?.length ? (
          <ul className="space-y-4">
            {client.previousLoans.map((loan, idx) => (
              <li
                key={idx}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition transform hover:-translate-y-1"
              >
                <p className="font-medium text-gray-800">{loan.type}</p>
                <p className="text-sm text-gray-500">Amount: {formatCurrency(loan.amount)}</p>
                <p className="text-sm text-gray-500">Released: {formatDate(loan.dateDisbursed)}</p>
                <p className="text-sm text-gray-500">Status: {loan.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No previous loans available</p>
        )}
      </div>
    )}
  </div>
)}

        </div>
      </div>
    </LoanOfficer>
  );
}
