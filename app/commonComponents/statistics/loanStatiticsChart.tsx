'use client';

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
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
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { FiDollarSign, FiUsers, FiPieChart } from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function LoanStatisticsCharts() {
  const [role, setRole] = useState<"loanOfficer" | "manager">("loanOfficer");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role") as "loanOfficer" | "manager";
      setRole(storedRole || "loanOfficer");
    }
  }, []);

  const { loading, loanStats, collectionStats, typeStats, applicationStats } = useLoanStats(role);

  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); 
  const monthlyInterestData = loanStats.monthlyInterest?.filter((m) => m.year === selectedYear) || [];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const interestData = {
    labels: months,
    datasets: [
      {
        label: `Monthly Interest (${selectedYear})`,
        data: months.map((month, idx) => monthlyInterestData[idx]?.totalInterest || 0),
        backgroundColor: "#ef4444",
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

  const loanTypeChartData = {
    labels: ["With Collateral", "Without Collateral", "Open-Term"],
    datasets: [
      {
        data: [
          typeStats.withCollateral ?? 0,
          typeStats.withoutCollateral ?? 0,
          typeStats.openTerm ?? 0,
        ],
        backgroundColor: ["#3b82f6", "#16a34a", "#ef4444"],
        radius: "100%",
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto mt-6">
      {/* Top row: Monthly Interest + Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Interest */}
        <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FiDollarSign className="text-red-600" /> Monthly Interest
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="w-full h-60 md:h-72">
            <Bar
              data={interestData}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50">
          <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FiUsers className="text-red-600" /> Application Status
          </div>
          <div className="w-full h-60 md:h-72">
            <Bar
              data={{
                labels: ["Applied", "Approved", "Denied"],
                datasets: [
                  {
                    label: "Applications",
                    data: [
                      applicationStats.applied ?? 0,
                      applicationStats.approved ?? 0,
                      applicationStats.denied ?? 0,
                    ],
                    backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Bottom row: Loan Type Pie */}
      <div className="bg-gray-100/30 rounded-2xl p-4 shadow-sm border border-gray-200/50">
        <div className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-800">
          <FiPieChart className="text-red-600" /> Loan Types
        </div>
        <div className="w-full h-72 flex justify-center items-center">
          <div className="w-3/5 md:w-2/3 h-full">
            <Pie
              data={loanTypeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                plugins: { legend: { position: "top" } },
                elements: { arc: { borderWidth: 0 } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
