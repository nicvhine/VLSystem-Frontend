'use client';
import React from 'react';
import { Collection } from '@/app/commonComponents/utils/Types/collection';
import { Loan } from '@/app/commonComponents/utils/Types/loan';
import { handlePay } from '../function';

interface UpcomingCollectionCardProps {
  collection: Collection;
  activeLoan: Loan;
  canPay: boolean;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpcomingCollectionCard({
  collection,
  activeLoan,
  canPay,
  setErrorMsg,
  setShowErrorModal,
}: UpcomingCollectionCardProps) {
  return (
    <div
      onClick={() => canPay && handlePay(collection, activeLoan, setErrorMsg, setShowErrorModal)}
      className={`transition-all duration-200 rounded-xl shadow-md p-4 md:p-5 flex flex-col gap-3
        ${canPay ? 'bg-white hover:bg-red-50 cursor-pointer' : 'bg-gray-100 cursor-not-allowed opacity-70'}`}
    >
      <div className="flex justify-between items-center">
        <p className={`font-semibold text-lg ${canPay ? 'text-gray-900' : 'text-gray-500'}`}>
          Collection #{collection.collectionNumber}
        </p>
        <span
          className={`px-2 py-1 text-sm font-medium rounded-full ${canPay ? 'text-red-600' : 'text-gray-500'}`}
        >
          {collection.status}
        </span>
      </div>

      <div className="flex justify-between items-center text-gray-700">
        <p className="text-sm">
          <span className="font-medium">Due:</span> {new Date(collection.dueDate).toLocaleDateString('en-PH')}
        </p>
        <p className="font-semibold text-lg">₱{collection.periodAmount.toLocaleString()}</p>
      </div>
    </div>
  );
}
