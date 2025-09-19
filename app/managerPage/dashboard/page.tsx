'use client';

import AuditLog from "./auditLog";
import LoanStatsDashboard from "./loanStats";
import Head from "../page";
import { useState } from 'react';

export default function ManagerDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  return (
    <Head>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white px-6 ">
          {/* Navbar or title */}
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-140px)]">
            {/* Left Panel - Loan Stats */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                <LoanStatsDashboard />
              </div>
            </div>

            {/* Right Panel - Audit Log (no container) */}
            <div className="xl:col-span-1">
              <AuditLog />
            </div>
          </div>
        </div>
      </div>
    </Head>
  );
}
