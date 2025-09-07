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
  const [loading, setLoading] = useState(true);

  const [loanStats, setLoanStats] = useState({
    typeStats: [],
    totalPrincipal: 0,
    totalInterest: 0,
  });

  const [collectionStats, setCollectionStats] = useState({
    totalCollectables: 0,
    totalCollected: 0,
    totalUnpaid: 0,
  })

  const [typeStats, setTypeStats] = useState({
    withCollateral: 0,
    withoutCollateral: 0,
    openTerm: 0,
  })

  const [applicationStats, setApplicationStats] = useState({
    applied: 0,
    approved: 0,
    denied: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const fetchStats = async () => {
      try {
        const [typeRes, loanRes, collectionRes, appRes] = await Promise.all([
          fetch("http://localhost:3001/loans/loan-type-stats", { headers: { Authorization: `Bearer ${token}` }}),
          fetch("http://localhost:3001/loans/loan-stats", { headers: { Authorization: `Bearer ${token}` }}),
          fetch("http://localhost:3001/collections/collection-stats", { headers: { Authorization: `Bearer ${token}` }}),
          fetch("http://localhost:3001/loan-applications/applicationStatus-stats", { headers: { Authorization: `Bearer ${token}` }})
        ]);
  
        const typeData = await typeRes.json();
        const loanData = await loanRes.json();
        const collectionData = await collectionRes.json();
        const appData = await appRes.json();
  
        const withCollateral = typeData.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
        const withoutCollateral = typeData.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
        const openTerm = typeData.find(t => t.loanType === "Open-Term Loan")?.count || 0;
  
        setLoanStats({
          typeStats: typeData,
          ...loanData
        });
  
        setCollectionStats({
          totalCollectables: collectionData.totalCollectables || 0,
          totalCollected: collectionData.totalCollected || 0,
          totalUnpaid: collectionData.totalUnpaid || 0
        });
  
        setApplicationStats({
          applied: appData.applied || 0,
          approved: appData.approved || 0,
          denied: appData.denied || 0
        });

        setTypeStats({
          withCollateral,
          withoutCollateral,
          openTerm,
        })
  
        setLoading(false); 
  
      } catch (err) {
        console.error("Failed to fetch loan stats:", err);
        setLoading(false); 
      }
    };
  
    fetchStats();
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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-50')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">{label}</h4>
      <p className={`text-2xl font-bold ${color}`}>
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
    <div className="space-y-8">
      {/* Financial Overview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiDollarSign className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Financial Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Total Principal" 
            value={loanStats.totalPrincipal ?? 0} 
            color="text-green-600" 
            icon={FiDollarSign}
            isAmount={true}
          />
          <StatCard 
            label="Total Interest" 
            value={loanStats.totalInterest ?? 0} 
            color="text-red-600" 
            icon={FiTrendingUp}
            isAmount={true}
          />
        </div>
      </section>

      {/* Collection Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiCheckCircle className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 ">Collection Status</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label="Total Collectables" 
            value={collectionStats.totalCollectables ?? 0} 
            color="text-blue-600" 
            icon={FiPieChart}
            isAmount={true}
          />
          <StatCard 
            label="Total Collected" 
            value={collectionStats.totalCollected ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
            isAmount={true}
          />
          <StatCard 
            label="Total Unpaid" 
            value={collectionStats.totalUnpaid ?? 0} 
            color="text-red-600" 
            icon={FiXCircle}
            isAmount={true}
          />
        </div>
      </section>

      {/* Application Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiUsers className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Application Status</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label="Applied" 
            value={applicationStats.applied ?? 0} 
            color="text-yellow-600" 
            icon={FiClock}
          />
          <StatCard 
            label="Approved" 
            value={applicationStats.approved ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
          />
          <StatCard 
            label="Denied" 
            value={applicationStats.denied ?? 0} 
            color="text-red-600" 
            icon={FiXCircle}
          />
        </div>
      </section>

      {/* Loan Types */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiPieChart className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loan Types</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="With Collateral" 
            value={typeStats.withCollateral ?? 0} 
            color="text-blue-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Without Collateral" 
            value={typeStats.withoutCollateral ?? 0} 
            color="text-green-600" 
            icon={FiUsers}
          />
          <StatCard 
            label="Open-Term Loans" 
            value={typeStats.openTerm ?? 0} 
            color="text-red-600" 
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
}
