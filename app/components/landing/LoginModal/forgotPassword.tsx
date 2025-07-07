'use client';

interface Props {
  forgotRole: 'borrower' | 'staff' | '';
  setForgotRole: (role: 'borrower' | 'staff' | '') => void;
  setShowForgotModal: (show: boolean) => void;
}

export default function ForgotPasswordModal({ forgotRole, setForgotRole, setShowForgotModal }: Props) {
  if (forgotRole === '') {
    return (
      <>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Select your role to proceed:</p>
        <div className="flex justify-around">
          <button
            onClick={() => setShowForgotModal(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Borrower
          </button>
          <button
            onClick={() => setForgotRole('staff')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Staff
          </button>
        </div>
      </>
    );
  }

  if (forgotRole === 'staff') {
    return (
      <>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Staff Assistance</h2>
        <p className="text-sm text-gray-600 text-center">
          Please contact your system administrator to retrieve your username or reset your password.
        </p>
      </>
    );
  }

  return null;
}
