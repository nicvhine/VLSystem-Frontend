'use client';

import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  DollarSign,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'payment' | 'loan_update' | 'notification' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  status?: 'success' | 'pending' | 'warning' | 'info';
}

interface Props {
  payments: any[];
  loanInfo: any;
  translations: any;
  language: 'en' | 'ceb';
}

export default function RecentActivityFeed({ payments, loanInfo, translations, language }: Props) {
  // Generate recent activities from payments and system data
  const generateActivities = (): Activity[] => {
    const activities: Activity[] = [];

    // Add recent payments
    if (payments && payments.length > 0) {
      const recentPayments = payments.slice(0, 3).map(payment => ({
        id: payment.referenceNumber,
        type: 'payment' as const,
        title: 'Payment Received',
        description: `Payment for loan ${payment.loanId}`,
        timestamp: new Date(payment.datePaid),
        amount: payment.amount,
        status: 'success' as const
      }));
      activities.push(...recentPayments);
    }

    // Add loan updates
    if (loanInfo) {
      activities.push({
        id: 'loan_disbursed',
        type: 'loan_update',
        title: 'Loan Disbursed',
        description: `Loan ${loanInfo.loanId} has been disbursed`,
        timestamp: new Date(loanInfo.dateDisbursed),
        amount: loanInfo.releasedAmount || loanInfo.principal,
        status: 'info'
      });
    }

    // Add sample notifications
    activities.push(
      {
        id: 'payment_reminder',
        type: 'notification',
        title: 'Payment Reminder',
        description: 'Your next payment is due in 5 days',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'warning'
      },
      {
        id: 'credit_score_update',
        type: 'system',
        title: 'Credit Score Updated',
        description: 'Your credit score has been recalculated',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        status: 'info'
      }
    );

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 6);
  };

  const activities = generateActivities();

  const getActivityIcon = (type: Activity['type'], status?: Activity['status']) => {
    switch (type) {
      case 'payment':
        return CreditCard;
      case 'loan_update':
        return DollarSign;
      case 'notification':
        return status === 'warning' ? AlertTriangle : Info;
      case 'system':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getActivityColor = (status?: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'info':
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity) => {
            const IconComponent = getActivityIcon(activity.type, activity.status);
            const colorClasses = getActivityColor(activity.status);

            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${colorClasses} flex-shrink-0`}>
                  <IconComponent size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-800 text-sm truncate">
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    {activity.description}
                  </p>

                  {activity.amount && (
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}