'use client';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface MonthlyStats {
  month: string;
  approved: number;
  denied: number;
  pending: number;
  onHold: number;
}

export default function LoanStatsChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/loan-applications/monthly-loan-stats')
      .then(res => res.json())
      .then(data => {
        setMonthlyData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load monthly stats:", err);
        setLoading(false);
      });
  }, []);

  const labels = monthlyData.map(d => d.month);

  const data = {
    labels,
    datasets: [
      {
        label: 'Approved',
        data: monthlyData.map(d => d.approved),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Denied',
        data: monthlyData.map(d => d.denied),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Pending',
        data: monthlyData.map(d => d.pending),
        backgroundColor: 'rgba(250, 204, 21, 0.8)',
        borderColor: 'rgb(250, 204, 21)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'On Hold',
        data: monthlyData.map(d => d.onHold),
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgb(251, 146, 60)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 25,
          font: {
            size: 14,
            weight: 600,
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 15,
        titleFont: {
          size: 16,
          weight: 700,
        },
        bodyFont: {
          size: 14,
          weight: 500,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 14,
            weight: 600,
          },
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: {
            size: 14,
            weight: 600,
          },
          padding: 12,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart' as const,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-lg text-slate-500 font-semibold">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-slate-300 rounded-sm"></div>
          </div>
          <p className="text-lg text-slate-500 font-semibold">No data available</p>
          <p className="text-base text-slate-400 mt-2">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}