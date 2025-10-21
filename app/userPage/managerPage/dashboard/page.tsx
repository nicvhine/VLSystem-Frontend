'use client';

import AuditLog from "./auditLog";
import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanStatisticsCharts from "@/app/commonComponents/statistics/loanStatiticsChart";
import Manager from "../page";

export default function ManagerDashboard() {
  return (
    <Manager>
      <div className="min-h-screen bg-gray-100 flex flex-col">

        {/* ===== Main Content ===== */}
        <main className="flex-1 px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* === Left Panel: Stats Cards + Charts === */}
            <section className="xl:col-span-2 flex flex-col gap-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <LoanStatistics />
                </div>

                {/* Chart Panel */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <LoanStatisticsCharts />
                </div>
              </div>

            </section>

            {/* === Right Panel: Audit Log ===
            <section className="xl:col-span-1 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Audit Log</h2>
                <AuditLog />
              </div>
            </section> */}
            
          </div>
        </main>
      </div>
    </Manager>
  );
}
