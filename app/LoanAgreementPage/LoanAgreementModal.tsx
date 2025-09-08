"use client";

import { FiPrinter, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

interface Application {
  applicationId: string;
  appName: string;
  appAddress?: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  dateDisbursed: Date;
  totalPayable: number;
}

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const formatCurrency = (amount?: number) =>
  amount && !isNaN(amount)
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : "₱0.00";

const capitalizeWords = (str?: string) => str?.toUpperCase() || "";

function addMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setDate(1);
  d.setMonth(targetMonth);
  const originalDay = date.getDate();
  const lastDayOfTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  return d;
}

export default function AgreementModal({ isOpen, onClose, application }: AgreementModalProps) {
  if (!isOpen || !application) return null;

  const handlePrint = () => setTimeout(() => window.print(), 100);

  const modalContent = (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
     <style jsx global>{`
    @media print {
      body * {
        visibility: hidden !important;
      }
      #printSection,
      #printSection * {
        visibility: visible !important;
      }
      #printSection {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 15mm !important;
        box-shadow: none !important;
        border: none !important;
        font-size: 9pt !important;
        background: white !important;
      }
      #printSection h2,
      #printSection h3,
      #printSection p,
      #printSection ol,
      #printSection ul {
        page-break-inside: avoid;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: legal portrait;
        margin: 10mm;
      }
    }
  `}</style>

    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col print:w-[216mm] print:h-[356mm] print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b no-print">
          <h2 className="text-xl font-semibold text-gray-600">Loan Agreement</h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-6 print:bg-white print:overflow-visible">
      <div
        id="printSection"
        className="bg-white shadow-2xl border border-gray-300 w-[216mm] min-h-[356mm] p-[25mm] text-justify leading-relaxed text-[8pt] text-gray-900 print:shadow-none print:border-none"
      >
            <div className=" text-[9pt]">
              <h2 className="text-center text-lg font-bold">VISTULA LENDING CORPORATION</h2>
              <p className="text-center">BG Business Center, Cantecson, Gairan</p>
              <p className="text-center mb-6">Bogo City, Cebu</p>

              <h3 className="text-center text-l font-semibold mb-6">LOAN AGREEMENT</h3>

              <p>This Loan Agreement is made and executed by and between:</p>

              <p>
                <strong>VISTULA LENDING CORPORATION</strong>, a business establishment with office
                address at Gairan, Bogo City, Cebu, represented in this instance by its owner, <strong>DIVINA DAMAYO ALBURO</strong>, of legal age, Filipino and a resident of Don Pedro, Bogo City, Cebu, 
                hereinafter known as the <strong>LENDER</strong>.
              </p>

              <p>AND</p>

              <p>
                <strong>{capitalizeWords(application.appName)}</strong>, of legal age, Filipino,
                and a resident of {application.appAddress}, hereinafter known as the <strong>BORROWER</strong>.
              </p>

              <p className="text-center text-l font-semibold mb-6">WITNESSETH</p>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Loan Amount.</strong> The <strong>LENDER</strong> agrees to lend and the <strong>BORROWER</strong> 
                  {""} agrees to borrow the sum of {formatCurrency(application.appLoanAmount)}.
                </li>
                <li>
                  <strong>Interest Rate.</strong> The loan shall accrue interest at a rate of {application.appInterest}% per
                  month, calculated based on the principal amount.
                </li>
                <li>
                  <strong>Repayment Terms.</strong> The Borrower shall repay the loan according to the
                  following terms:
                  <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>
                    <strong>Repayment Schedule:</strong> Loan shall be paid in {application.appLoanTerms} equal monthly installments in
                    the uniform amount of {application.totalPayable && application.appLoanTerms
                        ? formatCurrency(application.totalPayable / application.appLoanTerms)
                        : "₱0.00"}. The first payment of interest with principal shall be on {(() => {

                            if (application?.dateDisbursed) {
                              const disburseDate = new Date(application.dateDisbursed);
                              const firstPaymentDate = new Date(disburseDate);
                              firstPaymentDate.setMonth(disburseDate.getMonth() + 1);
                
                              return firstPaymentDate.toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                            }     
                            return "Not yet set";
                          })()} and the remaining amount will be due every {(() => {
                            if (application?.dateDisbursed) {
                            const disburseDate = new Date(application.dateDisbursed);
                            const dueDay = disburseDate.getDate();
                            return `${dueDay}${
                                ["th", "st", "nd", "rd"][
                                (dueDay % 10 < 4 && ![11, 12, 13].includes(dueDay % 100))
                                    ? dueDay % 10
                                    : 0
                                ]
                            }`;
                            }
                            return "same day";
                        })()}{" "}
                        of the succeeding months.
                        </li>
                    </ul>
                </li>

                <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                <strong>Final Payment Date:</strong> The loan should be paid in full on or before{" "}
                {application?.dateDisbursed && application?.appLoanTerms
                    ? (() => {
                        const disburseDate = new Date(application.dateDisbursed);
                        const terms = Number(application.appLoanTerms); 
                        const finalPaymentDate = addMonthsSafe(disburseDate, terms);

                        return finalPaymentDate.toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        });
                    })()
                    : "Not yet set"}
                .
                </li>
                </ul>


                <li>
                    <strong>Default</strong>. The <strong>BORROWER</strong> shall be in Default if any of the following events occur:
                    <ul className="list-disc list-inside ml-6">
                      <li>Failure to make any payment under this agreement within 3 months after it is due.</li>
                      <li>Breach of any material term of this agreement.</li>
                    </ul>
                    <ul className="ml-6">
                      <li>In case of Default, the toal unpaid balance shall become due and demandable plus additional 10% monthly surcharges until fully paid.</li>
                      <li>The periodic payment shall be applied first to the accumulated and unpaid penalty fees before applied to unpaid balance.</li>
                    </ul>
                  </li>

                  <p>
                    IN WITNESS WHEREOF, the parties have set their hands this{" "}
                    <strong>{application?.dateDisbursed
                      ? new Date(application.dateDisbursed).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not yet set"}{" "}</strong>
                    in Gairan, Bogo City, Cebu.
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-5">
                  <div className="flex flex-col space-y-6">
                {/* Lender Name */}
                <div className="flex items-center space-x-4">
                    <p className="font-semibold w-32">LENDER</p>
                    <p className="flex-1">DIVINA DAMAYO ALBURO</p>
                </div>

                {/* Lender ID Fields */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-4">
                    <p className="w-32">Type of ID</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                    <div className="flex items-center space-x-4">
                    <p className="w-32">ID Number</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                    <div className="flex items-center space-x-4">
                    <p className="w-32">Valid until</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                </div>

                {/* Signed in the presence of */}
                <div className="flex flex-col space-y-2 mt-3">
                    <p>Signed in the presence of:</p>
                    <p className="mt-5 text-gray-700">DIVINA DAMAYO ALBURO</p>
                </div>
                </div>

                <div className="flex flex-col space-y-6">
                {/* Lender Name */}
                <div className="flex items-center space-x-4">
                    <p className="font-semibold w-32">LENDER</p>
                    <p className="flex-1">{capitalizeWords(application.appName)}</p>
                </div>

                {/* Lender ID Fields */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-4">
                    <p className="w-32">Type of ID</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                    <div className="flex items-center space-x-4">
                    <p className="w-32">ID Number</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                    <div className="flex items-center space-x-4">
                    <p className="w-32">Valid until</p>
                    <span className="flex-1 border-b border-gray-700"></span>
                    </div>
                </div>

                {/* Signed in the presence of */}
                <div className="flex flex-col space-y-2 mt-3">
                    <p className="mt-11 text-gray-700">{capitalizeWords(application.appName)}</p>
                </div>
                </div>
                    </div>

                <p className="text-center text-l font-semibold mb-6 mt-10 ">ACKNOWLEDGEMENT</p>
                <p>
                  Before me, Notary Public in Bogo City, Cebu, this day of {application?.dateDisbursed
                      ? new Date(application.dateDisbursed).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not yet set"}{" "}, personally appeared the parties and acknowledged this as their free act and deed.
                </p>
                <p>WITNESS MY HAND AND SEAL on the date and place first written above.</p>

                <p className=" mt-4">
                  Doc. No. ______<br />
                  Page No. ______<br />
                  Book No. ______<br />
                  Series of ______
                </p>

              </ol>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
