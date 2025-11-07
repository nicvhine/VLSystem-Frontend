'use client';

import Manager from "../layout";
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";

export default function ManagerDashboard() {
  return (
    <Manager>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

          {/* Left Column: Stats + Tops */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <LoanStatistics />
            <LoanStatisticsTops />
          </div>

          {/* Right Column: Charts */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <LoanStatisticsCharts />
          </div>

        </div>
      </div>
    </Manager>
  );
}
