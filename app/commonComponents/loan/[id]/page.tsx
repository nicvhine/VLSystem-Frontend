"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LedgerModal from "./components/ledgerModal";

// Role-based page wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

// API endpoint for loan details
const API_URL = "http://localhost:3001/loans";

// Interface for character reference data
interface CharacterReference {
  name: string;
  contact: string;
  relation?: string;
}

// Interface for current loan information
interface CurrentLoan {
  purpose: string;
  type: string;
  principal: number;
  termsInMonths: number;
  interestRate: number;
  paymentSchedule: string;
  startDate: string;
  paidAmount: number;
  remainingBalance: number;
  totalPayable: number;
  dateDisbursed: string;
  status?: string;
}

// Interface for profile picture data
interface ProfilePic {
  fileName: string;
  filePath: string;
  mimeType: string;
}

// Main interface for loan details data structure
interface LoanDetails {
  loanId: string;
  name: string;
  loanType: string;
  borrowersId: string;
  appDob?: string;
  appMarital?: string;
  appSpouseName?: string;
  appSpouseOccupation?: string;
  appChildren?: number;
  contactNumber?: string;
  emailAddress?: string;
  address?: string;
  sourceOfIncome?: string;

  // Employment information
  appEmploymentStatus?: string;
  appOccupation?: string;

  // Business information
  businessType: string;
  dateStarted: string;
  businessLocation: string;

  // Loan details
  totalPayable: string;
  principal: string;

  // Additional loan information
  appMonthlyIncome?: number;
  score?: number;
  status?: string;
  totalLoans?: number;
  references?: CharacterReference[];
  currentLoan?: CurrentLoan;
  profilePic?: ProfilePic;
  previousLoans?: CurrentLoan[];

  // Collateral information
  collateralType: string;
  collateralValue: string;
  collateralDescription: string;
  ownershipStatus: string;
}

/**
 * Format date to a readable Philippine locale string
 */
const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  : "-";

/**
 * Capitalize each word in a string for display purposes
 */
const capitalizeWords = (text?: string) => {
  if (!text) return "-";
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
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

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
    return <div className="p-8 text-center text-gray-500">Loading client details...</div>;
  if (!client)
    return <div className="p-8 text-center text-red-500">Client not found.</div>;

  const formatCurrency = (amount?: number) =>
    typeof amount === "number"
  ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount)
  : "-";

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col py-1">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );

  let Wrapper;
  if (role === "loan officer") {
    Wrapper = LoanOfficer;
  } else if (role === "head") {
    Wrapper = Head;
  } else {
    Wrapper = Manager;
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/commonComponents/loan"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to Loans
            </Link>
          </div>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 pb-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
              <img
                src={
                  client.profilePic
                    ? `http://localhost:3001/${client.profilePic.filePath}`
                    : "/default-avatar.png"
                }
                alt={client.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500">{client.borrowersId}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-8 space-y-6">
          <div className="mt-4 flex overflow-hidden rounded-lg border border-gray-200 bg-white">
            {[
              { key: "personal", label: "Personal Information" },
              { key: "loan", label: "Loan Information" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "personal" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">General Information</h3>
                <div className="space-y-2">
                  <DetailRow label="Address" value={client.address || "-"} />
                  <DetailRow label="Date of Birth" value={client.appDob || "-"} />
                  <DetailRow label="Marital Status" value={client.appMarital || "-"} />
                  {client.appMarital === "Married" && (
                    <>
                      <DetailRow label="Spouse Name" value={client.appSpouseName || "-"} />
                      <DetailRow label="Spouse Occupation" value={client.appSpouseOccupation || "-"} />
                    </>
                  )}
                  <DetailRow label="Number of Children" value={client.appChildren ?? "-"} />
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Contact Information</h3>
                <div className="space-y-2">
                  <DetailRow label="Contact Number" value={client.contactNumber || "-"} />
                  <DetailRow label="Email Address" value={client.emailAddress || "-"} />
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Income Information</h3>
                <div className="space-y-2">
                  <DetailRow label="Source of Income" value={capitalizeWords(client.sourceOfIncome)} />

                  {client.sourceOfIncome?.toLowerCase() === "business" && (
                    <>
                      <DetailRow label="Business Type" value={capitalizeWords(client.businessType)} />
                      <DetailRow label="Date Started" value={formatDate(client.dateStarted)} />
                      <DetailRow label="Location" value={capitalizeWords(client.businessLocation)} />
                    </>
                  )}

                  {client.sourceOfIncome?.toLowerCase() === "employed" && (
                    <>
                      <DetailRow label="Occupation" value={capitalizeWords(client.appOccupation)} />
                      <DetailRow label="Employment Status" value={capitalizeWords(client.appEmploymentStatus)} />
                    </>
                  )}

                  <DetailRow label="Monthly Income" value={formatCurrency(client.appMonthlyIncome)} />
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6 md:col-span-2 lg:col-span-3">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Character References</h3>
                {client.references?.length ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {client.references.map((ref, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-3">
                        <p className="text-sm font-medium text-gray-800">{ref.name}</p>
                        <p className="text-xs text-gray-500">Contact: {ref.contact}</p>
                        {ref.relation && <p className="text-xs text-gray-500">Relationship: {ref.relation}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No character references provided.</p>
                )}
              </section>

              {(client.loanType === "Regular Loan With Collateral" ||
                client.loanType === "Open-Term Loan") && (
                <section className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Collateral Information</h3>
                  <div className="space-y-2">
                    <DetailRow label="Collateral Type" value={capitalizeWords(client.collateralType)} />
                    <DetailRow label="Collateral Value" value={client.collateralValue || "-"} />
                    <DetailRow label="Collateral Description" value={capitalizeWords(client.collateralDescription)} />
                    <DetailRow label="Ownership Status" value={capitalizeWords(client.ownershipStatus)} />
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === "loan" && (
            <div className="space-y-6">
              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Loan Summary</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md border border-gray-200 p-4">
                    <span className="text-xs uppercase text-gray-500">Total Loans</span>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{client.totalLoans ?? "-"}</p>
                  </div>
                  <div className="rounded-md border border-gray-200 p-4">
                    <span className="text-xs uppercase text-gray-500">Borrower Status</span>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{client.status || "-"}</p>
                  </div>
                  <div className="rounded-md border border-gray-200 p-4">
                    <span className="text-xs uppercase text-gray-500">Credit Score</span>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{client.score ?? "-"}</p>
                  </div>
                </div>
              </section>

              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                {[
                  { key: "active", label: "Active Loan" },
                  { key: "past", label: "Past Loans" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setLoanSubTab(tab.key)}
                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                      loanSubTab === tab.key
                        ? "bg-red-600 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {loanSubTab === "active" && (
                client.currentLoan ? (
                  <section className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Current Loan Details
                      </h3>
                      <button
                        onClick={() => setShowLedger(true)}
                        className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                      >
                        View Ledger
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
                      <DetailRow label="Loan Type" value={client.currentLoan.type} />
                      <DetailRow label="Loan ID" value={client.loanId} />
                      <DetailRow label="Disbursed Date" value={formatDate(client.currentLoan.dateDisbursed)} />
                      <DetailRow label="Principal Amount" value={formatCurrency(client.currentLoan.principal)} />
                      <DetailRow label="Interest Rate" value={`${client.currentLoan.interestRate}%`} />
                      <DetailRow label="Loan Term" value={`${client.currentLoan.termsInMonths} months`} />
                      <DetailRow label="Total Payable" value={formatCurrency(client.currentLoan.totalPayable)} />
                      <DetailRow label="Paid Amount" value={formatCurrency(client.currentLoan.paidAmount)} />
                      <DetailRow label="Remaining Balance" value={formatCurrency(client.currentLoan.remainingBalance)} />
                    </div>
                  </section>
                ) : (
                  <section className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
                    No active loan available.
                  </section>
                )
              )}

              {loanSubTab === "past" && (
                <section className="rounded-lg border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Loan History</h2>
                  {client.previousLoans?.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {client.previousLoans.map((loan, idx) => (
                        <div key={idx} className="rounded-lg border border-gray-200 p-4">
                          <p className="text-sm font-semibold text-gray-800">{loan.type}</p>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Principal: {formatCurrency(loan.principal)}</p>
                            <p>Released: {formatDate(loan.dateDisbursed)}</p>
                            {loan.status && <p>Status: {loan.status}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No previous loans available.</p>
                  )}
                </section>
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
    </Wrapper>
  );
}
