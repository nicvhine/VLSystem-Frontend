"use client";

import React from "react";
import Link from "next/link";
import { useLoanDetails } from "./hooks";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import PersonalInfo from "./components/personalInfo";
import LoanInfo from "./components/loanInfo";

interface Props {
  params: { id: string }; 
}

export default function LoansDetailPage({ params }: Props) {
  const { id } = params; 

  const { loan: client, loading, role, t } = useLoanDetails(id);
  const [activeTab, setActiveTab] = React.useState<"personal" | "loan">("loan");

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading client details...</div>;
  if (!client)
    return <div className="p-8 text-center text-red-500">Client not found.</div>;

  let Wrapper: React.ComponentType<{ children: React.ReactNode }> = Manager;
  if (role === "loan officer") Wrapper = LoanOfficer;
  else if (role === "head") Wrapper = Head;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={
                    client.profilePic?.filePath
                      ? client.profilePic.filePath.startsWith("http")
                        ? client.profilePic.filePath
                        : `http://localhost:3001/${client.profilePic.filePath}`
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
              <div className="flex-shrink-0">
                <Link
                  href="/commonComponents/loan"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t.b2}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-6 pb-8 space-y-6">
          <div className="mt-4 flex overflow-hidden rounded-lg border border-gray-200 bg-white">
            {[
              { key: "personal", label: t?.t2 || "Personal Information" },
              { key: "loan", label: t?.t1 || "Loan Information" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "personal" | "loan")}
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

          {/* Active Tab Content */}
          {activeTab === "personal" && <PersonalInfo client={client} />}
          {activeTab === "loan" && <LoanInfo client={client} />}
        </div>
      </div>
    </Wrapper>
  );
}
