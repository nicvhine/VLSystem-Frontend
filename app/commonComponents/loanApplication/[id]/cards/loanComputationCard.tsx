"use client";
import { Application } from "../types";
import { formatCurrency } from "@/app/commonComponents/utils/formatters";

interface LoanComputationCardProps {
  application: Application | undefined;
  t: any;
  l: any;
}

export default function LoanComputationCard({ application, t, l }: LoanComputationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{l.t25}</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t26}</span>
            <span className="text-gray-900 break-words text-sm leading-relaxed">
              {application?.appLoanPurpose || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t27}</span>
            <span className="text-gray-900">
              {formatCurrency(application?.appLoanAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t28}</span>
            <span className="text-gray-900">{application?.appInterestRate || "—"}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t29}</span>
            <span className="text-gray-900">
              {application?.appLoanTerms || "—"} {l.t33}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t30}</span>
            <span className="text-gray-900">
              {formatCurrency(application?.appTotalInterestAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t31}</span>
            <span className="text-gray-900 font-semibold text-lg">
              {formatCurrency(application?.appTotalPayable)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{l.t32}</span>
            <span className="text-gray-900">
              {formatCurrency(application?.appMonthlyDue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
