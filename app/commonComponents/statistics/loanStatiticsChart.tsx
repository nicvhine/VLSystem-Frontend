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
    useLoanStats(role as "loanOfficer" | "manager");

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
        // increase visual radius so pie renders larger inside the canvas
        radius: "100%",
        borderWidth: 0,
      },
    ],
  };

  // Provide fallback/mock bar data when real data is empty so charts are visible
  const financialSum = (loanStats.totalPrincipal ?? 0) + (loanStats.totalInterest ?? 0);
  const mockFinancialData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        label: "₱ Amount",
        data: [65000, 22000],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const financialDataToRender = financialSum > 0 ? financialChartData : mockFinancialData;

  const applicationSum = (applicationStats.applied ?? 0) + (applicationStats.approved ?? 0) + (applicationStats.denied ?? 0);
  const mockApplicationBar = {
    labels: ["Applied", "Approved", "Denied"],
    datasets: [
      {
        label: "Applications",
        data: [12, 8, 3],
        backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  const applicationBarData = applicationSum > 0 ? { labels: applicationChartData.labels, datasets: [{ label: "Applications", data: applicationChartData.datasets[0].data, backgroundColor: ["#facc15", "#22c55e", "#ef4444"] }] } : mockApplicationBar;

  // ---------------- LAYOUT (minimal containers, larger charts) ----------------
  return (
    <div className="grid grid-cols-1 gap-1">
      {/* Top row: two charts side-by-side with minimal titles */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50">
            <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FiDollarSign className="text-red-600" /> {t.h1}
            </div>
            <div className="w-full h-60 md:h-72">
              <Bar
                data={financialDataToRender}
                options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50">
            <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FiUsers className="text-red-600" /> {t.h3}
            </div>
            <div className="w-full h-60 md:h-72">
              <Bar
                data={applicationBarData}
                options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: big pie takes more space and scales */}
      <div className="w-full flex-1 flex flex-col">
  <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50 flex-1 flex flex-col mt-6">
          <div className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FiPieChart className="text-red-600" /> {t.h4}
          </div>
          <div className="w-full flex-1 flex justify-center items-center">
              <div className="w-3/5 h-72 md:w-2/3 md:h-88">
              <Pie
                data={loanTypeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  aspectRatio: 1,
                  layout: { padding: 0 },
                  plugins: { legend: { position: "top" } },
                  elements: { arc: { borderWidth: 0 } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
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
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="flex justify-center items-center w-full min-h-[260px]">
        {children}
      </div>
    </section>
  );
}
