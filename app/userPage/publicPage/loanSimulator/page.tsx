import React, { useState, useEffect } from 'react';

// Loan simulator modal: quick what-if calculator (static tables)
interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ceb';
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

export default function SimulatorModal({ isOpen, onClose, language = 'en' }: SimulatorModalProps) {
  const [loanType, setLoanType] = useState('');
  const [loanOptions, setLoanOptions] = useState<number[]>([]);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Debug: log when props change
  useEffect(() => {
    console.log('SimulatorModal props:', { isOpen, showModal });
  }, [isOpen, showModal]);
  const [result, setResult] = useState<{
    paymentPeriod: string;
    principalAmount: string;
    interestRate: string;
    interest: string;
    totalPayment: string;
    loanTerm: string;
    paymentPerPeriod: string;
  } | null>(null);

  const paymentPeriod = 'monthly';

  // Animation timing on open/close
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      // Small delay to trigger animation after mount
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShowModal(false), 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
    setShowResult(false);
  }, [loanType]);

  const calculateLoan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanType || !selectedLoanAmount) {
      setResult(null);
      setShowResult(false);
      return;
    }

    // UI: reset animation state first
    setShowResult(false);

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
      setShowResult(false);
      return;
    }

    const rate = loanOption.interest;
    const months = 'months' in loanOption ? loanOption.months : 12;

    const totalInterest = (amt * rate) / 100;
    const totalRepayment = amt + totalInterest;
    const paymentPerPeriod = totalRepayment / months;

    setResult({
      paymentPeriod: paymentPeriod === 'monthly' ? 'Monthly (12 months per year)' : '15th of the Month',
      principalAmount: `₱${amt.toLocaleString()}`,
      interestRate: `${rate}%`,
      interest: `₱${totalInterest.toLocaleString()}`,
      totalPayment: `₱${totalRepayment.toLocaleString()}`,
      loanTerm: `${months} ${language === 'en' ? 'months' : 'ka bulan'}`,
      paymentPerPeriod: `₱${paymentPerPeriod.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    });

    // UI: trigger animation after setting result
    setTimeout(() => setShowResult(true), 10);
  };

  if (!showModal) return null;

  const resultLabels = {
    principalAmount: language === 'en' ? 'Principal Amount:' : 'Pangunang Kantidad:',
    interestRate: language === 'en' ? 'Interest Rate:' : 'Porsyento sa Interes:',
    interest: language === 'en' ? 'Interest:' : 'Interes:',
    totalPayment: language === 'en' ? 'Total Payment:' : 'Kinatibuk-ang Bayad:',
    loanTerm: language === 'en' ? 'Loan Term:' : 'Gidugayon sa Pahulam:',
    paymentPerPeriod: language === 'en' ? 'Payment Per Period:' : 'Bayad Matag Panahon:',
    paymentPeriod: language === 'en' ? 'Payment Period:' : 'Panahon sa Pagbayad:',
    monthly: language === 'en' ? 'Monthly (12 months per year)' : 'Matag Bulan (12 ka bulan sa tuig)',
    fifteenth: language === 'en' ? '15th of the Month' : 'Ika-15 sa Bulan',
    summary: language === 'en' ? 'Loan Summary' : 'Sumada sa Pahulam',
    explanation: language === 'en' 
      ? 'Computed as: Total Payment ÷ Loan Term'
      : 'Gikalkula isip: Kinatibuk-ang Bayad ÷ Gidugayon sa Pahulam'
  };

  return (
    <div className={`fixed inset-0 text-black z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {language === 'en' ? 'Loan Simulation' : 'Simulasyon sa Pahulam'}
        </h2>

        <form onSubmit={calculateLoan} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Loan Type' : 'Klase sa Pahulam'}</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
              >
                <option value="">{language === 'en' ? 'Select loan type' : 'Pilia ang klase sa pahulam'}</option>
                <option value="regularWithout">{language === 'en' ? 'Regular (Without Collateral)' : 'Regular (Walay Kolateral)'}</option>
                <option value="regularWith">{language === 'en' ? 'Regular (With Collateral)' : 'Regular (Naay Kolateral)'}</option>
                <option value="openTerm">{language === 'en' ? 'Open-Term' : 'Open-Term'}</option>
              </select>
            </div>

            {loanType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Loan Amount' : 'Kantidad sa Pahulam'}</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                  value={selectedLoanAmount}
                  onChange={(e) => setSelectedLoanAmount(e.target.value)}
                >
                  <option value="">{language === 'en' ? 'Select amount' : 'Pilia ang kantidad'}</option>
                  {loanOptions.map((amt) => (
                    <option key={amt} value={amt}>
                      ₱{amt.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            {language === 'en' ? 'Calculate' : 'Kalkulaha'}
          </button>
        </form>

        {result && (
          <div className={`mt-8 bg-gray-50 rounded-lg p-6 transform transition-all duration-500 ease-out ${showResult ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{resultLabels.summary}</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.principalAmount}</div>
                  <div>{result.principalAmount}</div>
                </div>
                <div className="mb-4">
                <div className="font-semibold">{resultLabels.interestRate}</div>
                <div>{result.interestRate}</div>
              </div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.interest}</div>
                  <div>{result.interest}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.totalPayment}</div>
                  <div>{result.totalPayment}</div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.loanTerm}</div>
                  <div>{result.loanTerm}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.paymentPerPeriod}</div>
                  <div>{result.paymentPerPeriod}
                    <span className="text-sm text-gray-500 block">
                      ({language === 'en' ? 'Divided over' : 'Gibahin ngadto sa'} {result.loanTerm})
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">{resultLabels.paymentPeriod}</div>
                  <div>{result.paymentPeriod}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 italic">
              {resultLabels.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
