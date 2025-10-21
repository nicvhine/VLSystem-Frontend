'use client';

import React, { useState } from "react";
import ConfirmModal from "@/app/commonComponents/modals/confirmModal/ConfirmModal";

interface UploadSectionProps {
  language: 'en' | 'ceb';
  photo2x2: File[];
  documents: File[];
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeProfile: (index: number) => void;
  removeDocument: (index: number) => void;
  missingFields?: string[];
  requiredDocumentsCount?: number; // max allowed documents based on loan type
}

export default function UploadSection({
  language,
  photo2x2,
  documents,
  handleProfileChange,
  handleFileChange,
  removeProfile,
  removeDocument,
  missingFields = [],
  requiredDocumentsCount,
}: UploadSectionProps) {

  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<'profile' | 'document' | null>(null);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>("");

  // Wrapped remove handlers
  const handleRemoveProfile = (index: number) => {
    setRemoveIndex(index);
    setConfirmType('profile');
    setConfirmMessage(
      language === 'en'
        ? 'Are you sure you want to remove this photo?'
        : 'Sigurado ka nga gusto nimo tangtangon ang litrato?'
    );
    setShowConfirm(true);
  };
  const handleRemoveDocument = (index: number) => {
    setRemoveIndex(index);
    setConfirmType('document');
    setConfirmMessage(
      language === 'en'
        ? 'Are you sure you want to remove this document?'
        : 'Sigurado ka nga gusto nimo tangtangon ang dokumento?'
    );
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (removeIndex === null || !confirmType) return;
    if (confirmType === 'profile') {
      removeProfile(removeIndex);
    } else if (confirmType === 'document') {
      removeDocument(removeIndex);
    }
    // Close modal first, then clear state after animation
    setShowConfirm(false);
    setTimeout(() => {
      setRemoveIndex(null);
      setConfirmType(null);
    }, 300);
  };

  const handleCancelRemove = () => {
    // Close modal first, then clear state after animation
    setShowConfirm(false);
    setTimeout(() => {
      setRemoveIndex(null);
      setConfirmType(null);
    }, 300);
  };

  return (
    <div>
      {/* 2x2 Upload */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? '2x2 Photo Upload' : 'I-upload ang 2x2 nga Litrato'}
        </h4>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-red-300 transition-colors ${missingFields.includes('2x2 Photo') ? 'border-red-500' : 'border-gray-200'}`}> 
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            // Only one 2x2 photo allowed
            onChange={handleProfileChange}
            disabled={photo2x2.length > 0}
            className={`block w-full text-sm text-gray-600 cursor-pointer
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium
                      file:bg-red-50 file:text-red-600 hover:file:bg-red-100
                      ${photo2x2.length > 0 ? 'opacity-50 cursor-not-allowed file:bg-gray-100 file:text-gray-400 hover:file:bg-gray-100' : ''}`}
          />
        </div>

        {photo2x2.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {photo2x2.map((file, index) => (
              <div key={index} className="flex flex-col items-center w-full justify-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="2x2 Preview"
                  className="w-24 h-24 object-cover rounded border shadow-sm mb-2 mx-auto"
                />
                <p className="text-sm text-gray-600">{file.name}</p>
                <button
                  onClick={() => handleRemoveProfile(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
                  {language === 'en' ? 'Remove' : 'Tangtangon'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? 'Document Upload' : 'I-upload ang mga Dokumento'}
        </h4>
        <div className={`border-2 border-dashed rounded-lg p-6 hover:border-red-300 transition-colors ${missingFields.includes('Document Upload') ? 'border-red-500' : 'border-gray-200'}`}> 
          <div className="flex items-center gap-3 w-full">
            {/* Hidden input with custom trigger to control dynamic message */}
            <input
              id="documents-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={typeof requiredDocumentsCount === 'number' ? (documents.length >= requiredDocumentsCount) : false}
              className="sr-only"
            />
            <label
              htmlFor="documents-upload"
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
                ${typeof requiredDocumentsCount === 'number' && documents.length >= requiredDocumentsCount
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
            >
              Choose Files
            </label>
            <span className="text-sm text-gray-700">
              {documents.length === 0
                ? 'No file chosen'
                : `${documents.length} ${documents.length === 1 ? 'file' : 'files'}`}
            </span>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-2">
                  {file.type.includes("pdf") ? (
                    <span className="text-red-600 font-bold">PDF</span>
                  ) : file.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">FILE</span>
                  )}
                  <p className="text-sm text-gray-700">{file.name}</p>
                </div>
                <button
                  onClick={() => handleRemoveDocument(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  {language === 'en' ? 'Remove' : 'Tangtangon'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Remove (top-level so it always renders) */}
      <ConfirmModal
        show={showConfirm}
        message={confirmMessage}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}
