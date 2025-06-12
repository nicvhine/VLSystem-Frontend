"use client";

import React from "react";

interface Application {
  applicationId: string;
  appName: string;
  address?: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  paymentFrequency?: string;
  interestRate?: string;
  loanTerms?: number;
  loanAmount?: number;
}


const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number") return "₱0.00";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export default function LoanAgreement() {
  return (
    <div className="p-6 md:p-10 bg-white text-gray-900 max-w-6xl mx-auto shadow-xl rounded-xl mt-6 space-y-6">
      <h2 className="text-center text-xl font-bold mb-4">VISTULA LENDING</h2>
      <p className="text-center text-sm">BG Business Center, Cantecson, Gairan</p>
      <p className="text-center text-sm mb-6">Bogo City, Cebu</p>

      <h3 className="text-center text-lg font-semibold underline mb-6">LOAN AGREEMENT</h3>

      <p>This Loan Agreement is made and executed by and between:</p>

      <p>
        <strong>VISTULA LENDING CORPORATION</strong>, located at Gairan, Bogo City, Cebu,
        represented by <strong>DIVINA DAMAYO ALBURO</strong>, hereinafter the <strong>LENDER</strong>.
      </p>

      <p>AND</p>

      <p>
        <strong></strong>, of legal age, Filipino and resident of <strong></strong>,
        hereinafter the <strong>BORROWER</strong>.
      </p>

      <p className="font-semibold underline mb-3">WITNESSETH:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Loan Amount.</strong> The LENDER agrees to lend and the BORROWER agrees to borrow <strong></strong>.
        </li>
        <li>
          <strong>Interest Rate.</strong> interest on the principal amount.
        </li>
        <li>
          <strong>Repayment Terms.</strong> Repayment in <strong></strong> installment(s) of ₱3,300.00.
          First payment: <strong>May 13, 2025</strong>. Then every <strong></strong>.
        </li>
        <li>
          Default occurs if:
          <ul className="list-disc list-inside ml-4">
            <li>Payment is 3+ days late.</li>
            <li>Violation of material terms.</li>
          </ul>
        </li>
      </ol>

      <p>
        Default results in full balance due + 10% monthly surcharges until paid. Interest and penalties are honored before principal.
      </p>

      <p>IN WITNESS WHEREOF, parties set hands this _____ in Gairan, Bogo City, Cebu.</p>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-semibold">LENDER</p>
          <p>DIVINA DAMAYO ALBURO</p>
          <p className="mt-4">Type of ID: ____________________</p>
          <p>ID Number: ______________________</p>
          <p>Valid Until: ______________________</p>
        </div>
        <div>
          <p className="font-semibold">BORROWER</p>
          <p></p>
          <p className="mt-4">Type of ID: ____________________</p>
          <p>ID Number: ______________________</p>
          <p>Valid Until: ______________________</p>
        </div>
      </div>

      <div className="flex justify-between mt-6 text-sm">
        <p>Signed in the presence of: _________________________</p>
        <p>Signed in the presence of: _________________________</p>
      </div>

      <p className="font-semibold mt-6 underline">ACKNOWLEDGEMENT</p>
      <p className="text-sm">
        Before me, Notary Public in Bogo City, Cebu, this day of ____________, personally appeared the parties and acknowledged this as their free act and deed.
      </p>
      <p className="text-sm">WITNESS MY HAND AND SEAL on the date and place first written above.</p>

      <p className="text-sm mt-4">
        Doc. No. ______<br />
        Page No. ______<br />
        Book No. ______<br />
        Series of ______
      </p>

  
    </div>
  );
}
