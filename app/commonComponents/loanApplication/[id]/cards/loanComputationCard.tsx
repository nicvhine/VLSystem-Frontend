'use client';

import { useState, useEffect } from "react";
import { formatCurrency } from "@/app/commonComponents/utils/formatters";
import { LoanComputationCardProps } from "@/app/commonComponents/utils/Types/components";
import { FiEdit } from "react-icons/fi";
import EditPrincipalModal from "@/app/commonComponents/modals/editPrincipalModal";

export default function LoanComputationCard({ application, t, l }: LoanComputationCardProps) {
  const [loanApp, setLoanApp] = useState(application);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoanApp(application);
  }, [application]);

  const handleSavePrincipal = async (newAmount: number) => {
    if (!loanApp?.applicationId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/loan-applications/${loanApp.applicationId}/principal`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPrincipal: newAmount }),
        }
      );

      if (!res.ok) throw new Error("Failed to update principal");

      const data = await res.json();

      // Normalize fields as strings for consistent UI rendering
      xtedApp = {
        ...data.updatedApp,
        appLoanAmount: String(data.updatedApp.appLoanAmount),
        appLoanTerms: String(data.updatedApp.appLoanTerms),
        appInterestRate: String(data.updatedApp.appInterestRate),
        appInterestAmount: String(data.updatedApp.appInterestAmount),
        appTotalInterestAmount: String(data.updatedApp.appTotalInterestAmount),
        appTotalPayable: String(data.updatedApp.appTotalPayable),
        appMonthlyDue: String(data.updatedApp.appMonthlyDue),
        appNetReleased: String(data.updatedApp.appNetReleased),
        appServiceFee: String(data.updatedApp.appServiceFee),
      };

      setLoanApp(updatedApp);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating principal");
    } finally {
      setLoading(false);
    }
  };

  if (!loanApp) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto p-6 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{l.t25}</h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">{l.t26}</span>
          <span className="text-gray-900 break-words text-sm leading-relaxed">
            {loanApp?.appLoanPurpose || "—"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">{l.t27}</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-900">{formatCurrency(Number(loanApp?.appLoanAmount))}</span>
            {loanApp?.status === "Pending" && (
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Edit Principal"
              >
                <FiEdit className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">{l.t28}</span>
          <span className="text-gray-900">{loanApp?.appInterestRate ?? "—"}%</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">{l.t29}</span>
          <span className="text-gray-900">
            {loanApp?.appLoanTerms ?? "—"} {l.t33}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t30}</span>
            <span className="text-gray-900">{formatCurrency(Number(loanApp?.appTotalInterestAmount))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t31}</span>
            <span className="text-gray-900 font-semibold text-lg">{formatCurrency(Number(loanApp?.appTotalPayable))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t32}</span>
            <span className="text-gray-900">{formatCurrency(Number(loanApp?.appMonthlyDue))}</span>
          </div>
        </div>
      </div>

      {isEditOpen && loanApp?.applicationId && (
      <EditPrincipalModal
        applicationId={loanApp.applicationId}
        currentAmount={Number(loanApp.appLoanAmount)}
        onSave={(newAmount) => {
          setLoanApp(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              appLoanAmount: newAmount, 
            };
          });
          setIsEditOpen(false);
        }}
        onClose={() => setIsEditOpen(false)}
        loading={loading}
      />
    )}

    </div>
  );
}
