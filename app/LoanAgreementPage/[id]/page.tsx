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
  ArrowLeft: () => <span className="inline-block">←</span>,
  Edit: () => <span className="inline-block">✏️</span>,
  Save: () => <span className="inline-block">💾</span>,
  X: () => <span className="inline-block">✖️</span>
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

export default function LoanAgreement() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sample data - replace with actual application data
  const [applicationData, setApplicationData] = useState<Application>({
    applicationId: "00001",
    appName: "Juan Dela Cruz",
    address: "123 Barangay Street",
    appLoanAmount: 50000,
    appInterest: 5,
    loanType: "Regular Loan Without Collateral",
    status: "Pending",
    appLoanTerms: 12,
    paymentFrequency: "Monthly",
    installmentAmount: 3300,
    firstPaymentDate: "May 13, 2025"
  });

  const [editData, setEditData] = useState<Application>(applicationData);

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
    setEditData(applicationData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setApplicationData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(applicationData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Application, value: string | number) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentData = isEditing ? editData : applicationData;

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
                {currentData.applicationId} - {currentData.loanType}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Icons.Edit /> <span className="ml-2">Edit Agreement</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Generate Loan Agreement
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Deny Application
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.appName}
                        onChange={(e) => handleInputChange('appName', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                      />
                    ) : currentData.appName}
                  </strong>, of legal age, Filipino and resident of <strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                      />
                    ) : currentData.address}
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
                            value={editData.appLoanAmount}
                            onChange={(e) => handleInputChange('appLoanAmount', parseFloat(e.target.value) || 0)}
                            className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-24"
                          />
                        </span>
                      ) : formatCurrency(currentData.appLoanAmount)}
                    </strong>.
                  </li>
                  <li>
                    <strong>Interest Rate.</strong> {isEditing ? (
                      <input
                        type="number"
                        value={editData.appInterest}
                        onChange={(e) => handleInputChange('appInterest', parseFloat(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                      />
                    ) : currentData.appInterest}% interest on the principal amount.
                  </li>
                  <li>
                    <strong>Repayment Terms.</strong> Repayment in <strong>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.appLoanTerms}
                          onChange={(e) => handleInputChange('appLoanTerms', parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-16"
                        />
                      ) : currentData.appLoanTerms}
                    </strong> installment(s) of {isEditing ? (
                      <span>
                        ₱<input
                          type="number"
                          value={editData.installmentAmount || 3300}
                          onChange={(e) => handleInputChange('installmentAmount', parseFloat(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50 w-24"
                        />
                      </span>
                    ) : `₱${(currentData.installmentAmount || 3300).toFixed(2)}`}.
                    First payment: <strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.firstPaymentDate || 'May 13, 2025'}
                          onChange={(e) => handleInputChange('firstPaymentDate', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                        />
                      ) : (currentData.firstPaymentDate || 'May 13, 2025')}
                    </strong>. Then every <strong>
                      {isEditing ? (
                        <select
                          value={editData.paymentFrequency || 'Monthly'}
                          onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 bg-yellow-50"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-weekly">Bi-weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                        </select>
                      ) : currentData.paymentFrequency}
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
                  </div>
                  <div>
                    <p className="font-semibold">BORROWER</p>
                    <p>{currentData.appName}</p>
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
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
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
        </div>
      </div>
    </div>
  );
}