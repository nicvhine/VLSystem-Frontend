'use client';
import React, { useState } from 'react';
import { Collection } from '@/app/commonComponents/utils/Types/collection';
import { Loan } from '@/app/commonComponents/utils/Types/loan';
import CustomAmountModal from '@/app/commonComponents/modals/payModal';

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
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => canPay && setShowModal(true)}
        className={`transition-all duration-300 rounded-2xl shadow-md p-5 flex flex-col gap-3 border cursor-pointer
          ${canPay ? 'bg-white hover:shadow-lg border-gray-200' : 'bg-gray-100 cursor-not-allowed opacity-70 border-gray-300'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className={`font-semibold text-lg ${canPay ? 'text-gray-900' : 'text-gray-500'}`}>
            Collection #{collection.collectionNumber}
          </p>
          <span
            className={`px-2 py-1 text-sm font-medium rounded-full ${
              canPay ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {collection.status}
          </span>
        </div>

        {/* Details */}
        <div className="flex justify-between items-center text-gray-700">
          <p className="text-sm">
            <span className="font-medium">Due:</span>{' '}
            {new Date(collection.dueDate).toLocaleDateString('en-PH')}
          </p>
          <p className="font-semibold text-lg">
            ₱{collection.periodBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CustomAmountModal
          collection={collection}
          activeLoan={activeLoan}
          setErrorMsg={setErrorMsg}
          setShowErrorModal={setShowErrorModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
