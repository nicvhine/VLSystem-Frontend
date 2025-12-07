'use client';

import { formatCurrency } from "../../utils/formatters";
import ConfirmModal from "../../modals/confirmModal";
import { PaymentModalProps } from "../../utils/Types/collection";

export default function PaymentModal({
  isOpen,
  isAnimating,
  selectedCollection,
  paymentAmount,
  setPaymentAmount,
  showPaymentConfirm,
  setShowPaymentConfirm,
  handleClose,
  handleConfirmPayment,
  paymentLoading
}: PaymentModalProps) {
  if (!isOpen || !selectedCollection) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-black">
          Make Payment for {selectedCollection.name}
        </h2>
        <p className="text-sm text-black mb-2">
          Due Date: {new Date(selectedCollection.dueDate).toDateString()}
        </p>
        <p className="text-sm text-black mb-4">
          Period Amount: {formatCurrency(selectedCollection.periodAmount)}
        </p>
        <label className="block text-sm text-black mb-1">Enter Amount</label>
        <input
          type="text"
          className="w-full border border-gray-300 px-3 py-2 rounded mb-4 text-black"
          value={paymentAmount}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers and decimal point
            if (/^\d*\.?\d*$/.test(value) || value === '') {
              const num = parseFloat(value) || 0;
              // Prevent negative numbers and amounts exceeding loan balance
              if (num >= 0 && num <= selectedCollection.loanBalance) {
                setPaymentAmount(num);
              } else if (num > selectedCollection.loanBalance) {
                // Set to max loan balance if exceeded
                setPaymentAmount(selectedCollection.loanBalance);
              }
            }
          }}
        />
        <p className="text-xs text-gray-600 mb-4">
          Loan Balance: ₱{selectedCollection.loanBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={() => setShowPaymentConfirm(true)}
            disabled={paymentLoading}
          >
            Confirm
          </button>

          {/* Nested Confirm Modal */}
          {showPaymentConfirm && (
            <ConfirmModal
              show={showPaymentConfirm}
              message={`Are you sure you want to process this payment for ${selectedCollection?.name}?`}
              onConfirm={handleConfirmPayment}
              onCancel={() => setShowPaymentConfirm(false)}
              loading={paymentLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
