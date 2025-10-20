'use client';

import { FiDollarSign, FiTrendingUp, FiCheckCircle, FiXCircle, FiUsers, FiPieChart, FiClock } from "react-icons/fi";
import { useLoanStats } from "@/app/commonComponents/statistics/hooks";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { StatCard } from "@/app/commonComponents/statistics/functions";
import translations from "@/app/commonComponents/translation";

export default function HeadLoanStats() {
  const { loading, loanStats, collectionStats, typeStats, applicationStats, language } = useLoanStats("manager");
  const t = translations.statisticTranslation[language];
  const l = translations.loanTermsTranslator[language];

  if (loading) return <div className="flex justify-center items-center py-8"><LoadingSpinner /></div>;
  return (
    <div className="space-y-8">

      {/* Financial Overview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiDollarSign className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{t.h1}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label={l.l4}
            value={loanStats.totalPrincipal ?? 0}
            color="text-green-600"
            icon={FiDollarSign}
            isAmount={true}
          />
          <StatCard
            label={l.l6}
            value={loanStats.totalInterest ?? 0}
            color="text-red-600"
            icon={FiTrendingUp}
            isAmount={true}
          />
        </div>
      </section>

      {/* Collection Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiCheckCircle className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{t.h2}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label={t.s5}
            value={collectionStats.totalCollectables ?? 0}
            color="text-blue-600"
            icon={FiPieChart}
            isAmount={true}
          />
          <StatCard
            label={t.s6}
            value={collectionStats.totalCollected ?? 0}
            color="text-green-600"
            icon={FiCheckCircle}
            isAmount={true}
          />
          <StatCard
            label={t.s7}
            value={collectionStats.totalUnpaid ?? 0}
            color="text-red-600"
            icon={FiXCircle}
            isAmount={true}
          />
        </div>
      </section>

      {/* Application Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiUsers className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{t.h3}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiPieChart className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{t.h4}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
