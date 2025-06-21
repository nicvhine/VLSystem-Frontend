'use client';
import { useEffect, useState } from 'react';
import LoanStatsChart from './loanStatsChart';
import Navbar from '../navbar';

interface LoanTypeStat {
  loanType: string;
  count: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    approved: 0,
    denied: 0,
    pending: 0,
    onHold: 0,
  });

  const [typeStats, setTypeStats] = useState<LoanTypeStat[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/loan-applications/loan-stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/loan-applications/loan-type-stats")
      .then(res => res.json())
      .then(data => setTypeStats(data))
      .catch(err => console.error("Failed to load loan type stats:", err));
  }, []);

  const statConfig = [
    {
      number: stats.approved,
      label: "Approved Applications",
      bgGradient: "from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-100",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      number: stats.denied,
      label: "Denied Applications",
      bgGradient: "from-rose-500 to-rose-600",
      iconColor: "text-rose-100",
      shadowColor: "shadow-rose-500/20",
    },
    {
      number: stats.pending,
      label: "Pending Applications",
      bgGradient: "from-amber-500 to-amber-600",
      iconColor: "text-amber-100",
      shadowColor: "shadow-amber-500/20",
    },
    {
      number: stats.onHold,
      label: "On Hold Applications",
      bgGradient: "from-orange-500 to-orange-600",
      iconColor: "text-orange-100",
      shadowColor: "shadow-orange-500/20",
    }
  ];

  const totalApplications = stats.approved + stats.denied + stats.pending + stats.onHold;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 px-6 py-4 overflow-auto">
        <div className="w-full h-full flex flex-col">
          
          {/* Header Section - More compact */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
            <p className="text-slate-600">Monitor your loan applications and track performance metrics</p>
          </div>

          {/* Status Stats Grid - Smaller size */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statConfig.map((stat, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgGradient} p-4 text-white shadow-lg ${stat.shadowColor} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold tracking-tight">{stat.number}</div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {totalApplications > 0 ? Math.round((stat.number / totalApplications) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-sm font-medium text-white/90 leading-relaxed">{stat.label}</div>
                </div>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl transition-all duration-300 group-hover:scale-150" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
              </div>
            ))}
          </div>

          {/* Main Content Grid - Smaller gaps */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            
            {/* Loan Type Stats - Wider */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Loan Types</h2>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3 flex-1">
                  {typeStats.map((type, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200/50 hover:border-slate-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {type.loanType}
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {type.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Section - Much wider */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Monthly Statistics</h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live Data</span>
                  </div>
                </div>
                <div className="flex-1 relative min-h-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent rounded-xl"></div>
                  <LoanStatsChart />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}