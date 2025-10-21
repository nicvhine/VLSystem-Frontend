'use client';

import { useEffect, useState } from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import { useLoanStats } from "@/app/commonComponents/statistics/hooks";
import translations from "@/app/commonComponents/translation";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiPieChart,
  FiClock,
} from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function LoanStatisticsCharts() {
  const [role, setRole] = useState("loanOfficer");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole || "loanOfficer");
    }
  }, []);

  const { loading, loanStats, collectionStats, typeStats, applicationStats, language } =
    useLoanStats(role);

  const t = translations.statisticTranslation[language];
  const l = translations.loanTermsTranslator[language];

  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );

  // ---------------- CHART DATA ----------------
  const financialChartData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        label: "₱ Amount",
        data: [loanStats.totalPrincipal ?? 0, loanStats.totalInterest ?? 0],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const collectionChartData = {
    labels: ["Collectables", "Collected", "Unpaid"],
    datasets: [
      {
        label: "₱ Amount",
        data: [
          collectionStats.totalCollectables ?? 0,
          collectionStats.totalCollected ?? 0,
          collectionStats.totalUnpaid ?? 0,
        ],
        backgroundColor: ["#3b82f6", "#16a34a", "#ef4444"],
      },
    ],
  };

  const applicationChartData = {
    labels: ["Applied", "Approved", "Denied"],
    datasets: [
      {
        data: [
          applicationStats.applied ?? 0,
          applicationStats.approved ?? 0,
          applicationStats.denied ?? 0,
        ],
        backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  const loanTypeChartData = {
    labels: [l.l1, l.l2, l.l3],
    datasets: [
      {
        data: [
          typeStats.withCollateral ?? 0,
          typeStats.withoutCollateral ?? 0,
          typeStats.openTerm ?? 0,
        ],
        backgroundColor: ["#3b82f6", "#16a34a", "#ef4444"],
      },
    ],
  };

  // ---------------- LAYOUT ----------------
  return (
    <div className="flex flex-col gap-8">
      {/* Manager/Head Only */}
      {(role === "manager" || role === "head") && (
        <>
          <ChartSection title={t.h1} icon={<FiDollarSign className="text-red-600" />}>
            <Pie data={financialChartData} />
          </ChartSection>

          <ChartSection title={t.h2} icon={<FiCheckCircle className="text-red-600" />}>
            <Bar
              data={collectionChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </ChartSection>
        </>
      )}

      {/* Application Status */}
      <ChartSection title={t.h3} icon={<FiUsers className="text-red-600" />}>
        <Doughnut data={applicationChartData} />
      </ChartSection>

      {/* Loan Types */}
      <ChartSection title={t.h4} icon={<FiPieChart className="text-red-600" />}>
        <Pie data={loanTypeChartData} />
      </ChartSection>
    </div>
  );
}

// ---------------- REUSABLE CHART SECTION ----------------
function ChartSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="flex justify-center items-center w-full min-h-[260px]">
        {children}
      </div>
    </section>
  );
}
