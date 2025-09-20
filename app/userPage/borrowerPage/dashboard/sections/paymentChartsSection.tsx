'use client';

import { useState } from 'react';
import { 
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  payments: any[];
  loanInfo: any;
  translations: any;
  language: 'en' | 'ceb';
}

export default function PaymentChartsSection({ payments, loanInfo, translations, language }: Props) {
  const [activeChart, setActiveChart] = useState<'trend' | 'monthly'>('trend');

  // Generate payment trend data
  const generatePaymentTrendData = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-PH', { month: 'short' });
      last6Months.push({
        month: monthName,
        payments: Math.floor(Math.random() * 3000) + 1000 // Sample data
      });
    }

    return {
      labels: last6Months.map(m => m.month),
      datasets: [
        {
          label: 'Monthly Payments',
          data: last6Months.map(m => m.payments),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }
      ]
    };
  };

  // Generate monthly comparison data
  const generateMonthlyComparisonData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const dueAmounts = months.map(() => loanInfo?.monthlyDue || 2500);
    const paidAmounts = months.map(() => Math.floor(Math.random() * 1000) + 2000);

    return {
      labels: months,
      datasets: [
        {
          label: 'Amount Due',
          data: dueAmounts,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        },
        {
          label: 'Amount Paid',
          data: paidAmounts,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ₱${value.toLocaleString('en-PH')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value: any) {
            return '₱' + value.toLocaleString('en-PH');
          },
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const trendData = generatePaymentTrendData();
  const monthlyData = generateMonthlyComparisonData();

  return (
    <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Payment Analytics</h2>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveChart('trend')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeChart === 'trend'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Payment Trend
          </button>
          <button
            onClick={() => setActiveChart('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeChart === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly Comparison
          </button>
        </div>
      </div>

      <div className="flex-1 h-48 mb-4">
        {activeChart === 'trend' ? (
          <Line data={trendData} options={chartOptions} />
        ) : (
          <Bar data={monthlyData} options={chartOptions} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-600">
            ₱{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-PH')}
          </p>
          <p className="text-sm text-gray-600">Total Paid</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-600">
            {payments.length}
          </p>
          <p className="text-sm text-gray-600">Total Payments</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-lg font-bold text-purple-600">
            ₱{((payments.reduce((sum, p) => sum + (p.amount || 0), 0)) / Math.max(payments.length, 1)).toLocaleString('en-PH')}
          </p>
          <p className="text-sm text-gray-600">Average Payment</p>
        </div>
      </div>
    </div>
  );
}