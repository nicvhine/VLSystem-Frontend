'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useLoanDetails } from "./hooks";
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";
import PersonalInfo from "./components/personalInfo";
import LoanInfo from "./components/loanInfo";
import EndorseInputModal from "./components/EndorseInputModal";
import EndorseLetterModal from "./components/EndorseLetterModal";
import ErrorModal from "../../modals/errorModal";

interface Props {
  params: { id: string };
}

export default function LoansDetailPage({ params }: Props) {
  const { id } = params;
  const { loan: client, loading, role, t } = useLoanDetails(id);

  const [activeTab, setActiveTab] = useState<"personal" | "loan">("loan");
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [endorsementData, setEndorsementData] = useState<{ reason: string; date: string } | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading client details...</div>;
  if (!client)
    return <div className="p-8 text-center text-red-500">Client not found.</div>;

  const Wrapper: React.ComponentType<{ children: React.ReactNode }> =
    role === "loan officer" ? LoanOfficer : role === "head" ? Head : Manager;

  const handleGenerate = (reason: string) => {
    const date = new Date().toLocaleDateString();
    setEndorsementData({ reason, date });
    setInputModalOpen(false);
    setLetterModalOpen(true);
  };

  const handleEndorseClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
  
      const res = await fetch(`http://localhost:3001/closure/by-loan/${client.loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Failed to check closure endorsement");
  
      const data = await res.json();
  
      if (!data.hasClosure) {
        setInputModalOpen(true);
        return;
      }
  
      const { status, createdAt } = data;
      const lastDate = new Date(createdAt);
      const now = new Date();
  
      if (status === "Pending" || status === "Approved") {
        setWarningMsg(`Cannot endorse. Last closure is ${status}.`);
        setShowWarning(true);
        return;
      }
  
      if (status === "Rejected") {
        const oneMonthLater = new Date(lastDate);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  
        if (now < oneMonthLater) {
          setWarningMsg(`Cannot re-endorse yet. Rejected on ${lastDate.toLocaleDateString()}. You can re-endorse after ${oneMonthLater.toLocaleDateString()}.`);
          setShowWarning(true);
          return;
        }
  
        setInputModalOpen(true);
        return;
      }
  
    } catch (err: any) {
      console.error(err);
      setWarningMsg(err.message || "Failed to verify closure endorsement.");
      setShowWarning(true);
    }
  };
  

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
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
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/commonComponents/loan"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t.b2}
              </Link>

              {role === "loan officer" && client.currentLoan?.status === "Active" && (
                <button
                  onClick={handleEndorseClick}
                  className="ml-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Endorse for closure
                </button>
              )}
            </div>
          </div>
        </div>

        {inputModalOpen && <EndorseInputModal onClose={() => setInputModalOpen(false)} onGenerate={handleGenerate} />}
        {endorsementData && (
          <EndorseLetterModal
            isOpen={letterModalOpen}
            onClose={() => setLetterModalOpen(false)}
            clientName={client.name}
            reason={endorsementData.reason}
            date={endorsementData.date}
            loanId={client.loanId}
          />
        )}

        <ErrorModal
          isOpen={showWarning}
          message={warningMsg}
          onClose={() => setShowWarning(false)}
        />

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

          {activeTab === "personal" && <PersonalInfo client={client} />}
          {activeTab === "loan" && <LoanInfo client={client} />}
        </div>
      </div>
    </Wrapper>
  );
}
