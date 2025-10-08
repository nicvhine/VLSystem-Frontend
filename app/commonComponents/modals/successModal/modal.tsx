import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-modalPop">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Success</h2>
          <p className="mb-6 text-gray-700">{message}</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
