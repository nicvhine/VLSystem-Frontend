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

  const fetchApplications = async () => {
  try {
    const response = await fetch(API_URL);
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
  };

  console.log("Updating application:", application?.applicationId);
  console.log("With fields:", updatedFields);

  try {
    const response = await fetch(`http://localhost:3001/loan-applications/${application?.applicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });

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
    const response = await fetch(`http://localhost:3001/loan-applications/${application?.applicationId}`, {
      method: "PUT", // or PATCH, depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Endorsed",
      }),
    });

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

const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());

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
                  <Icons.Edit size={20} />
                <button 
                  onClick={handlePrint}
                  className=" px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Icons.Print size={20} />   
              </button>
                </button>
                <button
                  onClick={handleSubmitAgreement}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Loan Agreement
                </button>

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
              <div className="bg-white text-gray-900 max-w-4xl mx-auto space-y-6">
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
                  <strong>
                    {currentData?.appName}
                  </strong>, of legal age, Filipino and resident of <strong>
                    {currentData?.appAddress}
                  </strong>,
                  hereinafter the <strong>BORROWER</strong>.
                </p>

                <p className="font-semibold underline mb-3">WITNESSETH:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Loan Amount.</strong> The LENDER agrees to lend and the BORROWER agrees to borrow <strong>
                      {isEditing ? (
                        <span>
                          ₱<input
                            type="number"
                            value={editData?.appLoanAmount}
                            onChange={(e) => handleInputChange('appLoanAmount', parseFloat(e.target.value) || 0)}
                            className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-24"
                          />
                        </span>
                      ) : formatCurrency(currentData?.appLoanAmount)}
                    </strong>.
                  </li>
                  <li>
                    <strong>Interest Rate.</strong> {isEditing ? (
                      <input
                        type="number"
                        value={editData?.appInterest}
                        onChange={(e) => handleInputChange('appInterest', parseFloat(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                      />
                    ) : currentData?.appInterest}% interest on the principal amount.
                  </li>
                  <li>
                    <strong>Repayment Terms.</strong> Repayment in <strong>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData?.appLoanTerms}
                          onChange={(e) => handleInputChange('appLoanTerms', parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                        />
                      ) : currentData?.appLoanTerms}
                    </strong> installment(s) of <strong>{isEditing ? (
                      <span>
                        ₱<input
                          type="number"
                          value={editData?.installmentAmount || 3300}
                          onChange={(e) => handleInputChange('installmentAmount', parseFloat(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-24"
                        />
                      </span>
                    ) : `₱${(currentData?.installmentAmount || 3300).toFixed(2)}`}.
                    </strong> First payment: <strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData?.firstPaymentDate || 'May 13, 2025'}
                          onChange={(e) => handleInputChange('firstPaymentDate', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                        />
                      ) : (currentData?.firstPaymentDate || 'May 13, 2025')}
                    </strong>. Then every <strong>
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
        
                      <span className=" w-64 text-sm mt-11 text-gray-700">
                        DIVINA DAMAYO ALBURO
                      </span>
                    </div>
                  </div>


                  </div>
                  <div>
                  <p className="font-semibold">BORROWER</p>
                  <p>{currentData?.appName ? capitalizeWords(currentData.appName) : ""}</p>
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
                    <span className="w-64 text-sm text-gray-700 pt-1">
                      {currentData?.appName}
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