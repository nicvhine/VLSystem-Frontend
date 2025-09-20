'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  FileText, 
  History, 
  HelpCircle, 
  Calculator,
  Bell
} from 'lucide-react';

interface Props {
  translations: any;
  language: 'en' | 'ceb';
}

export default function QuickActions({ translations, language }: Props) {
  const router = useRouter();

  const actions = [
    {
      icon: CreditCard,
      title: 'Make Payment',
      description: 'Pay your bills quickly',
      href: '/userPage/borrowerPage/pages/upcoming-bills',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Apply for Loan',
      description: 'Submit a new loan application',
      href: '/userPage/borrowerPage/ApplicationPage',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      icon: History,
      title: 'Payment History',
      description: 'View your payment records',
      href: '#payment-history',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      onClick: () => {
        const element = document.getElementById('payment-history');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: Calculator,
      title: 'Loan Calculator',
      description: 'Calculate loan estimates',
      href: '#',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600',
      onClick: () => {
        // Could open a loan calculator modal
        console.log('Open loan calculator');
      }
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Check your alerts',
      href: '#',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-600',
      onClick: () => {
        console.log('Open notifications');
      }
    },
    {
      icon: HelpCircle,
      title: 'Support',
      description: 'Get help and support',
      href: '#',
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-gray-600',
      onClick: () => {
        console.log('Open support');
      }
    }
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href && action.href !== '#') {
      router.push(action.href);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          
          return (
            <div
              key={index}
              onClick={() => handleActionClick(action)}
              className="group cursor-pointer"
            >
              <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
                <div className={`p-3 rounded-full ${action.color} text-white mb-3 group-hover:shadow-lg transition-all duration-200`}>
                  <IconComponent size={24} />
                </div>
                
                <h3 className={`font-semibold text-sm ${action.textColor} mb-1 text-center`}>
                  {action.title}
                </h3>
                
                <p className="text-xs text-gray-500 text-center leading-tight">
                  {action.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}