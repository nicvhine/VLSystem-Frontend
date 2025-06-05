import React, { useState } from 'react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulatorModal({ isOpen, onClose }: SimulatorModalProps) {
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [result, setResult] = useState<string>('');
  const [paymentPeriod, setPaymentPeriod] = useState('');
  const [paymentPerPeriod, setPaymentPerPeriod] = useState<number>(0); // Change to a number

  if (!isOpen) return null;

  const withCollateralTable = [
    { amountRange: { min: 20000, max: 49999 }, interest: 7, months: 8 },
    { amountRange: { min: 50000, max: 99999 }, interest: 5, months: 10 },
    { amountRange: { min: 100000, max: 199999 }, interest: 4, months: 18 },
    { amountRange: { min: 200000, max: 299999 }, interest: 3, months: 24 },
    { amountRange: { min: 300000, max: 499999 }, interest: 2, months: 36 },
    { amount: 500000, interest: 1.5, months: 60 },
  ];

  const withoutCollateralTable = [
    { amountRange: { min: 10000, max: 14999 }, interest: 10, months: 5 },
    { amountRange: { min: 15000, max: 15000 }, interest: 10, months: 6 },
    { amountRange: { min: 20000, max: 20000 }, interest: 10, months: 8 },
    { amountRange: { min: 30000, max: 30000 }, interest: 10, months: 10 },
  ];

  const openTermTable = [
    { amountRange: { min: 50000, max: 99999 }, interest: 6 },
    { amountRange: { min: 100000, max: 199999 }, interest: 5 },
    { amountRange: { min: 200000, max: 499999 }, interest: 4 },
    { amount: 500000, interest: 3 },
  ];

  const getTableByStatus = (status: string) => {
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

  const calculateLoan = (e: React.FormEvent) => {
  e.preventDefault();

  if (!loanType || !amount) {
    setResult('Please complete the form.');
    return;
  }

  const amt = Number(amount);

  const selectedTable = getTableByStatus(loanType);
  let loanOption;

  if (loanType === 'regularWithout') {
    loanOption = selectedTable.find(
      (opt) =>
        amt >= opt.amountRange.min && amt <= opt.amountRange.max
    );
  } else if (loanType === 'openTerm') {
    loanOption = selectedTable.find(
  (opt) =>
    (opt.amountRange && amt >= opt.amountRange.min && amt <= opt.amountRange.max) ||
    amt === opt.amount
    );
  } else {
    loanOption = selectedTable.find(
      (opt) =>
        amt >= opt.amountRange?.min && amt <= opt.amountRange?.max || amt === opt.amount
    );
  }

  if (!loanOption) {
    setResult('Invalid amount for selected loan type.');
    return;
  }

  const rate = loanOption.interest;
  const months = loanOption.months || 0;

  const totalInterest = (amt * rate) / 100;
  const totalRepayment = amt + totalInterest;

  if (paymentPeriod === 'monthly' && months > 0) {
    setPaymentPerPeriod(totalRepayment / months);
  } else if (paymentPeriod === 'fifteenth') {
    setPaymentPerPeriod(totalRepayment / 15);
  }

  setResult(`
    Payment Period: ${paymentPeriod === 'monthly' ? 'Monthly' : 'Fifteenth'}
    Principal Amount: ₱${amt.toFixed(2)}
    Interest: ₱${totalInterest.toFixed(2)}
    Total Payment: ₱${totalRepayment.toFixed(2)}
    Loan Term: ${months} month${months > 1 ? 's' : ''}
    Payment per ${paymentPeriod === 'monthly' ? 'Month' : 'Fifteenth'}: ₱${paymentPerPeriod.toFixed(2)}
  `);
};


  const renderTable = () => {
    let tableData: { amount: number; interest: number; months?: number; amountRange?: { min: number, max: number } }[] = [];

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
        <table className="min-w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Amount (₱)</th>
              <th className="border px-4 py-2">Interest Rate (%)</th>
              {loanType !== 'openTerm' && (
                <th className="border px-4 py-2">Term (Months)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {item.amountRange
                    ? `${item.amountRange.min} - ${item.amountRange.max}`
                    : item.amount.toLocaleString()}
                </td>
                <td className="border px-4 py-2">{item.interest}%</td>
                {loanType !== 'openTerm' && (
                  <td className="border px-4 py-2">{item.months}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 text-black z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg  w-full max-w-lg max-h-[80vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 text-xl hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Loan Simulation
        </h2>

        <form onSubmit={calculateLoan} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select loan type</option>
              <option value="regularWithout">Regular (Without Collateral)</option>
              <option value="regularWith">Regular (With Collateral)</option>
              <option value="openTerm">Open-Term</option>
            </select>
          </div>

          {renderTable()}

          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount (e.g. 50000)"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Period</label>
            <select
              value={paymentPeriod}
              onChange={(e) => setPaymentPeriod(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select payment period</option>
              <option value="monthly">Monthly</option>
              <option value="fifteenth">15th of the Month</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Calculate
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md border">
            <h3 className="font-semibold">Loan Details</h3>
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
