'use client';

import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";
import translations from "@/app/commonComponents/translation";

export default function ManagerDashboard() {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    <style jsx global>{`
      @media print {
        body {
          background: white !important;
        }
        .no-print {
          display: none !important;
        }
        .print-page-break {
          page-break-after: always;
          break-after: page;
        }
        @page {
          margin: 1cm;
          size: auto;
        }
      }
    `}</style>
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto print:bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            Export Dashboard
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6 print:flex-col" id="dashboardContent">

        {/* Left Column: Stats + Tops - Page 1 */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2 print:w-full print-page-break">
          <LoanStatistics />
          <LoanStatisticsTops />
        </div>

        {/* Right Column: Charts - Page 2 */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 print:w-full">
          <LoanStatisticsCharts />
        </div>

        </div>
      </div>
    </div>
    </>
  );
}
