'use client';
import { useEffect, useState } from 'react';
import LoanStatsChart from './loanStatsChart';
import Navbar from '../navbar';

export default function Dashboard() {
  const [stats, setStats] = useState({
    approved: 0,
    denied: 0,
    pending: 0,
    onHold: 0,
  });

  useEffect(() => {
    fetch("http://localhost:3001/loan-applications/loan-stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  const statConfig = [
    {
      number: stats.approved,
      label: "Approved Applications",
      bgGradient: "from-green-500 to-green-600",
    },
    {
      number: stats.denied,
      label: "Denied Applications",
      bgGradient: "from-red-500 to-red-600",
    },
    {
      number: stats.pending,
      label: "Pending Applications",
      bgGradient: "from-yellow-500 to-yellow-600",
    },
    {
      number: stats.onHold,
      label: "On Hold Applications",
      bgGradient: "from-orange-500 to-orange-600",
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statConfig.map((stat, index) => {
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgGradient} p-6 text-white shadow-lg transition-transform hover:scale-[1.02]`}
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-white/90">{stat.label}</div>
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl transform rotate-45" />
              </div>
            );
          })}
        </div>

  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
  <div className="text-lg font-semibold mb-4 text-gray-800">Loan Application Statistics</div>
  <div className="h-80">
  <LoanStatsChart
    approved={stats.approved}
    denied={stats.denied}
    pending={stats.pending}
    onHold={stats.onHold}
  />
  </div>
</div>


      </main>
    </div>
  );
}
