"use client";

import React, { useState } from "react";
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
  ArrowLeft: () => <span className="inline-block">←</span>
};

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

export default function LoanAgreement() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Sample data - replace with actual application data
  const applicationData = {
    applicationId: "00001",
    appName: "Juan Dela Cruz",
    address: "123 Barangay Street",
    appLoanAmount: 50000,
    appInterest: 5,
    loanType: "Regular Loan Without Collateral",
    appLoanTerms: 12,
    paymentFrequency: "Monthly"
  };

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

  const addComment = () => {
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment.trim()]);
      setNewComment("");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Icons.ArrowLeft /> <span className="ml-2">Back to Applications</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {applicationData.applicationId} - {applicationData.loanType}
              </h1>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Generate Loan Agreement
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Deny Application
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Loan Agreement Document */}
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
                  <strong>{applicationData.appName}</strong>, of legal age, Filipino and resident of <strong>{applicationData.address}</strong>,
                  hereinafter the <strong>BORROWER</strong>.
                </p>

                <p className="font-semibold underline mb-3">WITNESSETH:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Loan Amount.</strong> The LENDER agrees to lend and the BORROWER agrees to borrow <strong>{formatCurrency(applicationData.appLoanAmount)}</strong>.
                  </li>
                  <li>
                    <strong>Interest Rate.</strong> {applicationData.appInterest}% interest on the principal amount.
                  </li>
                  <li>
                    <strong>Repayment Terms.</strong> Repayment in <strong>{applicationData.appLoanTerms}</strong> installment(s) of ₱3,300.00.
                    First payment: <strong>May 13, 2025</strong>. Then every <strong>{applicationData.paymentFrequency}</strong>.
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
                    <p>{applicationData.appName}</p>
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
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6">
          {/* Upload Documents Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Icons.FileText /> <span className="ml-2">Uploaded Documents</span>
              </h3>
            </div>
            <div className="p-4">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Icons.Upload />
                <p className="text-sm text-gray-600 mb-2 mt-2">
                  Drag and drop images here, or{' '}
                  <label className="text-blue-600 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="h-8 w-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Icons.Eye />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <Icons.Download />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600"
                          onClick={() => removeFile(file.id)}
                        >
                          <Icons.Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Comments / Notes</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3 mb-4">
                {comments.map((comment, index) => (
                  <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                    {comment}
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No comments yet</p>
                )}
              </div>
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}