'use client';

import AuditLog from "./auditLog";
import LoanStatsDashboard from "./loanStats";
import Head from "../page";
export default function HeadDashboard() {
  return (
    <Head>
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-half">

        {/* Left Panel - Loan Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-y-auto">
          <LoanStatsDashboard />
        </div>

        {/* Right Panel - Audit Log */}
          <AuditLog />
        </div>
      </div>
    </Head>
  );
}
