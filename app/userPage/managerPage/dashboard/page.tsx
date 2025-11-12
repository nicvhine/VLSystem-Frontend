'use client';

import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";
import translations from "@/app/commonComponents/translation";

export default function ManagerDashboard() {


  return (
    <>
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6" id="dashboardContent">

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
    </div>
    </>
  );
}
