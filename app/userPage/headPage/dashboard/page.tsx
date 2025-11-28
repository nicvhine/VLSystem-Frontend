'use client';

import { FiDownload } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsTops from "@/app/commonComponents/statistics/loanStatisticsTops";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatisticsCharts";
import translations from "@/app/commonComponents/translation";
import { exportDashboardToPDF } from '@/lib/pdfExport';

type DashboardStats = {
  totalBorrowers: number;
  activeBorrowers: number;
  collectables: number;
  totalDisbursed: number;
  totalCollected: number;
  totalLoans: number;
  closedLoans: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  deniedApplications: number;
};

export default function HeadDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>({
    stats: null,
    borrowersOverTime: [],
    loanDisbursementOverTime: [],
    topCollectorsData: [],
    applicationsByType: [],
    topBorrowersData: [],
    topAgentsData: [],
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stat/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const stats = {
          totalBorrowers: data.totalBorrowers,
          activeBorrowers: data.activeBorrowers,
          collectables: data.collectables,
          totalDisbursed: data.totalDisbursed,
          totalCollected: data.totalCollected,
          totalLoans: data.totalLoans,
          closedLoans: data.closedLoans,
          totalApplications: data.totalApplications,
          pendingApplications: data.pendingApplications,
          approvedApplications: data.approvedApplications,
          deniedApplications: data.deniedApplications,
        };

        const resAgents = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stat/top-agents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAgents = await resAgents.json();

        setDashboardData({
          stats,
          borrowersOverTime: data.borrowersOverTime || [],
          loanDisbursementOverTime: data.loanDisbursementOverTime || [],
          topCollectors: data.topCollectors || [],
          applicationsByType: data.applicationsByType || [],
          topBorrowers: data.topBorrowers || [],
          topAgents: dataAgents || [],
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    }
    loadStats();
  }, []);

  const handleExportPDF = async () => {
    setIsGenerating(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      await exportDashboardToPDF(dashboardData, {
        title: 'Analytics Dashboard Report - Head',
        subtitle: `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        filename: `head-dashboard-report-${timestamp}.pdf`,
        orientation: 'portrait',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with Export Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="export-button flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-4 h-4" />
              {isGenerating ? 'Generating PDF...' : 'Export to PDF'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

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
