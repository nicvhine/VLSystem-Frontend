'use client';

import React, { useMemo } from 'react';
import { formatDate } from '@/app/commonComponents/utils/formatters';
import { LoanDetailsCardProps } from '@/app/commonComponents/utils/Types/components';
import translations from '@/app/commonComponents/translation';

export default function LoanDetailsCard({ activeLoan, language }: LoanDetailsCardProps) {
  if (!activeLoan) return null;

  // Compute translations reactively
  const t = translations.loanTermsTranslator[language];

  const formatCurrency = (value?: number | string) =>
    `₱${Number(value ?? 0).toLocaleString()}`;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col gap-4 md:gap-6 relative overflow-hidden">
      <h2 className="font-semibold text-lg md:text-xl text-gray-800 mb-2 md:mb-4 flex items-center gap-2 z-10">
        {t.loans || 'Loan'} {t.details || 'Details'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-700 z-10">
        <div className="flex flex-col gap-2 md:gap-4 md:pr-4 md:border-r md:border-gray-200">
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l11 || 'Loan ID'}</span>
            <span className="ml-auto font-semibold text-gray-800">{activeLoan.loanId}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l10 || 'Loan Type'}</span>
            <span className="ml-auto font-semibold text-gray-800 break-words max-w-[160px] md:max-w-none">{activeLoan.loanType}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l13 || 'Date Disbursed'}</span>
            <span className="ml-auto font-semibold text-gray-800">{activeLoan.dateDisbursed ? formatDate(activeLoan.dateDisbursed) : '-'}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l5 || 'Interest Rate'}</span>
            <span className="ml-auto font-semibold text-gray-800">{activeLoan.appInterestRate ?? 0}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4 md:pl-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l4 || 'Principal'}</span>
            <span className="ml-auto font-bold text-gray-800 text-base md:text-lg">{formatCurrency(activeLoan.appLoanAmount)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l6 || 'Interest Amount'}</span>
            <span className="ml-auto font-semibold text-gray-800">{formatCurrency(activeLoan.appInterestAmount)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l7 || 'Total Interest'}</span>
            <span className="ml-auto font-semibold text-gray-800">{formatCurrency(activeLoan.appTotalInterestAmount)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l8 || 'Total Payable'}</span>
            <span className="ml-auto font-bold text-gray-800 text-base md:text-lg">{formatCurrency(activeLoan.appTotalPayable)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-500">{t.l9 || 'Monthly Due'}</span>
            <span className="ml-auto font-bold text-gray-800 text-base md:text-lg">{formatCurrency(activeLoan.appMonthlyDue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
