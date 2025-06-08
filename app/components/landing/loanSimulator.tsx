import React, { useState } from 'react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoanOptionWithCollateral {
  amountRange: { min: number; max: number };
  interest: number;
  months: number;
}

interface LoanOptionWithoutCollateral {
  amountRange: { min: number; max: number };
  interest: number;
  months: number;
}

interface OpenTermLoanOption {
  amountRange?: { min: number; max: number };
  amount?: number;
  interest: number;
}

type LoanOption = LoanOptionWithCollateral | LoanOptionWithoutCollateral | OpenTermLoanOption;

export default function SimulatorModal({ isOpen, onClose }: SimulatorModalProps) {
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState<string>('');
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

  if (!isOpen) return null;

  const withCollateralTable: LoanOptionWithCollateral[] = [
    { amountRange: { min: 20000, max: 49999 }, interest: 7, months: 8 },
    { amountRange: { min: 50000, max: 99999 }, interest: 5, months: 10 },
    { amountRange: { min: 100000, max: 199999 }, interest: 4, months: 18 },
    { amountRange: { min: 200000, max: 299999 }, interest: 3, months: 24 },
    { amountRange: { min: 300000, max: 499999 }, interest: 2, months: 36 },
    { amountRange: { min: 500000, max: 500000 }, interest: 1.5, months: 60 },
  ];

  const withoutCollateralTable: LoanOptionWithoutCollateral[] = [
    { amountRange: { min: 10000, max: 14999 }, interest: 10, months: 5 },
    { amountRange: { min: 15000, max: 15000 }, interest: 10, months: 6 },
    { amountRange: { min: 20000, max: 20000 }, interest: 10, months: 8 },
    { amountRange: { min: 30000, max: 30000 }, interest: 10, months: 10 },
  ];

  const openTermTable: OpenTermLoanOption[] = [
    { amountRange: { min: 50000, max: 99999 }, interest: 6 },
    { amountRange: { min: 100000, max: 199999 }, interest: 5 },
    { amountRange: { min: 200000, max: 499999 }, interest: 4 },
    { amount: 500000, interest: 3 },
  ];

  const getTableByStatus = (status: string): LoanOption[] => {
    switch (status) {
      case 'regularWith':
        return withCollateralTable;
      case 'regularWithout':
        return withoutCollateralTable;
      case 'openTerm':
        return openTermTable;
      default:
        return [];
    }
  };

  const getAmountPlaceholder = () => {
    switch (loanType) {
      case 'regularWith':
        return 'Enter amount (up to ₱500,000)';
      case 'regularWithout':
        return 'Enter amount (₱10,000 - ₱30,000)';
      case 'openTerm':
        return 'Enter amount (₱50,000 - ₱500,000)';
      default:
        return 'Select a loan type first';
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };

  const calculateLoan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanType || !amount || !paymentPeriod) {
      setResult(null);
      return;
    }

    const amt = Number(amount);

    const selectedTable = getTableByStatus(loanType);
    let loanOption: LoanOption | undefined;

    if (loanType === 'regularWithout') {
      loanOption = selectedTable.find(
        (opt) => {
          const option = opt as LoanOptionWithoutCollateral;
          return amt >= option.amountRange.min && amt <= option.amountRange.max;
        }
      );
    } else if (loanType === 'openTerm') {
      loanOption = selectedTable.find(
        (opt) => {
          const option = opt as OpenTermLoanOption;
          return option.amountRange 
            ? (amt >= option.amountRange.min && amt <= option.amountRange.max)
            : amt === option.amount;
        }
      );
    } else {
      loanOption = selectedTable.find(
        (opt) => {
          const option = opt as LoanOptionWithCollateral;
          return amt >= option.amountRange.min && amt <= option.amountRange.max;
        }
      );
    }

    if (!loanOption) {
      setResult(null);
      return;
    }

    const rate = loanOption.interest;
    const months = 'months' in loanOption ? loanOption.months : (loanType === 'openTerm' ? 12 : 0); // Default to 12 months for open-term

    const totalInterest = (amt * rate) / 100;
    const totalRepayment = amt + totalInterest;

    let calculatedPaymentPerPeriod = 0;
    if (paymentPeriod === 'monthly') {
      calculatedPaymentPerPeriod = totalRepayment / (loanType === 'openTerm' ? 12 : months);
    } else if (paymentPeriod === 'fifteenth') {
      calculatedPaymentPerPeriod = totalRepayment / 15;
    }

    setPaymentPerPeriod(calculatedPaymentPerPeriod);

    setResult({
      paymentPeriod: paymentPeriod === 'monthly' ? 'Monthly' : 'Fifteenth',
      principalAmount: `₱${Number(amt).toLocaleString()}`,
      interest: `₱${totalInterest.toLocaleString()}`,
      totalPayment: `₱${totalRepayment.toLocaleString()}`,
      loanTerm: loanType === 'openTerm' ? '12 months (1 year)' : `${months} month${months > 1 ? 's' : ''}`,
      paymentPerPeriod: `₱${calculatedPaymentPerPeriod.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    });
  };

  const renderTable = () => {
    let tableData: LoanOption[] = [];

    if (loanType === 'regularWith') {
      tableData = withCollateralTable;
    } else if (loanType === 'regularWithout') {
      tableData = withoutCollateralTable;
    } else if (loanType === 'openTerm') {
      tableData = openTermTable;
    }

    if (tableData.length === 0) return null;

    return (
      <div className="overflow-x-auto mt-4">
        <h3 className="font-semibold mb-2 text-gray-700">
          Available Loan Options ({loanType === 'regularWith'
            ? 'With Collateral'
            : loanType === 'regularWithout'
            ? 'Without Collateral'
            : 'Open-Term'}
          ):
        </h3>
        <table className="min-w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">Amount (₱)</th>
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">Interest Rate (%)</th>
              {loanType !== 'openTerm' && (
                <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">Term (Months)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="border-b px-4 py-3">
                  {item.amountRange
                    ? item.amountRange.min === item.amountRange.max
                      ? `₱${item.amountRange.min.toLocaleString()}`
                      : `₱${item.amountRange.min.toLocaleString()} - ₱${item.amountRange.max.toLocaleString()}`
                    : `₱${(item as OpenTermLoanOption).amount?.toLocaleString()}`}
                </td>
                <td className="border-b px-4 py-3">{item.interest}%</td>
                {loanType !== 'openTerm' && (
                  <td className="border-b px-4 py-3">{'months' in item ? item.months : '-'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Loan Simulation
        </h2>

        <form onSubmit={calculateLoan} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
              <select
                value={loanType}
                onChange={(e) => {
                  setLoanType(e.target.value);
                  setAmount('');
                  setResult(null);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="">Select loan type</option>
                <option value="regularWithout">Regular (Without Collateral)</option>
                <option value="regularWith">Regular (With Collateral)</option>
                <option value="openTerm">Open-Term</option>
              </select>
            </div>

            {renderTable()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={getAmountPlaceholder()}
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={!loanType}
                />
              </div>
              {!loanType && (
                <p className="mt-2 text-sm text-gray-500">Please select a loan type first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
              <select
                value={paymentPeriod}
                onChange={(e) => {
                  setPaymentPeriod(e.target.value);
                  setResult(null);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
            <div className="space-y-3 font-sans">
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
