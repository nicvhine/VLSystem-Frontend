'use client';

import { useEffect, useState } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiPieChart
} from 'react-icons/fi';

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

  const StatCard = ({
    label,
    value,
    color,
    icon: Icon,
    isAmount = false,
  }: {
    label: string;
    value: any;
    color: string;
    icon: any;
    isAmount?: boolean;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-50')} dark:${color.replace('text-', 'bg-').replace('-600', '-900')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</h4>
      <p className={`text-2xl font-bold ${color}`}>
        {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Application Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 dark:bg-red-900 rounded-lg">
            <FiUsers className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Application Status</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label="Pending Applications" 
            value={loanStats.pending ?? 0} 
            color="text-yellow-600" 
            icon={FiClock}
          />
          <StatCard 
            label="Approved Applications" 
            value={loanStats.approved ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
          />
          <StatCard 
            label="Denied Applications" 
            value={loanStats.denied ?? 0} 
            color="text-red-600" 
            icon={FiXCircle}
          />
        </div>
      </section>

      {/* Loan Types */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 dark:bg-red-900 rounded-lg">
            <FiPieChart className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loan Types</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="With Collateral" 
            value={loanStats.withCollateral ?? 0} 
            color="text-blue-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Without Collateral" 
            value={loanStats.withoutCollateral ?? 0} 
            color="text-green-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Open-Term Loans" 
            value={loanStats.openTerm ?? 0} 
            color="text-red-600" 
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
}