'use client';

import { Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  loanInfo: any;
  translations: any;
  language: 'en' | 'ceb';
}

export default function FinancialSummaryCards({ loanInfo, translations, language }: Props) {
  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  // Calculate next payment due date
  const getNextPaymentDate = () => {
    // This would ideally come from your collections/upcoming bills API
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return nextMonth.toLocaleDateString('en-PH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate available credit (this is a placeholder calculation)
  const getAvailableCredit = () => {
    const maxCredit = loanInfo.principal * 2; // Example: 2x principal as max credit
    const usedCredit = loanInfo.balance;
    return Math.max(0, maxCredit - usedCredit);
  };

  // Calculate payment streak (placeholder)
  const getPaymentStreak = () => {
    // This would come from your payment history analysis
    return 5; // Example: 5 consecutive on-time payments
  };

  const summaryCards = [
    {
      title: 'Next Payment Due',
      value: formatCurrency(loanInfo.monthlyDue || 0),
      subtitle: getNextPaymentDate(),
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      isUrgent: true
    },
    {
      title: 'Total Outstanding',
      value: formatCurrency(loanInfo.balance || 0),
      subtitle: `of ${formatCurrency(loanInfo.totalPayable || 0)}`,
      icon: DollarSign,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Available Credit',
      value: formatCurrency(getAvailableCredit()),
      subtitle: 'Pre-approved amount',
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Payment Streak',
      value: `${getPaymentStreak()} months`,
      subtitle: 'On-time payments',
      icon: AlertTriangle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <div 
            key={index}
            className={`${card.bgColor} rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <IconComponent size={20} />
              </div>
              {card.isUrgent && (
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                  Due Soon
                </span>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </h3>
              
              <p className={`text-xl font-bold ${card.textColor} mb-1`}>
                {card.value}
              </p>
              
              <p className="text-sm text-gray-500">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}