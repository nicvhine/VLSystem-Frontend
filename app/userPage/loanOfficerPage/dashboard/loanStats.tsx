'use client';

import { useEffect, useState } from 'react';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiShield, FiDollarSign, FiCalendar } from 'react-icons/fi';
import translations from '@/app/commonComponents/Translation';

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
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.userType === 'loanOfficer') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const t = translations.statisticTranslation[language];
  const l = translations.loanTermsTranslator[language];

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
    icon: Icon,
    isAmount = false,
  }: {
    label: string;
    value: number;
    icon: any;
    isAmount?: boolean;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-red-600" />
          <h4 className="text-sm font-medium text-gray-600">{label}</h4>
        </div>
        <p className="text-xl font-semibold text-gray-900">
          {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
        </p>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Application Status */}
      <section className="bg-gray-50 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.applicationStatus}</h2>
        <div className="flex flex-col gap-3">
          <StatCard label={t.s1} value={applicationStats.applied} icon={FiFileText} />
          <StatCard label={t.s2} value={applicationStats.pending} icon={FiClock} />
          <StatCard label={t.s3} value={applicationStats.approved} icon={FiCheckCircle} />
          <StatCard label={t.s4} value={applicationStats.denied} icon={FiXCircle} />
        </div>
      </section>

      {/* Loan Types */}
      <section className="bg-gray-50 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.loanTypes}</h2>
        <div className="flex flex-col gap-3">
          <StatCard label={l.l1} value={typeStats.withCollateral} icon={FiShield} />
          <StatCard label={l.l2} value={typeStats.withoutCollateral} icon={FiDollarSign} />
          <StatCard label={l.l3} value={typeStats.openTerm} icon={FiCalendar} />
        </div>
      </section>
    </div>
  );
}
