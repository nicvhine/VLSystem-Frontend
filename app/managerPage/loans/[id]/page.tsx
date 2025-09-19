"use client";

import { useEffect, useState } from "react";
import Manager from "../../page";
import { FiFileText } from "react-icons/fi"; 
import LedgerModal from "./ledgerModal";

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
  //employed
  employmentStatus?: string;
  occupation?: string;
  //business
  businessType: string;
  dateStarted: string;
  businessLocation: string;

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
  const [showLedger, setShowLedger] = useState(false);

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
    <div className="flex flex-col py-1">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
      <div className="font-semibold text-gray-800 text-sm">{value}</div>
    </div>
  );

  return (
    <Manager>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header */}
        <div className="bg-white shadow-sm py-6 mb-6">
          <div className="max-w-6xl mx-auto px-6 flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
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
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-500 text-sm font-medium">{client.borrowersId}</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-sm">
            {["personal", "loan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 font-semibold text-base transition-all ${
                  activeTab === tab
                    ? "bg-red-600 text-white border-b-2 border-red-600 rounded-t-lg shadow-md"
                    : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {tab === "personal" ? "Personal Information" : "Loan Information"}
              </button>
            ))}
          </div>

          {/* PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* General Info */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center border-b border-gray-100 pb-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  General Information
                </h3>
                <div className="space-y-2">
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
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center border-b border-gray-100 pb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <DetailRow label="Contact Number" value={client.contactNumber || "—"} />
                  <DetailRow label="Email Address" value={client.emailAddress || "—"} />
                </div>
              </div>

              {/* Income Info */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center border-b border-gray-100 pb-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Income Information
              </h3>
              <div className="space-y-2">
                <DetailRow
                  label="Source of Income"
                  value={capitalizeWords(client.incomeSource)}
                />

                {client.incomeSource?.toLowerCase() === "business" && (
                  <>
                    <DetailRow label="Business Type" value={capitalizeWords(client.businessType)} />
                    <DetailRow label="Date Started" value={formatDate(client.dateStarted)} />
                    <DetailRow label="Location" value={capitalizeWords(client.businessLocation)} />
                  </>
                )}

                {client.incomeSource?.toLowerCase() === "employed" && (
                  <>
                    <DetailRow label="Occupation" value={capitalizeWords(client.occupation)} />
                    <DetailRow label="Employment Status" value={capitalizeWords(client.employmentStatus)} />
                  </>
                )}

                <DetailRow label="Monthly Income" value={formatCurrency(client.monthlyIncome)} />
              </div>
            </div>


              {/* Character References - Now Horizontal and Full Width */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center border-b border-gray-100 pb-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Character References
                </h3>
                <div className="space-y-2">
                  {client.characterReferences?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {client.characterReferences.map((ref, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <p className="font-semibold text-gray-800">{ref.name}</p>
                          <p className="text-sm text-gray-600">📞 {ref.contact}</p>
                          {ref.relation && <p className="text-sm text-gray-500">👥 {ref.relation}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No character references provided</p>
                  )}
                </div>
              </div>

              {/* Collateral Info */}
              {(client.loanType === "Regular Loan With Collateral" ||
                client.loanType === "Open-Term Loan") && (
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center border-b border-gray-100 pb-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Collateral Information
                  </h3>
                  <div className="space-y-2">
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
  <div className="space-y-6">
    {/* Loan Summary */}
    <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center border-b border-gray-100 pb-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        Loan Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Loans */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center shadow hover:shadow-md transition-all">
          <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Total Loans</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{client.numberOfLoans}</p>
        </div>

        {/* Borrower Status */}
        <div
          className={`${
            client.activeLoan === "Yes" ? "bg-gradient-to-r from-green-50 to-green-100" : "bg-gradient-to-r from-gray-50 to-gray-100"
          } rounded-lg p-4 text-center shadow hover:shadow-md transition-all`}
        >
          <span
            className={`text-sm font-semibold uppercase tracking-wide ${
              client.activeLoan === "Yes" ? "text-green-600" : "text-gray-600"
            }`}
          >
            Borrower Status
          </span>
          <p
            className={`text-2xl font-bold mt-1 ${
              client.activeLoan === "Yes" ? "text-green-700" : "text-gray-700"
            }`}
          >
            {client.activeLoan === "Yes" ? "Active" : "Inactive"}
          </p>
        </div>

        {/* Credit Score */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center shadow hover:shadow-md transition-all">
          <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Credit Score</span>
          <p className="text-2xl font-bold text-purple-700 mt-1">{client.score}</p>
        </div>
      </div>
    </section>

    {/* Loan Sub-Tabs */}
    <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
      {["active", "past"].map((tab) => (
        <button
          key={tab}
          className={`flex-1 px-6 py-3 font-semibold transition-all ${
            loanSubTab === tab ? "bg-red-600 text-white rounded-t-lg" : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
          }`}
          onClick={() => setLoanSubTab(tab)}
        >
          {tab === "active" ? "Active Loan" : "Past Loans"}
        </button>
      ))}
    </div>

    {/* Active Loan */}
    {loanSubTab === "active" && (
      client.currentLoan ? (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700 flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Current Loan Details
            </div>
            <button
              onClick={() => setShowLedger(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <FiFileText className="w-5 h-5" />
              View Ledger
            </button>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailRow label="Loan Type" value={client.currentLoan.type} />
            <DetailRow label="Loan ID" value={client.loanId} />
            <DetailRow label="Disbursed Date" value={formatDate(client.currentLoan.dateDisbursed)} />
            <DetailRow label="Principal Amount" value={formatCurrency(client.currentLoan.amount)} />
            <DetailRow label="Interest Rate" value={`${client.currentLoan.interestRate}%`} />
            <DetailRow label="Loan Term" value={`${client.currentLoan.terms} months`} />
            <DetailRow label="Total Payable" value={formatCurrency(client.currentLoan.totalPayable)} />
            <DetailRow label="Paid Amount" value={formatCurrency(client.currentLoan.paidAmount)} />
            <DetailRow label="Remaining Balance" value={formatCurrency(client.currentLoan.remainingBalance)} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-gray-500 text-center">
          No active loan available
        </div>
      )
    )}


    {/* Past Loans */}
    {loanSubTab === "past" && (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center border-b border-gray-100 pb-2">
          <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
          Loan History
        </h2>
        {client.previousLoans?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.previousLoans.map((loan, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md border border-gray-100 transition-all"
              >
                <p className="font-semibold text-gray-800 mb-2">{loan.type}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Amount: <span className="font-medium">{formatCurrency(loan.amount)}</span></p>
                  <p className="text-gray-600">Released: <span className="font-medium">{formatDate(loan.dateDisbursed)}</span></p>
                  <p className="text-gray-600">Status: <span className="font-medium text-blue-600">{loan.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No previous loans available</p>
        )}
      </div>
    )}
  </div>
)}

        </div>

        <LedgerModal
          isOpen={showLedger}
          onClose={() => setShowLedger(false)}
          loanId={client.loanId || null}
          totalPayable={client.currentLoan?.totalPayable || 0}
        />


      </div>

    </Manager>
  );
}