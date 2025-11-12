'use client';

import { FiDownload } from 'react-icons/fi';
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";

export default function HeadDashboard() {
  const handleExportPDF = () => {
    // Small delay to ensure charts are fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  };

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 15mm;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            background: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          #dashboardContent {
            display: block !important;
          }
          
          #dashboardContent > * {
            page-break-inside: avoid;
          }
          
          /* Ensure images and canvases are ready */
          canvas, img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with Export Button */}
          <div className="flex justify-between items-center mb-6 no-print">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              title="Export Dashboard as PDF"
            >
              <FiDownload size={18} />
              Export PDF
            </button>
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
