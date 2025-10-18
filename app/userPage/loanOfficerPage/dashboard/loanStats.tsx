'use client';

import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiUsers } from 'react-icons/fi';
import translations from '@/app/commonComponents/Translation';
import { StatCard } from '@/app/commonComponents/statistics/functions';
import { useLoanStats } from '@/app/commonComponents/statistics/hooks';

export default function LoanStatsDashboard() {
  const { loading, typeStats, applicationStats, language } = useLoanStats("loanOfficer");

  const t = translations.statisticTranslation[language];
  const l = translations.loanTermsTranslator[language];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Application Status */}
      <section className="bg-gray-50 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.h3}</h2>
        <div className="flex flex-col gap-3">
        <StatCard
            label={t.s2?.replace("Pending", "Applied") || "Applied"}
            value={applicationStats.applied ?? 0}
            color="text-yellow-600"
            icon={FiClock}
        />
<StatCard
            label={t.s4?.replace("Applications", "") || "Denied"}
            value={applicationStats.pending ?? 0}
            color="text-red-600"
            icon={FiXCircle}
          />        <StatCard
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
      <section className="bg-gray-50 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.h4}</h2>
        <div className="flex flex-col gap-3">
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
