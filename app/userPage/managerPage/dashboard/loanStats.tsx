'use client';

import { useEffect, useState } from 'react';
import managerTranslations from '../components/translation';
import {
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiPieChart
} from 'react-icons/fi';

// Interfaces for API responses
interface LoanTypeStat {
  loanType: string;
  count: number;
}

interface LoanStats {
  typeStats: LoanTypeStat[];
  totalPrincipal: number;
  totalInterest: number;
}

interface CollectionStats {
  totalCollectables: number;
  totalCollected: number;
  totalUnpaid: number;
}

interface TypeStats {
  withCollateral: number;
  withoutCollateral: number;
  openTerm: number;
}

interface ApplicationStats {
  applied: number;
  approved: number;
  denied: number;
}

// Props for StatCard
interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isAmount?: boolean;
}

export default function LoanStatsDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('managerLanguage') as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  const [loanStats, setLoanStats] = useState<LoanStats>({
    typeStats: [],
    totalPrincipal: 0,
    totalInterest: 0,
  });

  const [collectionStats, setCollectionStats] = useState<CollectionStats>({
    totalCollectables: 0,
    totalCollected: 0,
    totalUnpaid: 0,
  });

  const [typeStats, setTypeStats] = useState<TypeStats>({
    withCollateral: 0,
    withoutCollateral: 0,
    openTerm: 0,
  });

  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applied: 0,
    approved: 0,
    denied: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const fetchStats = async () => {
      try {
        const urls = [
          "http://localhost:3001/loans/loan-type-stats",
          "http://localhost:3001/loans/loan-stats",
          "http://localhost:3001/collections/collection-stats",
          "http://localhost:3001/loan-applications/applicationStatus-stats"
        ];
  
        const responses = await Promise.all(
          urls.map((url) =>
            fetch(url, { headers: { Authorization: `Bearer ${token}` } })
          )
        );
  
        // Check for non-OK responses
        for (let i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
            const text = await responses[i].text();
            throw new Error(
              `Failed to fetch ${urls[i]}: ${responses[i].status} - ${text}`
            );
          }
        }
  
        // Parse JSON
        const typeData: LoanTypeStat[] = await responses[0].json();
        const loanData: Omit<LoanStats, "typeStats"> = await responses[1].json();
        const collectionData: CollectionStats = await responses[2].json();
        const appData: ApplicationStats = await responses[3].json();
  
        const withCollateral = typeData.find((t) => t.loanType === "Regular Loan With Collateral")?.count || 0;
        const withoutCollateral = typeData.find((t) => t.loanType === "Regular Loan Without Collateral")?.count || 0;
        const openTerm = typeData.find((t) => t.loanType === "Open-Term Loan")?.count || 0;
  
        setLoanStats({ typeStats: typeData, ...loanData });
        setCollectionStats({
          totalCollectables: collectionData.totalCollectables || 0,
          totalCollected: collectionData.totalCollected || 0,
          totalUnpaid: collectionData.totalUnpaid || 0,
        });
        setApplicationStats({
          applied: appData.applied || 0,
          approved: appData.approved || 0,
          denied: appData.denied || 0,
        });
        setTypeStats({ withCollateral, withoutCollateral, openTerm });
  
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch loan stats:", err);
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  

  // listen for global language changes
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.userType === 'manager') {
        setLanguage(e.detail.language);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChange', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('languageChange', handler);
      }
    };
  }, []);

  const t = managerTranslations[language];

  const StatCard = ({ label, value, color, icon: Icon, isAmount = false }: StatCardProps) => (
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
        <p className="text-gray-500 text-lg">{t.loading}</p>
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
          <h2 className="text-xl font-semibold text-gray-800">{t.financialOverview}</h2>
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
          <h2 className="text-xl font-semibold text-gray-800 ">{t.collectionStatus}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label={t.totalCollectables}
            value={collectionStats.totalCollectables ?? 0} 
            color="text-blue-600" 
            icon={FiPieChart}
            isAmount={true}
          />
          <StatCard 
            label={t.totalCollected}
            value={collectionStats.totalCollected ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
            isAmount={true}
          />
          <StatCard 
            label={t.totalUnpaid}
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
          <h2 className="text-xl font-semibold text-gray-800">{t.applicationStatus}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label={t.pendingApplications?.replace('Pending', 'Applied') || 'Applied'}
            value={applicationStats.applied ?? 0} 
            color="text-yellow-600" 
            icon={FiClock}
          />
          <StatCard 
            label={t.approvedApplications?.replace('Applications', '') || 'Approved'}
            value={applicationStats.approved ?? 0} 
            color="text-green-600" 
            icon={FiCheckCircle}
          />
          <StatCard 
            label={t.deniedApplications?.replace('Applications', '') || 'Denied'}
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
          <h2 className="text-xl font-semibold text-gray-800">{t.loanTypes}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label={t.withCollateral}
            value={typeStats.withCollateral ?? 0} 
            color="text-blue-600" 
            icon={FiUsers}
          />
          <StatCard 
            label={t.withoutCollateral}
            value={typeStats.withoutCollateral ?? 0} 
            color="text-green-600" 
            icon={FiUsers}
          />
          <StatCard 
            label={t.openTermLoans}
            value={typeStats.openTerm ?? 0} 
            color="text-red-600" 
            icon={FiUsers}
          />
        </div>
      </section>
    </div>
  );
}
