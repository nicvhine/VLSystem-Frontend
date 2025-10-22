'use client';

import {
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiPieChart,
  FiClock,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { useLoanStats } from "@/app/commonComponents/statistics/hooks";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { StatCard } from "@/app/commonComponents/statistics/functions";
import translations from "@/app/commonComponents/translation";

export default function LoanStatistics() {
  const [role, setRole] = useState<'loanOfficer' | 'manager' | 'head'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("role") as 'loanOfficer' | 'manager' | 'head') || 'loanOfficer';
    }
    return 'loanOfficer';
  });

  // Lazy initializer ensures we read from localStorage only on mount
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, []);

  // Re-fetch stats whenever role or language changes
  const { loading, loanStats, collectionStats, typeStats, applicationStats } = useLoanStats(role, language);

  const t = translations.statisticTranslation[language];
  const l = translations.loanTermsTranslator[language];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">

      {(role === "manager" || role === "head") && (
        <>
          {/* Financial Overview */}
          <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiDollarSign className="text-red-600" /> {t.h1}
            </h2>
            <div className="flex flex-col gap-2">
              <StatCard
                label={l.l4}
                value={loanStats.totalPrincipal ?? 0}
                color="text-green-600"
                icon={FiDollarSign}
                isAmount
              />
              <StatCard
                label={l.l6}
                value={loanStats.totalInterest ?? 0}
                color="text-red-600"
                icon={FiTrendingUp}
                isAmount
              />
            </div>
          </section>

          {/* Collection Status */}
          <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiCheckCircle className="text-red-600" /> {t.h2}
            </h2>
            <div className="flex flex-col gap-2">
              <StatCard
                label={t.s5}
                value={collectionStats.totalCollectables ?? 0}
                color="text-blue-600"
                icon={FiPieChart}
                isAmount
              />
              <StatCard
                label={t.s6}
                value={collectionStats.totalCollected ?? 0}
                color="text-green-600"
                icon={FiCheckCircle}
                isAmount
              />
              <StatCard
                label={t.s7}
                value={collectionStats.totalUnpaid ?? 0}
                color="text-red-600"
                icon={FiXCircle}
                isAmount
              />
            </div>
          </section>
        </>
      )}

      {/* Application Status */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiUsers className="text-red-600" /> {t.h3}
        </h2>
        <div className="flex flex-col gap-2">
          <StatCard
            label={t.s2?.replace("Pending", "Applied") || "Applied"}
            value={applicationStats.applied ?? 0}
            color="text-yellow-600"
            icon={FiClock}
          />
          <StatCard
            label={t.s3?.replace("Applications", "") || "Approved"}
            value={applicationStats.approved ?? 0}
            color="text-green-600"
            icon={FiCheckCircle}
          />
          <StatCard
            label={t.s4?.replace("Applications", "") || "Denied"}
            value={applicationStats.denied ?? 0}
            color="text-red-600"
            icon={FiXCircle}
          />
        </div>
      </section>

      {/* Loan Types */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiPieChart className="text-red-600" /> {t.h4}
        </h2>
        <div className="flex flex-col gap-2">
          <StatCard
            label={l.l1}
            value={typeStats.withCollateral ?? 0}
            color="text-blue-600"
            icon={FiUsers}
          />
          <StatCard
            label={l.l2}
            value={typeStats.withoutCollateral ?? 0}
            color="text-green-600"
            icon={FiUsers}
          />
          <StatCard
            label={l.l3}
            value={typeStats.openTerm ?? 0}
            color="text-red-600"
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
}
