'use client';

import React from "react";

interface UploadSectionProps {
  language: 'en' | 'ceb';
  photo2x2: File[];
  documents: File[];
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeProfile: (index: number) => void;
  removeDocument: (index: number) => void;
}

export default function UploadSection({
  language,
  photo2x2,
  documents,
  handleProfileChange,
  handleFileChange,
  removeProfile,
  removeDocument
}: UploadSectionProps) {

  return (
    <div>
      {/* 2x2 Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === 'en' ? '2x2 Photo Upload' : 'I-upload ang 2x2 nga Litrato'}
        </h4>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleProfileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0 file:text-sm file:font-medium
                      file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
          />
        </div>

        {photo2x2.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {photo2x2.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="2x2 Preview"
                  className="w-24 h-24 object-cover rounded border shadow-sm mb-2"
                />
                <p className="text-sm text-gray-600">{file.name}</p>
                <button
                  onClick={() => removeProfile(index)}
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
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0 file:text-sm file:font-medium
                      file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
          />
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
                  onClick={() => removeDocument(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  {language === 'en' ? 'Remove' : 'Tangtangon'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
