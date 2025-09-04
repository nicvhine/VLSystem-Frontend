"use client";

import React, { useState, useEffect } from "react";
import { FiSave, FiPrinter, FiEdit, FiArrowLeft} from 'react-icons/fi';
import LoanOfficerNavbar from "@/app/components/loanOfficer/loNavbar/page";
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


export default function SubmittedPage({ params }: { params: { id: string } }) {
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

const handleSubmitAgreement = async () => {
  try {
    const response = await authFetch(
      `http://localhost:3001/loan-applications/${application?.applicationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Endorsed" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    alert("Loan status changed to 'Endorsed'.");
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Something went wrong.");
  }
};




const currentData = isEditing ? editData : application;

const capitalizeWords = (str?: string) => str?.toUpperCase() || '';


  return (
    <div className="min-h-screen bg-gray-50">
      <LoanOfficerNavbar />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Loan Agreement Document */}
            <div id="printSection">
            <div className="p-8">
              <div className="bg-white text-gray-900 max-w-4xl mx-auto space-y-6">
                <h2 className="text-center text-xl font-bold mb-4">VISTULA LENDING</h2>
                <p className="text-center text-sm">BG Business Center, Cantecson, Gairan</p>
                <p className="text-center text-sm mb-6">Bogo City, Cebu</p>

                <h3 className="text-center text-lg font-semibold mb-6">LOAN AGREEMENT</h3>

                <p>This Loan Agreement is made and executed by and between:</p>

                <p>
                VISTULA LENDING CORPORATION, a business establishment with office address at Gairan, Bogo City, Cebu,
                  represented in this instance by its owner, DIVINA DAMAYO ALBURO, of legal age, Filipino and a resident of Don Pedro Rodriguez St., Bogo City, Cebu, hereinafter known as the LENDER.
                </p>

                <p>AND</p>

                <p>
                    {capitalizeWords(currentData?.appName)}
                  , of legal age, Filipino and resident of {currentData?.appAddress},
                  hereinafter the BORROWER.
                </p>

                <p className="font-semibold mb-3">WITNESSETH:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Loan Amount. The LENDER agrees to lend and the BORROWER agrees to borrow the sum of
                      ₱{isEditing ? (
                        <input
                        type="number"
                        value={editData?.appLoanAmount}
                        onChange={(e) => handleInputChange('appLoanAmount', parseFloat(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"/>
                      ) : currentData?.appLoanAmount}.
                  </li>
                  <li>
                    Interest Rate. The loan shall accrue interest at a rate of {isEditing ? (
                      <input
                        type="number"
                        value={editData?.appInterest}
                        onChange={(e) => handleInputChange('appInterest', parseFloat(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                      />
                    ) : currentData?.appInterest}%, calculated based on the principal amount.
                  </li>
                  <li>
                  Repayment Terms. The Borrower shall repay the loan according to the following terms: <br></br>
                  -Repayment Schedule: Loan shall be paid on {isEditing ? (
                        <input
                          type="number"
                          value={editData?.appLoanTerms}
                          onChange={(e) => handleInputChange('appLoanTerms', parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                        />
                      ) : currentData?.appLoanTerms} installment(s) in the uniform amount of {isEditing ? (
                      <span>
                        ₱<input
                          type="number"
                          value={editData?.installmentAmount || 3300}
                          onChange={(e) => handleInputChange('installmentAmount', parseFloat(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-24"
                        />
                      </span>
                    ) : `₱${(currentData?.installmentAmount || 3300).toFixed(2)}`}.
                    The first payment of interest with principal shall be on {isEditing ? (
                        <input
                          type="text"
                          value={editData?.firstPaymentDate || 'May 13, 2025'}
                          onChange={(e) => handleInputChange('firstPaymentDate', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                        />
                      ) : (currentData?.firstPaymentDate || 'May 13, 2025')} and the remaining amount will be due every after <strong>
                      {isEditing ? (
                        <select
                          value={editData?.paymentFrequency || 'Monthly'}
                          onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-weekly">Bi-weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                        </select>
                      ) : currentData?.paymentFrequency}
                    </strong>.
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
                    <div className="mt-10">
                  <span>Signed in the presence of:</span>
                    <div className="flex flex-col items-start mt-2">
                      <span className=" w-64 text-sm mt-7 text-gray-700">
                        DIVINA DAMAYO ALBURO
                      </span>
                    </div>
                  </div>

                  </div>
                  <div>
                  <p className="font-semibold">BORROWER</p>
                  <p>{capitalizeWords(currentData?.appName)}</p>
                  <p className="mt-4">Type of ID: ____________________</p>
                  <p>ID Number: ______________________</p>
                  <p>Valid Until: ______________________</p>
                  <div className="mt-10">
                  <span>Signed in the presence of:</span>
                  <div className="flex flex-col items-start mt-2">
                    {uploadedFiles.length > 0 && (
                      <img 
                        src={uploadedFiles[0].url} 
                        alt="Signature" 
                        className="h-12 object-contain" 
                        style={{ maxWidth: "290px" }}
                      />
                    )}
                    <span className="w-64 text-sm mt-7 text-gray-700 pt-1">
                      {capitalizeWords(currentData?.appName)}
                    </span>
                  </div>
                </div>
                </div>
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
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}