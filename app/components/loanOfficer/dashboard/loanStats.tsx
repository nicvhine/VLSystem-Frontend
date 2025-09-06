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
    fetch("http://localhost:3001/loan-applications/loan-stats", {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Loan Stats API Response:", data); 
        setLoanStats(prev => ({
          ...prev,
          ...data, 
        }));
      })
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:3001/loan-applications/loan-type-stats", {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Loan Type Stats API Response:", data);

        // Map array into direct counts
        const withCollateral = data.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
        const withoutCollateral = data.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
        const openTerm = data.find(t => t.loanType === "Open-Term Loan")?.count || 0;

        setLoanStats(prev => ({
          ...prev,
          typeStats: data,
          withCollateral,
          withoutCollateral,
          openTerm,
        }));
      })
      .catch(err => console.error("Failed to load loan type stats:", err));
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
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-50')}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <h4 className="text-xs font-medium text-gray-500 mb-1">{label}</h4>
      <p className={`text-lg font-bold ${color}`}>
        {isAmount ? `₱${value?.toLocaleString?.() ?? 0}` : value?.toLocaleString?.() ?? 0}
      </p>
    </div>
  );
  
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Application Status */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <FiUsers className="text-yellow-600 w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Application Status
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            label="Pending" 
            value={loanStats.pending ?? 0} 
            color="text-yellow-600" 
            icon={FiClock}
          />
          <StatCard 
            label="Approved" 
            value={loanStats.approved ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
          />
          <StatCard 
            label="Denied" 
            value={loanStats.denied ?? 0} 
            color="text-red-600" 
            icon={FiXCircle}
          />
        </div>
      </section>

      {/* Loan Types */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FiPieChart className="text-blue-600 w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Loan Types
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            label="With" 
            value={loanStats.withCollateral ?? 0} 
            color="text-blue-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Without" 
            value={loanStats.withoutCollateral ?? 0} 
            color="text-green-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Open-Term" 
            value={loanStats.openTerm ?? 0} 
            color="text-red-600" 
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
  
  
}
