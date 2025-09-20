'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

interface LoanDetails {
  loanId: string;
  name: string;
  interestRate: number;
  dateDisbursed: string;
  principal: number;
  startDate: string;
  endDate: string;
  monthlyDue: number;
  totalPayable: number;
  status: string;
  balance: number;
  paidAmount: number;
  creditScore: number;
  paymentHistory: any[];
  paymentProgress: number;
  releasedAmount: number;
}

interface Props {
  allLoans: LoanDetails[];
  currentLoan: LoanDetails;
  onLoanSwitch: (loanIndex: number) => void;
  translations: any;
  language: 'en' | 'ceb';
}

export default function LoanManagementSection({ 
  allLoans, 
  currentLoan, 
  onLoanSwitch, 
  translations, 
  language 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!allLoans || allLoans.length <= 1) {
    return null; // Don't show if only one or no loans
  }

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return TrendingUp;
      case 'completed':
        return CheckCircle;
      case 'overdue':
        return Clock;
      default:
        return CreditCard;
    }
  };

  const calculateProgress = (loan: LoanDetails) => {
    if (!loan.totalPayable || loan.totalPayable === 0) return 0;
    return Math.round(((loan.paidAmount || 0) / loan.totalPayable) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Loans ({allLoans.length})</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span className="text-sm font-medium">
            {isExpanded ? 'Show Less' : 'View All'}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Active Loan */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Current Active Loan</span>
            </div>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Loan ID</p>
              <p className="font-semibold text-gray-800">{currentLoan.loanId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Balance</p>
              <p className="font-semibold text-red-600">{formatCurrency(currentLoan.balance || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Monthly Due</p>
              <p className="font-semibold text-gray-800">{formatCurrency(currentLoan.monthlyDue || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(currentLoan)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-blue-600">{calculateProgress(currentLoan)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Loans */}
        {isExpanded && (
          <div className="space-y-3">
            {allLoans
              .filter(loan => loan.loanId !== currentLoan.loanId)
              .map((loan, index) => {
                const StatusIcon = getStatusIcon(loan.status);
                const progress = calculateProgress(loan);
                
                return (
                  <div
                    key={loan.loanId}
                    onClick={() => onLoanSwitch(allLoans.findIndex(l => l.loanId === loan.loanId))}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800">Loan {loan.loanId}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Principal</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(loan.principal || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Balance</p>
                        <p className="font-semibold text-red-600">{formatCurrency(loan.balance || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Start Date</p>
                        <p className="text-sm text-gray-700">
                          {new Date(loan.startDate).toLocaleDateString('en-PH', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-green-600">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{allLoans.length}</p>
              <p className="text-sm text-gray-600">Total Loans</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {allLoans.filter(loan => loan.status.toLowerCase() === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {formatCurrency(allLoans.reduce((sum, loan) => sum + (loan.balance || 0), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}