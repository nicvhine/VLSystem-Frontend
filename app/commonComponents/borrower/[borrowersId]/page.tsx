"use client";

import { useBorrowerDetails } from "../hooks";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import { User } from "lucide-react";

interface BorrowerPageProps {
  params: { borrowersId: string };
}

export default function BorrowerDetailPage({ params }: BorrowerPageProps) {
  const { borrowersId } = params;
  const { borrower, latestApplication, stats, loading, error } =
    useBorrowerDetails(borrowersId);
  const [role, setRole] = useState<"manager" | "head" | "loan officer">("manager");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as typeof role | null;
    if (storedRole) setRole(storedRole);
  }, []);

  const Wrapper = role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  if (loading)
    return (
      <Wrapper>
        <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
          Loading borrower details...
        </div>
      </Wrapper>
    );

  if (error)
    return (
      <Wrapper>
        <div className="text-center text-red-600 mt-10 text-lg font-semibold">{error}</div>
      </Wrapper>
    );

  if (!borrower)
    return (
      <Wrapper>
        <div className="text-center text-gray-500 mt-10 text-lg">No borrower found.</div>
      </Wrapper>
    );

  const mergedData = { ...borrower, ...latestApplication };
  const hasProfilePic = mergedData?.profilePic?.filePath;
  const imageSrc =
    hasProfilePic && mergedData.profilePic.filePath.startsWith("https")
      ? mergedData.profilePic.filePath
      : hasProfilePic
      ? `http://localhost:3001/${mergedData.profilePic.filePath}`
      : null;

  const latestLoanId = stats?.latestLoan?.loanId;
  const latestAppId =
    latestApplication?.applicationId || stats?.latestLoan?.applicationId;
  const sourceOfIncome = mergedData?.sourceOfIncome?.toLowerCase();

  return (
    <Wrapper>
      <div className="min-h-screen bg-white flex justify-center">
        <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl w-full">
          {/* HEADER */}
          <div className="bg-gray-600 py-5 text-center text-white rounded-3xl shadow-lg mb-5">
            <div className="flex flex-col items-center">
              <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-white mb-5 bg-white flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={mergedData.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <User className="text-red-600 w-16 h-16" />
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{mergedData.name}</h1>
              <p className="text-sm opacity-80 mt-1">
                Borrower ID: {mergedData.borrowersId}
              </p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PERSONAL */}
            <Card title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <LabeledField label="Email" value={mergedData.email} />
                <LabeledField label="Contact Number" value={mergedData.appContact} />
                <LabeledField label="Address" value={mergedData.appAddress} span />
                <LabeledField label="Date of Birth" value={mergedData.appDob} />
                <LabeledField label="Marital Status" value={mergedData.appMarital} />
                {mergedData.appChildren && mergedData.appChildren !== "0" && (
                  <LabeledField label="Children" value={mergedData.appChildren} />
                )}
                {mergedData.appSpouseName && (
                  <LabeledField label="Spouse Name" value={mergedData.appSpouseName} />
                )}
                {mergedData.appSpouseOccupation && (
                  <LabeledField
                    label="Spouse Occupation"
                    value={mergedData.appSpouseOccupation}
                  />
                )}
              </div>
            </Card>

            {/* INCOME */}
            <Card title="Income Information">
              {sourceOfIncome?.includes("business") ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <LabeledField
                    label="Monthly Income"
                    value={`₱${mergedData.appMonthlyIncome}`}
                  />
                  <LabeledField label="Type of Business" value={mergedData.appTypeBusiness} />
                  <LabeledField label="Business Name" value={mergedData.appBusinessName} />
                  <LabeledField label="Date Started" value={mergedData.appDateStarted} />
                  <LabeledField label="Business Location" value={mergedData.appBusinessLoc} span />
                </div>
              ) : sourceOfIncome?.includes("employ") ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <LabeledField
                    label="Monthly Income"
                    value={`₱${mergedData.appMonthlyIncome}`}
                  />
                  <LabeledField label="Occupation" value={mergedData.appOccupation} />
                  <LabeledField label="Employment Status" value={mergedData.appEmploymentStatus} />
                  <LabeledField label="Company Name" value={mergedData.appCompanyName} />
                </div>
              ) : (
                <p className="text-gray-600 italic text-sm">
                  No income information available.
                </p>
              )}
            </Card>
          </div>

          {/* STATS SECTION */}
          <Card title="Account Summary" className="mt-10">
            <p className="text-center text-sm text-gray-500 mt-6 italic"> 
              {latestLoanId || latestAppId ? "Tap card to view latest loan or application" : "No available loan or application"} 
            </p> 
            <div className="grid grid-cols-2 gap-6 text-center mt-5">
              <Link
                href={
                  latestLoanId
                    ? `/commonComponents/loan/${latestLoanId}`
                    : "#"
                }
                className={`block transition-transform ${
                  latestLoanId ? "hover:scale-[1.03]" : "cursor-not-allowed opacity-60"
                }`}
              >
                <StatCard label="Total Loans" value={stats?.totalLoans ?? 0} />
              </Link>

              <Link
                href={
                  latestAppId
                    ? `/commonComponents/loanApplication/${latestAppId}`
                    : "#"
                }
                className={`block transition-transform ${
                  latestAppId ? "hover:scale-[1.03]" : "cursor-not-allowed opacity-60"
                }`}
              >
                <StatCard label="Applications" value={stats?.totalApplications ?? 0} />
              </Link>          
              </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

/* --- REUSABLE COMPONENTS --- */
const Card = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl shadow-md p-8 bg-white border border-gray-100 ${className}`}>
    <h2 className="text-lg font-semibold text-red-700 mb-5 border-b border-red-100 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const LabeledField = ({
  label,
  value,
  span,
}: {
  label: string;
  value?: string | number;
  span?: boolean;
}) => (
  <div
    className={`flex flex-col ${
      span ? "sm:col-span-2" : ""
    } bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition`}
  >
    <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">{label}</p>
    <p className="text-gray-800 text-sm font-medium">
      {value && value !== "—" && value !== "0" ? value : "—"}
    </p>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center p-6 border border-gray-100 bg-white rounded-xl hover:shadow-md transition-all">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-3xl font-bold text-red-600 mt-1">{value}</p>
  </div>
);
