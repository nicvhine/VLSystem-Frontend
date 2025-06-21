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

  useEffect(() => {
    fetch('http://localhost:3001/loan-applications/monthly-loan-stats')
      .then(res => res.json())
      .then(setMonthlyData)
      .catch(err => console.error("Failed to load monthly stats:", err));
  }, []);

  const labels = monthlyData.map(d => d.month);

  const data = {
    labels,
    datasets: [
      {
        label: 'Approved',
        data: monthlyData.map(d => d.approved),
        backgroundColor: '#22c55e',
      },
      {
        label: 'Denied',
        data: monthlyData.map(d => d.denied),
        backgroundColor: '#ef4444',
      },
      {
        label: 'Pending',
        data: monthlyData.map(d => d.pending),
        backgroundColor: '#facc15',
      },
      {
        label: 'On Hold',
        data: monthlyData.map(d => d.onHold),
        backgroundColor: '#fb923c',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Loan Applications Per Month',
        font: {
          size: 18
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar
  data={data}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Loan Applications Per Month',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  }}
/>

}
