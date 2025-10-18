"use client";

import { useState } from "react";
import { FiUser, FiFileText, FiPaperclip } from "react-icons/fi";
import { Application } from "../types";
import { formatCurrency, capitalizeWords } from "@/app/commonComponents/utils/formatters";
import WithCollateral from "../customization/withCollateral";
import OpenTerm from "../customization/openTerm";

interface ApplicationDetailsTabsProps {
  application: Application | undefined;
  l: any;
  t: any;
}

export default function IncomeCharactedCard({ application, l, t }: ApplicationDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"income" | "references" | "collateral">("income");

  return (
    <div className="lg:col-span-1 flex flex-col h-full">

      {/* TAB NAVIGATION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-grow flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("income")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "income"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {l.t2}
            </button>

            <button
              onClick={() => setActiveTab("references")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "references"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {l.t3}
            </button>

            {(application?.loanType === "Regular Loan With Collateral" ||
              application?.loanType === "Open-Term Loan") && (
              <button
                onClick={() => setActiveTab("collateral")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "collateral"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {l.t4}
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 flex-grow overflow-y-auto">

          {/* INCOME INFORMATION */}
          {activeTab === "income" && (
            <div className="space-y-4 h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">{l.t11}</p>
                <p className="text-gray-900">{capitalizeWords(application?.sourceOfIncome) || "—"}</p>
              </div>

              {application?.sourceOfIncome?.toLowerCase() === "employed" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t12}</p>
                    <p className="text-gray-900">{capitalizeWords(application?.appOccupation) || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t13}</p>
                    <p className="text-gray-900">{capitalizeWords(application?.appCompanyName) || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t14}</p>
                    <p className="text-gray-900">{capitalizeWords(application?.appEmploymentStatus) || "—"}</p>
                  </div>
                </>
              )}

              {application?.sourceOfIncome?.toLowerCase() === "business" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t15}</p>
                    <p className="text-gray-900">{application?.appTypeBusiness || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t16}</p>
                    <p className="text-gray-900">{application?.appBusinessName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t17}</p>
                    <p className="text-gray-900">{application?.appDateStarted || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{l.t18}</p>
                    <p className="text-gray-900">{application?.appBusinessLoc || "—"}</p>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500">{l.t19}</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(application?.appMonthlyIncome)}</p>
              </div>
            </div>
          )}

          {/* CHARACTER REFERENCES */}
          {activeTab === "references" && (
            <div className="h-full">
              {application?.appReferences && application.appReferences.length > 0 ? (
                <div className="space-y-4">
                  {application.appReferences.map((ref, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          {l.t20} {i + 1}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm break-words">
                          <span className="font-medium text-gray-700">{l.t21}:</span>{" "}
                          <span className="text-gray-900">{ref.name}</span>
                        </p>
                        <p className="text-sm break-words">
                          <span className="font-medium text-gray-700">{l.t22}:</span>{" "}
                          <span className="text-gray-900">{ref.contact}</span>
                        </p>
                        <p className="text-sm break-words">
                          <span className="font-medium text-gray-700">{l.t23}:</span>{" "}
                          <span className="text-gray-900">{ref.relation}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 h-full flex flex-col justify-center">
                  <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t.noReferences}</p>
                </div>
              )}
            </div>
          )}

          {/* COLLATERAL DETAILS */}
          {activeTab === "collateral" && (
            <div className="h-full">
              {application?.loanType === "Regular Loan With Collateral" && (
                <WithCollateral application={application} formatCurrency={formatCurrency} />
              )}
              {application?.loanType === "Open-Term Loan" && (
                <OpenTerm application={application} formatCurrency={formatCurrency} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* FILES SECTION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 flex-shrink-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{l.t24}</h3>
        </div>
        <div className="p-6">
          {application?.documents && application.documents.length > 0 ? (
            <div className="space-y-3">
              {application.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 max-w-[180px] break-all whitespace-normal">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-gray-500">12.3kb</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={
                        doc.filePath.startsWith("http")
                          ? doc.filePath
                          : `http://localhost:3001/${doc.filePath}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <FiPaperclip className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">{t.noDocuments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
