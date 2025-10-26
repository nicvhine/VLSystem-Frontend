'use client';

import { useState, Dispatch, SetStateAction, useEffect } from "react";

type LoanOption = {
  amount: number;
  months?: number;
  interest: number;
};

interface LoanDetailsProps {
  language: "en" | "ceb";
  loanType: "with" | "without" | "open-term";
  appLoanPurpose: string;
  setAppLoanPurpose: (val: string) => void;
  onLoanSelect: (loan: { amount: number; months?: number; interest: number } | null) => void;
  missingFields?: string[];
  showFieldErrors?: boolean;
  previousBalance: number;
  balanceDecision: 'deduct' | 'addPrincipal';
  setBalanceDecision: Dispatch<SetStateAction<'deduct' | 'addPrincipal'>>;
  onAdjustedLoanChange?: (val: number) => void;
}

export default function LoanDetails({
  language,
  loanType,
  appLoanPurpose,
  setAppLoanPurpose,
  onLoanSelect,
  missingFields = [],
  showFieldErrors = false,
  previousBalance,
  balanceDecision,
  setBalanceDecision,
  onAdjustedLoanChange
}: LoanDetailsProps) {
  const [customLoanAmount, setCustomLoanAmount] = useState<number | "">("");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [adjustedLoanAmount, setAdjustedLoanAmount] = useState<number | "">("");

  // Loan options
  const withCollateralOptions: LoanOption[] = [
    { amount: 20000, months: 8, interest: 7 },
    { amount: 50000, months: 10, interest: 5 },
    { amount: 100000, months: 18, interest: 4 },
    { amount: 200000, months: 24, interest: 3 },
    { amount: 300000, months: 36, interest: 2 },
    { amount: 500000, months: 60, interest: 1.5 },
  ];

  const withoutCollateralOptions: LoanOption[] = [
    { amount: 10000, months: 5, interest: 10 },
    { amount: 15000, months: 6, interest: 10 },
    { amount: 20000, months: 8, interest: 10 },
    { amount: 30000, months: 10, interest: 10 },
  ];

  const openTermOptions: LoanOption[] = [
    { amount: 50000, interest: 6 },
    { amount: 100000, interest: 5 },
    { amount: 200000, interest: 4 },
    { amount: 500000, interest: 3 },
  ];

  const getLoanOptions = () => {
    switch (loanType) {
      case "with": return withCollateralOptions;
      case "without": return withoutCollateralOptions;
      case "open-term": return openTermOptions;
      default: return [];
    }
  };

  // Validate loan amount (uses adjustedLoanAmount if addPrincipal)
  const validateLoanAmount = (amount: number) => {
    const options = getLoanOptions();
    if (options.length === 0) {
      setSelectedLoan(null);
      onLoanSelect(null);
      setLoanAmountError("");
      return;
    }

    const validationAmount = balanceDecision === "addPrincipal" ? amount + previousBalance : amount;
    const minAmount = Math.min(...options.map((o) => o.amount));
    const maxAmount = Math.max(...options.map((o) => o.amount));

    if (validationAmount < minAmount) {
      setSelectedLoan(null);
      onLoanSelect(null);
      setLoanAmountError(
        language === "en"
          ? `Adjusted loan is below the minimum allowed (${new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(minAmount)}).`
          : `Nausab nga kantidad ubos sa minimum (${new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(minAmount)}).`
      );
      return;
    }

    if (validationAmount > maxAmount) {
      setSelectedLoan(null);
      onLoanSelect(null);
      setLoanAmountError(
        language === "en"
          ? `Adjusted loan exceeds the maximum allowed (${new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(maxAmount)}).`
          : `Nausab nga kantidad molapas sa maximum (${new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(maxAmount)}).`
      );
      return;
    }

    const match = options
      .filter((o) => o.amount <= validationAmount)
      .reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), options[0]);

    setLoanAmountError("");
    setSelectedLoan(match);
    onLoanSelect({ ...match, amount });
  };

  // Update adjusted loan whenever balance decision or customLoanAmount changes
  useEffect(() => {
    if (customLoanAmount !== "" && balanceDecision === "addPrincipal") {
      const adjusted = Number(customLoanAmount) + previousBalance;
      setAdjustedLoanAmount(adjusted);
      if (onAdjustedLoanChange) onAdjustedLoanChange(adjusted);
      validateLoanAmount(Number(customLoanAmount));
    } else {
      setAdjustedLoanAmount("");
      if (onAdjustedLoanChange) onAdjustedLoanChange(Number(customLoanAmount));
      if (customLoanAmount !== "") validateLoanAmount(Number(customLoanAmount));
    }
  }, [customLoanAmount, balanceDecision, previousBalance]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
        {language === "en" ? "Loan Details" : "Detalye sa Pahulam"}
      </h4>

      {/* Only show balance and radio options if borrower actually has a balance */}
      {previousBalance > 0 && (
        <>
          {/* Previous Balance */}
          <p className="mb-4 text-gray-700 font-medium">
            {language === "en"
              ? "You have an active balance of"
              : "Aduna kay aktibong balance nga"}{" "}
            {formatCurrency(previousBalance)}
          </p>

          {/* Balance Decision Radios */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="balanceDecision"
                value="deduct"
                checked={balanceDecision === 'deduct'}
                onChange={() => setBalanceDecision('deduct')}
                className="mt-1"
              />
              <div>
                <span className="font-medium text-gray-800">
                  {language === "en" ? "Deduct from Receivable" : "Ibawas sa Makadawat"}
                </span>
                <p className="text-sm text-gray-500">
                  {language === "en"
                    ? "Cash received will be reduced by this balance. Interest still calculated on full loan amount."
                    : "Ang cash nga madawat ibawas sa balance. Interest kay base gihapon sa full loan amount."}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="balanceDecision"
                value="addPrincipal"
                checked={balanceDecision === 'addPrincipal'}
                onChange={() => setBalanceDecision('addPrincipal')}
                className="mt-1"
              />
              <div>
                <span className="font-medium text-gray-800">
                  {language === "en" ? "Add to Principal" : "Idugang sa Principal"}
                </span>
                <p className="text-sm text-gray-500">
                  {language === "en"
                    ? "Balance will be added to loan principal. Full cash received, interest on total amount."
                    : "Ang balance idugang sa principal. Full cash madawat, interest base sa total amount."}
                </p>
              </div>
            </label>
          </div>
        </>
      )}

      {/* Loan Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loan Purpose */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en" ? "Loan Purpose:" : "Katuyoan sa Pahulam:"}
          </label>
          <input
            value={appLoanPurpose}
            onChange={(e) => setAppLoanPurpose(e.target.value)}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields?.includes('Loan Purpose')) ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={language === "en" ? "Enter Loan Purpose" : "Isulod ang Katuyoan sa Pahulam"}
          />
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en" ? "Loan Amount:" : "Kantidad sa Pahulam:"}
          </label>
          <input
            type="number"
            value={customLoanAmount}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
              setCustomLoanAmount(value);
              if (value !== "") validateLoanAmount(Number(value));
              else {
                setSelectedLoan(null);
                onLoanSelect(null);
                setLoanAmountError("");
              }
            }}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields?.includes('Loan Amount')) || loanAmountError || (selectedLoan === null && customLoanAmount !== "") ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={language === "en" ? "Enter loan amount" : "Isulod ang kantidad sa Pahulam"}
          />
          {loanAmountError && <p className="text-sm text-red-500 mt-1">{loanAmountError}</p>}
        </div>

        {/* Adjusted Loan Amount */}
        {previousBalance > 0 && balanceDecision === "addPrincipal" && customLoanAmount !== "" && (
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Adjusted Loan Amount:" : "Nausab nga Kantidad sa Pahulam:"}
            </label>
            <input
              type="number"
              value={adjustedLoanAmount}
              readOnly
              className={`w-full border p-3 rounded-lg ${loanAmountError ? 'border-red-500' : 'border-gray-200'} bg-gray-50`}
            />
          </div>
        )}

        {/* Loan Terms & Interest */}
        {loanType !== "open-term" && (
          <>
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                {language === "en" ? "Loan Terms (months):" : "Panahon sa Pahulam (buwan):"}
              </label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
                value={selectedLoan?.months || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                {language === "en" ? "Monthly Interest Rate (%):" : "Bulan nga Interest Rate (%):"}
              </label>
              <input
                className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
                value={selectedLoan?.interest || ""}
                readOnly
              />
            </div>
          </>
        )}
      </div>

      {/* Sample Calculation */}
      {customLoanAmount && selectedLoan && (
        <div className="mt-6 border-t pt-4 text-gray-300">
          <h5 className="text-md font-semibold mb-3 text-gray-700">
            {language === "en" ? "Sample Calculation" : "Halimbawang Kwenta"}
          </h5>

          {(() => {
            const baseLoan = Number(customLoanAmount);
            const adjustedLoan = balanceDecision === "addPrincipal" ? baseLoan + previousBalance : baseLoan;

            let serviceCharge = 0;
            if (adjustedLoan >= 10000 && adjustedLoan <= 20000) serviceCharge = adjustedLoan * 0.05;
            else if (adjustedLoan > 20000 && adjustedLoan <= 45000) serviceCharge = 1000;
            else if (adjustedLoan > 45000 && adjustedLoan <= 500000) serviceCharge = adjustedLoan * 0.03;

            const interestRate = Number(selectedLoan.interest) / 100;
            const months = selectedLoan.months || 12;
            const monthlyInterest = adjustedLoan * interestRate;
            const monthlyPayment = adjustedLoan / months + monthlyInterest;

            let netProceeds = adjustedLoan - serviceCharge;
            if (previousBalance > 0 && balanceDecision === "deduct") netProceeds -= previousBalance;

            return (
              <div className="space-y-2 text-black">
                <p>
                  <span className="font-medium">{language === "en" ? "Loan Amount:" : "Kantidad sa Pahulam:"}</span>{" "}
                  ₱{adjustedLoan.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">{language === "en" ? "Service Charge:" : "Serbisyo nga Bayad:"}</span>{" "}
                  {formatCurrency(serviceCharge)}
                </p>
                <p className="text-green-700 font-semibold">
                  <span>{language === "en" ? "Net Proceeds:" : "Netong Makadawat:"}</span>{" "}
                  {formatCurrency(netProceeds)}
                </p>
                {loanType !== "open-term" && (
                  <p>
                    <span className="font-medium">{language === "en" ? "Monthly Payment:" : "Bulan nga Bayad:"}</span>{" "}
                    {formatCurrency(monthlyPayment)}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
