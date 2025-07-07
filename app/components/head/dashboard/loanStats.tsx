'use client';

import { useEffect, useState } from 'react';

export default function LoanStatsDashboard() {
  const [loanStats, setLoanStats] = useState({
    typeStats: [],
    totalPrincipal: 0,
    totalInterest: 0,
    totalCollectables: 0,
    totalCollected: 0,
    totalUnpaid: 0,
    approved: 0,
    denied: 0,
    pending: 0,
    withCollateral: 0,
    withoutCollateral: 0,
    openTerm: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:3001/loans/loan-stats", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setLoanStats(data))
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  const StatBox = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: any;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <h4 className="text-xs font-medium text-slate-500">{label}</h4>
      <p className={`text-xl font-bold ${color} mt-1`}>
        {typeof value === 'number' ? `₱ ${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
  );

  const CountBox = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: any;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <h4 className="text-xs font-medium text-slate-500">{label}</h4>
      <p className={`text-xl font-bold ${color} mt-1`}>{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-10">
      
      {/* Loan Statistics */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Loan Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <StatBox label="Total Principal" value={loanStats.totalPrincipal ?? 0} color="text-emerald-600" />
          <StatBox label="Total Interest" value={loanStats.totalInterest ?? 0} color="text-purple-600" />
          <StatBox label="Total Collectables" value={loanStats.totalCollectables ?? 0} color="text-blue-600" />
        </div>
      </section>

      {/* Collection Statistics */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Collection Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <StatBox label="Total Collected" value={loanStats.totalCollected ?? 0} color="text-green-600" />
          <StatBox label="Total Unpaid" value={loanStats.totalUnpaid ?? 0} color="text-rose-600" />
        </div>
      </section>

      {/* Loan Application Stats */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Loan Application Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <CountBox label="Pending Applications" value={loanStats.pending ?? 0} color="text-amber-600" />
          <CountBox label="Approved Applications" value={loanStats.approved ?? 0} color="text-emerald-600" />
          <CountBox label="Denied Applications" value={loanStats.denied ?? 0} color="text-rose-600" />
        </div>
      </section>

      {/* Loan Type Stats */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Loan Type Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <CountBox label="Regular Loan With Collateral" value={loanStats.withCollateral ?? 0} color="text-amber-600" />
          <CountBox label="Regular Loan Without Collateral" value={loanStats.withoutCollateral ?? 0} color="text-emerald-600" />
          <CountBox label="Open-Term Loan" value={loanStats.openTerm ?? 0} color="text-rose-600" />
        </div>
      </section>
    </div>
  );
}
