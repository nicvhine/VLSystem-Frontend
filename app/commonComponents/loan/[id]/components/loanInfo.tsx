import React from "react";
import { LoanDetails } from "../types";
import { DetailRow } from "../function";
import { formatCurrency, formatDate } from "@/app/commonComponents/utils/formatters";
import LedgerModal from "./ledgerModal";

interface Props {
  client: LoanDetails;
}

export default function LoanInfo({ client }: Props) {
  const [loanSubTab, setLoanSubTab] = React.useState("active");
  const [showLedger, setShowLedger] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Loan Summary */}
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

      {/* Loan Tabs */}
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

      {/* Active Loan */}
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

      {/* Past Loans */}
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

      <LedgerModal
        isOpen={showLedger}
        onClose={() => setShowLedger(false)}
        loanId={client.loanId || null}
        totalPayable={client.currentLoan?.totalPayable || 0}
      />
    </div>
  );
}
