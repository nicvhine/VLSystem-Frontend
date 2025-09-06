"use client";

import React, { useState, useEffect } from "react";
import { FiSave, FiPrinter, FiEdit, FiArrowLeft} from 'react-icons/fi';
import LoanOfficerNavbar from "../../../app/components/loanOfficer/loNavbar/page";
const API_URL = "http://localhost:3001/loan-applications";
import Link from "next/link";
// Icons as Unicode symbols - no external dependencies
const Icons = {
  Upload: () => <span className="inline-block">📁</span>,
  FileText: () => <span className="inline-block">📄</span>,
  Eye: () => <span className="inline-block">👁️</span>,
  Download: () => <span className="inline-block">💾</span>,
  Trash2: () => <span className="inline-block">🗑️</span>,
  User: () => <span className="inline-block">👤</span>,
  DollarSign: () => <span className="inline-block">💰</span>,
  FileCheck: () => <span className="inline-block">📋</span>,
  ArrowLeft: () => <span className="inline-block">←</span>,
  Edit: FiEdit,
  Save: () => <span className="inline-block">💾</span>,
  Print: FiPrinter,
  X: () => <span className="inline-block">✖️</span>
};

interface Application {
  applicationId: string;
  appName: string;
  appAddress?: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  paymentFrequency?: string;
  interestRate?: string;
  loanTerms?: number;
  loanAmount?: number;
  installmentAmount?: number;
  firstPaymentDate?: string;
  dateDisbursed: Date;
  totalPayable: number;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url: string;
}

const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number") return "₱0.00";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};


export default function LoanAgreement({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in localStorage");
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  const fetchApplications = async () => {
    try {
      const response = await authFetch(API_URL);
      if (!response.ok) throw new Error("Unauthorized");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };
  

useEffect(() => {
  fetchApplications();
}, []);

  
  const application = applications.find(app => app.applicationId === params.id);
  
  const [editData, setEditData] = useState<Application | null>(null);
  
  useEffect(() => {
    const app = applications.find(app => app.applicationId === params.id);
    if (app) {
      setEditData(app);
    }
  }, [applications, params.id]);


  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toLocaleDateString(),
          url: URL.createObjectURL(file)
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

 const handleEdit = () => {
  if (!application) return; 
  setEditData(application);
  setIsEditing(true);
};


const handleSave = async () => {
  const updatedFields = {
    appInterest: editData?.appInterest,
    appLoanTerms: editData?.appLoanTerms,
    appLoanAmount: editData?.appLoanAmount,
  };

  try {
    const response = await authFetch(
      `http://localhost:3001/loan-applications/${application?.applicationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update the application");
    }

    console.log("Application updated successfully!");
    await fetchApplications();
    setIsEditing(false);
  } catch (error) {
    console.error("Error saving data to the server:", error);
  }
};


  const handleCancel = () => {
    if (!application) return; 
    setEditData(application);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Application, value: string | number) => {
  setEditData(prev => {
    if (!prev) return prev; 
    return {
      ...prev,
      [field]: value
    };
  });
};

const handlePrint = () => {
  const printContents = document.getElementById("printSection")?.innerHTML;
  if (!printContents) return;

  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

  window.location.reload(); 
};

const handleDisburse = async () => {
  try {
    const response = await authFetch(
      `http://localhost:3001/loan-applications/${application?.applicationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Disbursed" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    alert("Loan status changed to 'Disbursed'.");
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Something went wrong.");
  }
};

function addMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;

  // Move to the 1st of target month
  d.setDate(1);
  d.setMonth(targetMonth);

  // Restore the intended day or last valid day
  const originalDay = date.getDate();
  const lastDayOfTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, lastDayOfTargetMonth));

  return d;
}



const currentData = isEditing ? editData : application;

const capitalizeWords = (str?: string) => str?.toUpperCase() || '';

const formatCurrency = (amount?: number) => {
  if (!amount || isNaN(amount)) return "₱0.00";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};



  return (
    <div className="min-h-screen bg-gray-50">
      <LoanOfficerNavbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
          <Link
  href={`/components/loanOfficer/applications/${application?.applicationId || ""}`}
  className="inline-flex items-center text-black hover:text-gray-600 mb-2 transition-colors"
>
  <FiArrowLeft className="w-4 h-4 mr-2" />
  Back to Applications
</Link>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentData?.applicationId} - {currentData?.loanType}
              </h1>
            </div>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Icons.Save /> <span className="ml-2">Save Changes</span>
                </button>

                <button 
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Icons.X /> <span className="ml-2">Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleEdit}
                  className=" px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                <button 
                  onClick={handlePrint}
                  className=" px-4 py-2 rounded-md text-black text-sm font-medium flex items-center"
                >
                  <Icons.Print size={20} />   
              </button>
                </button>
                {application?.status === "Disbursed" ? (
  <button
    disabled
    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
    Disbursed
  </button>
) : (
  <button
    onClick={handleDisburse}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
    Disburse
  </button>
)}


              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Loan Agreement Document */}
            <div id="printSection">
            <div className="p-8">
              <div className="bg-white text-gray-900 max-w-5xl mx-auto space-y-6">
                <h2 className="text-center text-xl font-bold mb-4">VISTULA LENDING</h2>
                <p className="text-center text-sm">BG Business Center, Cantecson, Gairan</p>
                <p className="text-center text-sm mb-6">Bogo City, Cebu</p>

                <h3 className="text-center text-lg font-semibold mb-6">LOAN AGREEMENT</h3>

                <p>This Loan Agreement is made and executed by and between:</p>

                <p>
                  <strong>VISTULA LENDING CORPORATION</strong>, a business establishment with office address at Gairan, Bogo City, Cebu,
                  represented in this instance by its owner, <strong>DIVINA DAMAYO ALBURO</strong>, of legal age, Filipino and a resident of Don Pedro Rodriguez St., Bogo City, Cebu, hereinafter known as the <strong>LENDER</strong>.
                </p>

                <p>AND</p>

                <p>
                    <strong>{capitalizeWords(currentData?.appName)}</strong>, of legal age, Filipino and a resident of {currentData?.appAddress}, hereinafter known as the <strong>BORROWER</strong>.
                </p>

                <p className=" mb-3 font-semibold">WITNESSETH:</p>
                <div className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Loan Amount</strong>. The LENDER agrees to lend and the BORROWER agrees to borrow the sum of {formatCurrency(currentData?.appLoanAmount)}.
                  </li>
                  <li>
                  <strong>Interest Rate</strong>. The loan shall accrue interest at a rate of {currentData?.appInterest}% per month, calculated based on the principal amount.
                  </li>
                  <li>
  <strong>Repayment Terms</strong>. The Borrower shall repay the loan according to the following terms:
  <ul className="list-disc list-inside ml-6 space-y-1">
    <li>
      <strong>Repayment Schedule</strong>: 
      Loan shall be paid on {currentData?.appLoanTerms} equal monthly installment in the uniform amount of {currentData?.totalPayable && currentData?.appLoanTerms
  ? new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(currentData.totalPayable / currentData.appLoanTerms)
  : "₱0.00"}
. The first payment of interest with principal shall be on {(() => {

            if (currentData?.dateDisbursed) {
              const disburseDate = new Date(currentData.dateDisbursed);
              const firstPaymentDate = new Date(disburseDate);
              firstPaymentDate.setMonth(disburseDate.getMonth() + 1);

              return firstPaymentDate.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            }

            return "Not yet set";
          })()} and the remaining amount will be due every{" "}
          {(() => {
            if (currentData?.dateDisbursed) {
              const disburseDate = new Date(currentData.dateDisbursed);
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
  <strong>Final Payment Date</strong>: The loan should be paid in full or on before {" "}
  {(() => {
    if (currentData?.dateDisbursed && currentData?.appLoanTerms) {
      const disburseDate = new Date(currentData.dateDisbursed);
      const terms = parseInt(currentData.appLoanTerms as string, 10) || 0;

      const finalPaymentDate = addMonthsSafe(disburseDate, terms);

      return finalPaymentDate.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Not yet set";
  })()}.
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
                    <strong>{currentData?.dateDisbursed
                      ? new Date(currentData.dateDisbursed).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not yet set"}{" "}</strong>
                    in Gairan, Bogo City, Cebu.
                  </p>

                <div className="grid grid-cols-2 gap-6 text-sm mt-15">
                  <div>
                  <div className="flex items-center space-x-30">
                    <p className="font-semibold">LENDER</p>
                    <p>DIVINA DAMAYO ALBURO</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">Type of ID</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">ID Number</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">Valid until</p>
                  </div>
                  
                    <div className="mt-10">
                  <span>Signed in the presence of:</span>
                    <div className="flex flex-col items-start mt-2">
        
                      <span className=" w-64 text-sm mt-11 text-gray-700">
                        DIVINA DAMAYO ALBURO
                      </span>
                    </div>
                  </div>

                  </div>
                  <div>
                  <div className="flex items-center space-x-30">
                  <p className="font-semibold">BORROWER</p>
                  <p>{currentData?.appName ? capitalizeWords(currentData.appName) : ""}</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">Type of ID</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">ID Number</p>
                  </div>
                  <div className="flex items-center space-x-20">
                    <p className="mt-4">Valid until</p>
                  </div>
                  <div className="mt-10">
                  <div className="flex flex-col items-start mt-2">
                    {uploadedFiles.length > 0 && (
                      <img 
                        src={uploadedFiles[0].url} 
                        alt="Signature" 
                        className="h-12 object-contain" 
                        style={{ maxWidth: "290px" }}
                      />
                    )}
                    <div className="flex flex-col items-start mt-7">
                    <span className=" w-64 text-sm mt-11 text-gray-700">
                      {capitalizeWords(currentData?.appName)}
                    </span>
                  </div>
                  </div>
                </div>
                </div>
                </div>
                <p className="font-semibold mt-15">ACKNOWLEDGEMENT</p>
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
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    
    </div>
  );
}