'use client';

import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import translations from "../translation";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type LoanTypeStat = { loanType: string; count: number };
type ApplicationStatusStat = { applied: number; approved: number; denied: number };

export default function LoanStatisticsCharts() {
  const [loanTypeStats, setLoanTypeStats] = useState<LoanTypeStat[]>([]);
  const [applicationStatusStats, setApplicationStatusStats] = useState<ApplicationStatusStat>({ applied: 0, approved: 0, denied: 0 });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('language')) localStorage.setItem('language', 'en');
      return (localStorage.getItem('language') as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  const t = translations.statisticTranslation[language];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCharts = async () => {
      try {
        const [loanTypeRes, appStatusRes] = await Promise.all([
          fetch("http://localhost:3001/stat/loan-type-stats", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:3001/stat/applicationStatus-stats", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const loanTypeData = await loanTypeRes.json();
        const appStatusData = await appStatusRes.json();

        setLoanTypeStats(loanTypeData || []);
        setApplicationStatusStats(appStatusData || { applied: 0, approved: 0, denied: 0 });
      } catch (err) {
        console.error("Failed to fetch chart stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setLanguage(e.detail.language);
    };
    if (typeof window !== "undefined") window.addEventListener("languageChange", handler);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("languageChange", handler);
    };
  }, []);

  if (loading) return <p className="text-center py-8">{t.m4}</p>;

  const gradientColors = ['#22c55e','#16a34a','#4ade80','#86efac','#bbf7d0','#facc15','#f97316','#ef4444'];

  const loanTypeChartData = {
    labels: loanTypeStats.map(l => l.loanType || 'Unknown'),
    datasets: [
      { data: loanTypeStats.map(l => l.count), backgroundColor: gradientColors.slice(0, loanTypeStats.length), borderColor: '#fff', borderWidth: 2 }
    ]
  };

  const applicationStatusChartData = {
    labels: ['Applied','Approved','Denied'],
    datasets: [
      { data: [applicationStatusStats.applied, applicationStatusStats.approved, applicationStatusStats.denied], backgroundColor: ['#facc15','#22c55e','#ef4444'], borderColor: '#fff', borderWidth: 2 }
    ]
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 13, weight: '500' } } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percent}%)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '';
        }
      }
    },
    animation: { animateRotate: true, animateScale: true, duration: 1000 },
    hoverOffset: 12,
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
        <h3 className="mb-2 text-m font-semibold text-red-600">{t.h4}</h3>
        <div className="relative w-full h-[220px]">
          <Pie data={loanTypeChartData} options={pieOptions} />
        </div>
        <div className="text-gray-600 mt-2 font-medium">
          {t.c15}: {loanTypeStats.reduce((a, b) => a + b.count, 0)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
        <h3 className="mb-2 text-m font-semibold text-red-600">{t.h3}</h3>
        <div className="relative w-full h-[220px]">
          <Pie data={applicationStatusChartData} options={pieOptions} />
        </div>
        <div className="text-gray-600 mt-2 font-medium">
          {t.c16}: {applicationStatusStats.applied + applicationStatusStats.approved + applicationStatusStats.denied}
        </div>
      </div>
    </div>
  );
}
