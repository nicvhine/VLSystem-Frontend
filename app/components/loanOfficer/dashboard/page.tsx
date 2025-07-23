'use client';

import LoanStatsDashboard from "./loanStats";
import LoanOfficer from "../page";
import { useEffect, useState } from 'react';

export default function LoanOfficerDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('darkMode') === 'true';
  }
  return false;
});
  
  return (
    <LoanOfficer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-140px)]">
            {/* Left Panel - Loan Stats (Takes 2/3 width on xl screens) */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                <LoanStatsDashboard />
              </div>
            </div>

            {/* Right Panel - Audit Log (Takes 1/3 width on xl screens) */}
            <div className="xl:col-span-1">
            </div>
          </div>
        </div>
      </div>
      </div>
    </LoanOfficer>
  );
}