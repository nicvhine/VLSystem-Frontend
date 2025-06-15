"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Navbar from "../navbar";

export default function ApplicationPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mockLoanId] = useState("VL-" + Math.floor(100000 + Math.random() * 900000));

  const router = useRouter(); 

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    router.push("/borrower"); 
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md  text-black rounded-md mt-3">
        <div className="text-center">
          <h2 className="text-xl font-bold">Vistula Lending</h2>
          <p className="text-gray-600">Application Form</p>
        </div>
        <div className="border p-2 rounded cursor-pointer my-4">
          <label className="cursor-pointer">
            📤 Upload Image
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Amount Applied:</label>
            <input type="text" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Name of Borrower:</label>
            <input type="text" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Contact Number:</label>
            <input type="text" className="w-full border p-2 rounded" />
          </div>
        </div>

        {/* Home Information */}
        <div className="mt-4">
          <label>Home Address:</label>
          <input type="text" className="w-full border p-2 rounded" />
          <div className="flex items-center gap-4 mt-2">
            <span>House:</span>
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" /> Rented
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" /> Owned
            </label>
          </div>
        </div>

        {/* Employment Details */}
        <div className="mt-4">
          <h3 className="font-semibold">Employment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Occupation/Position" className="border p-2 rounded" />
            <input type="text" placeholder="Company Name" className="border p-2 rounded" />
            <input type="text" placeholder="Monthly Income" className="border p-2 rounded" />
            <input type="text" placeholder="Length of Service" className="border p-2 rounded" />
          </div>
        </div>

        {/* Loan Details */}
        <div className="mt-4">
          <h3 className="font-semibold">Loan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Loan Purpose" className="border p-2 rounded" />
            <input type="text" placeholder="Proposed Collaterals" className="border p-2 rounded" />
          </div>

          <div className="mt-2">
            <label>Loan Terms:</label>
            <div className="flex gap-2 flex-wrap">
              {[5, 6, 8, 10, 12, 18, 24].map((term) => (
                <label key={term} className="flex items-center">
                  <input type="checkbox" className="mr-1" /> {term}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <label>Payment Schedule:</label>
            <div className="flex gap-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" /> Weekly
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" /> Fifteenth
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" /> Monthly
              </label>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-6 flex justify-between">
          <button className="border p-2 rounded bg-gray-200">
            Insert Image
          </button>
          <div>
            <label>Application Date:</label>
            <input type="date" className="border p-2 rounded ml-2" />
          </div>
          <div className="border p-2 rounded">
            Signature/Thumbprint
          </div>
        </div>

        {/* Sketch Area */}
        <div className="mt-6">
          <h3 className="font-semibold">Kindly indicate below the sketch and landmarks of your residence address.</h3>
          <div className="border p-10 mt-2"></div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Submit Application
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-center text-green-600 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-center text-gray-700 mb-2">
              Your application has been submitted.
            </p>
            <p className="text-center font-semibold text-black text-lg">
              Here’s your Loan ID:
              <br />
              <span className="text-red-600">{mockLoanId}</span>
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Please take note of it for tracking purposes.
            </p>
          </div>
        </div>
      )}
        </div>
    </>
  );

}