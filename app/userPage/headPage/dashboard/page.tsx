'use client';

import AuditLog from "./auditLog";
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatiticsChart";
import Head from "../page";
import { useLoanStats } from '@/app/commonComponents/statistics/hooks';
import { StatCard } from '@/app/commonComponents/statistics/functions';
import translations from '@/app/commonComponents/translation';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiCheckCircle } from 'react-icons/fi';

export default function HeadDashboard() {

  const { loading, loanStats, collectionStats, typeStats, applicationStats, language } = useLoanStats('manager');
  const t = translations.statisticTranslation[language];

  return (
    <Head>
      <div className="h-screen w-full box-border bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden p-6">
        {/* Two-column layout: left = stats (vertical), right = charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left column - vertical stats */}
          <div className="md:col-span-1 flex flex-col gap-4 overflow-auto">
            <LoanStatistics />
          </div>

          {/* Right column - charts arranged per sketch */}
          <div className="md:col-span-2">
            <LoanStatisticsCharts />
          </div>

          {/* === Right Panel: Audit Log ===
          <section className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-4 h-full overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Audit Log</h2>
              <AuditLog />
            </div>
          </section> */}

        </div>
      </div>
    </Head>
  );
}