'use client';

import LoanStatsDashboard from "./loanStats";
import LoanOfficer from "../page";
import { useState } from 'react';

export default function LoanOfficerDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  return (
    <LoanOfficer>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white px-6">
          {/* You can add a title or navbar here */}
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 min-h-[calc(100vh-140px)]">
            {/* Loan Stats Panel */}
              <LoanStatsDashboard />
            </div>
        </div>
      </div>
    </LoanOfficer>
  );
}
