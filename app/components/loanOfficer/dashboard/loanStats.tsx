'use client';

import { useEffect, useState } from 'react';

interface LoanTypeStat {
  loanType: string;
  count: number;
}

interface ApplicationStats {
  applied: number;
  pending: number;
  approved: number;
  denied: number;
}

interface TypeStats {
  withCollateral: number;
  withoutCollateral: number;
  openTerm: number;
}

export default function LoanStatsDashboard() {
  const [typeStats, setTypeStats] = useState<TypeStats>({
    withCollateral: 0,
    withoutCollateral: 0,
    openTerm: 0,
  });

  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applied: 0,
    pending: 0,
    approved: 0,
    denied: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStats = async () => {
      try {
        const [typeRes, appRes] = await Promise.all([
          fetch("http://localhost:3001/loan-applications/loan-type-stats", { headers: { Authorization: `Bearer ${token}` }}),
          fetch("http://localhost:3001/loan-applications/applicationStatus-stats", { headers: { Authorization: `Bearer ${token}` }})
        ]);

        const typeData: LoanTypeStat[] = await typeRes.json();
        const appData: ApplicationStats = await appRes.json();

        const withCollateral = typeData.find((t: LoanTypeStat) => t.loanType === "Regular Loan With Collateral")?.count || 0;
        const withoutCollateral = typeData.find((t: LoanTypeStat) => t.loanType === "Regular Loan Without Collateral")?.count || 0;
        const openTerm = typeData.find((t: LoanTypeStat) => t.loanType === "Open-Term Loan")?.count || 0;

        setTypeStats({ withCollateral, withoutCollateral, openTerm });
        setApplicationStats({
          applied: appData.applied || 0,
          pending: appData.pending || 0,
          approved: appData.approved || 0,
          denied: appData.denied || 0,
        });

      } catch (err) {
        console.error("Failed to fetch loan stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    label,
    value,
    isAmount = false,
  }: {
    label: string;
    value: number;
    isAmount?: boolean;
  }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex justify-between items-center">
      <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      <p className="text-base font-bold text-black">
        {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Application Status */}
      <section className="p-5 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Application Status</h2>
        <div className="flex flex-col gap-3">
          <StatCard label="Applied" value={applicationStats.applied} />
          <StatCard label="Pending" value={applicationStats.pending} />
          <StatCard label="Approved" value={applicationStats.approved} />
          <StatCard label="Denied" value={applicationStats.denied} />
        </div>
      </section>

      {/* Loan Types */}
      <section className="p-5 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Loan Types</h2>
        <div className="flex flex-col gap-3">
          <StatCard label="With Collateral" value={typeStats.withCollateral} />
          <StatCard label="Without Collateral" value={typeStats.withoutCollateral} />
          <StatCard label="Open-Term" value={typeStats.openTerm} />
        </div>
      </section>
    </div>
  );
}
