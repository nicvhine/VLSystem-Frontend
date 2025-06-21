import React, { useState, useEffect } from 'react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoanOptionWithCollateral {
  amount: number;
  interest: number;
  months: number;
}

interface LoanOptionWithoutCollateral {
  amount: number;
  months: number;
  interest: number;
}

interface OpenTermLoanOption {
  amount: number;
  interest: number;
}

type LoanOption = LoanOptionWithCollateral | LoanOptionWithoutCollateral | OpenTermLoanOption;

export default function SimulatorModal({ isOpen, onClose }: SimulatorModalProps) {
  const [loanType, setLoanType] = useState('');
  const [loanOptions, setLoanOptions] = useState<number[]>([]);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState('');
  const [result, setResult] = useState<{
    paymentPeriod: string;
    principalAmount: string;
    interest: string;
    totalPayment: string;
    loanTerm: string;
    paymentPerPeriod: string;
  } | null>(null);
  const [paymentPeriod, setPaymentPeriod] = useState('');
  const [paymentPerPeriod, setPaymentPerPeriod] = useState<number>(0);

  const withCollateralTable: LoanOptionWithCollateral[] = [
    { amount: 20000, months: 8, interest: 7 },
    { amount: 50000, months: 10, interest: 5 },
    { amount: 100000, months: 18, interest: 4 },
    { amount: 200000, months: 24, interest: 3 },
    { amount: 300000, months: 36, interest: 2 },
    { amount: 500000, months: 60, interest: 1.5 },
  ];

  const withoutCollateralTable: LoanOptionWithoutCollateral[] = [
    { amount: 10000, months: 5, interest: 10 },
    { amount: 15000, months: 6, interest: 10 },
    { amount: 20000, months: 8, interest: 10 },
    { amount: 30000, months: 10, interest: 10 },
  ];

  const openTermTable: OpenTermLoanOption[] = [
    { amount: 50000, interest: 6 },
    { amount: 100000, interest: 5 },
    { amount: 200000, interest: 4 },
    { amount: 500000, interest: 3 },
  ];

  useEffect(() => {
    if (loanType === 'regularWith') {
      setLoanOptions(withCollateralTable.map(opt => opt.amount));
    } else if (loanType === 'regularWithout') {
      setLoanOptions(withoutCollateralTable.map(opt => opt.amount));
    } else if (loanType === 'openTerm') {
       setLoanOptions(openTermTable.map(opt => opt.amount));
    } else {
      setLoanOptions([]);
    }

    setSelectedLoanAmount('');
    setResult(null);
  }, [loanType]);

  const calculateLoan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanType || !selectedLoanAmount || !paymentPeriod) {
      setResult(null);
      return;
    }

    const amt = Number(selectedLoanAmount);
    let loanOption: LoanOption | undefined;

    if (loanType === 'regularWithout') {
      loanOption = withoutCollateralTable.find(opt => opt.amount === amt);
    } else if (loanType === 'regularWith') {
      loanOption = withCollateralTable.find(opt => opt.amount === amt);
    } else if (loanType === 'openTerm') {
      loanOption = openTermTable.find(opt => opt.amount === amt);
    }

    if (!loanOption) {
      setResult(null);
      return;
    }

    const rate = loanOption.interest;
    const months = 'months' in loanOption ? loanOption.months : 1;

    const totalInterest = (amt * rate) / 100;
    const totalRepayment = amt + totalInterest;

    let calculatedPaymentPerPeriod = 0;
    if (paymentPeriod === 'monthly') {
      calculatedPaymentPerPeriod = totalRepayment / 12;
    } else if (paymentPeriod === 'fifteenth') {
      calculatedPaymentPerPeriod = totalRepayment / 15;
    }

    setPaymentPerPeriod(calculatedPaymentPerPeriod);

    setResult({
      paymentPeriod: paymentPeriod === 'monthly' ? 'Monthly (12 months per year)' : '15th of the Month',
      principalAmount: `₱${amt.toLocaleString()}`,
      interest: `₱${totalInterest.toLocaleString()}`,
      totalPayment: `₱${totalRepayment.toLocaleString()}`,
      loanTerm:
        loanType === 'openTerm'
          ? paymentPeriod === 'monthly'
            ? 'Monthly (12 months per year)'
            : '15th of the Month'
          : `${months} month${months > 1 ? 's' : ''}`,
      paymentPerPeriod: `₱${calculatedPaymentPerPeriod.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Loan Simulation</h2>

        <form onSubmit={calculateLoan} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select loan type</option>
                <option value="regularWithout">Regular (Without Collateral)</option>
                <option value="regularWith">Regular (With Collateral)</option>
                <option value="openTerm">Open-Term</option>
              </select>
            </div>

            {loanType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                  value={selectedLoanAmount}
                  onChange={(e) => setSelectedLoanAmount(e.target.value)}
                >
                  <option value="">Select amount</option>
                  {loanOptions.map((amt) => (
                    <option key={amt} value={amt}>
                      ₱{amt.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
              <select
                value={paymentPeriod}
                onChange={(e) => setPaymentPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select payment period</option>
                <option value="monthly">Monthly</option>
                <option value="fifteenth">15th of the Month</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 transition-all"
          >
            Calculate
          </button>
        </form>

        {result && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Loan Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Payment Period:</div>
                <div className="font-medium text-gray-900">{result.paymentPeriod}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Principal Amount:</div>
                <div className="font-medium text-gray-900">{result.principalAmount}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Interest:</div>
                <div className="font-medium text-gray-900">{result.interest}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Total Payment:</div>
                <div className="font-medium text-gray-900">{result.totalPayment}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Loan Term:</div>
                <div className="font-medium text-gray-900">{result.loanTerm}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Payment per {result.paymentPeriod}:</div>
                <div className="font-medium text-gray-900">{result.paymentPerPeriod}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
