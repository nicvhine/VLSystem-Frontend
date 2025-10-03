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
import headTranslations from '../components/translation';

export default function LoanStatsDashboard() {
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("headLanguage") as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.userType === 'head') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const t = headTranslations[language];
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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-50')} `}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">{label}</h4>
      <p className={`text-2xl font-bold ${color}`}>
        {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiDollarSign className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 ">{t.financialOverview}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label={t.totalPrincipal} 
            value={loanStats.totalPrincipal ?? 0} 
            color="text-green-600" 
            icon={FiDollarSign}
            isAmount={true}
          />
          <StatCard 
            label={t.totalInterest} 
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
          <h2 className="text-xl font-semibold text-gray-800">{t.collectionStatus}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label={t.totalCollectables} 
            value={loanStats.totalCollectables ?? 0} 
            color="text-blue-600" 
            icon={FiPieChart}
            isAmount={true}
          />
          <StatCard 
            label={t.totalCollected} 
            value={loanStats.totalCollected ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
            isAmount={true}
          />
          <StatCard 
            label={t.totalUnpaid} 
            value={loanStats.totalUnpaid ?? 0} 
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
          <h2 className="text-xl font-semibold text-gray-800">{t.applicationStatus}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label={t.pendingApplications} 
            value={loanStats.pending ?? 0} 
            color="text-yellow-600" 
            icon={FiClock}
          />
          <StatCard 
            label={t.approvedApplications} 
            value={loanStats.approved ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
          />
          <StatCard 
            label={t.deniedApplications} 
            value={loanStats.denied ?? 0} 
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
          <h2 className="text-xl font-semibold text-gray-800">{t.loanTypes}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label={t.withCollateral} 
            value={loanStats.withCollateral ?? 0} 
            color="text-blue-600" 
            icon={FiUsers}
          />
          <StatCard 
            label={t.withoutCollateral} 
            value={loanStats.withoutCollateral ?? 0} 
            color="text-green-600" 
            icon={FiUsers}
          />
          <StatCard 
            label={t.openTermLoans} 
            value={loanStats.openTerm ?? 0} 
            color="text-red-600" 
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
}
