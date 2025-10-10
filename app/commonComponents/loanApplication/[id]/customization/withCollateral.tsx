'use client';
import React from 'react';

interface Props {
  application: any;
  formatCurrency: (amount: number) => string;
}

export default function WithCollateral({ application, formatCurrency }: Props) {

  // Capitalize first letter of each word
  const capitalizeWords = (text?: string) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Collateral Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Collateral Type</p>
          <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.collateralType || '—')}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Collateral Description</p>
          <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.collateralDescription || '—')}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Ownership Status</p>
          <p className="text-base text-gray-800 mt-1">{capitalizeWords(application?.ownershipStatus || '—')}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Collateral Value</p>
          <p className="text-base text-gray-800 mt-1">{formatCurrency(application?.collateralValue || 0)}</p>
        </div>
      </div>
    </section>
  );
}
