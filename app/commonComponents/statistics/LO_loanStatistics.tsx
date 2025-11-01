'use client';

import { useLoanStats } from "@/app/commonComponents/statistics/hooks";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { formatCurrency } from "../utils/formatters";

export default function LoanStatisticsVertical() {
  const { s, t, loading, typeStats, applicationStats, topAgents = [] } = useLoanStats("manager"); 

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Stat row for all sections
  const StatRow = ({ label, value, isAmount }: any) => (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="font-semibold text-gray-900">{isAmount ? `₱${value.toLocaleString()}` : value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Application Status */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all p-4">
        <h2 className="text-md font-semibold text-red-600 mb-4">{t.h3}</h2>
        <StatRow label={t.s1} value={applicationStats.applied ?? 0} />
        <StatRow label={t.s3} value={applicationStats.approved ?? 0} />
        <StatRow label={t.s4} value={applicationStats.denied ?? 0} />
      </section>

      {/* Loan Types */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all p-4">
        <h2 className="text-md font-semibold text-red-600 mb-4">{t.h4}</h2>
        <StatRow label={s.l1} value={typeStats.withCollateral ?? 0} />
        <StatRow label={s.l2} value={typeStats.withoutCollateral ?? 0} />
        <StatRow label={s.l3} value={typeStats.openTerm ?? 0} />
      </section>

      {/* Top Agents */}
      <section className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="mb-4 flex items-center gap-2 text-m font-semibold text-yellow-500">
          {t.c14 || "Top 5 Agents"}
        </div>
        {topAgents.length === 0 ? (
          <p className="text-gray-500">{t.m2}</p>
        ) : (
          <ul className="list-decimal">
            {topAgents.map((a: any) => (
              <li key={a.agentId} className="flex justify-between">
                <span className="text-gray-700 font-medium">{a.name}</span>
                <span className="font-semibold">{formatCurrency(a.totalProcessedLoans)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
