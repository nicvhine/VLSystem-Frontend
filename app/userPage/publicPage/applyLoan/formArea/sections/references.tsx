"use client";

import { useState } from "react";

interface Reference {
  name: string;
  contact: string;
  relation: string;
}

interface ReferencesProps {
  language: "en" | "ceb";
  appReferences: Reference[];
  setAppReferences: React.Dispatch<React.SetStateAction<Reference[]>>;
  appContact: string;
  missingFields?: string[];
}

export default function References({
  language,
  appReferences,
  setAppReferences,
  appContact,
  missingFields = [],
}: ReferencesProps) {
  const [nameError, setNameError] = useState<string[]>(["", "", ""]);
  const [refErrors, setRefErrors] = useState<string[]>(["", "", ""]);

  // Handle reference field changes

  // Enhanced handleReferenceChange with validation
  const handleReferenceChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    const updated = [...appReferences];
    let valid = true;
    let errorMsg = "";

    if (field === "name") {
      // Only allow letters, ñ, hyphen, dot, and space
      if (!/^[A-Za-zñÑ.\- ]*$/.test(value)) {
        valid = false;
        errorMsg = language === "en" ? "Invalid name format." : "Sayop ang porma sa ngalan.";
      } else {
        // Check for duplicate names (case-insensitive, ignore self)
        const lowerValue = value.trim().toLowerCase();
        const isDuplicate = appReferences.some((ref, idx) => idx !== index && ref.name.trim().toLowerCase() === lowerValue && lowerValue !== "");
        if (isDuplicate) {
          valid = false;
          errorMsg = language === "en" ? "Duplicate name not allowed." : "Dili pwede ang parehas nga ngalan.";
        }
      }
      (updated[index][field] as string) = value;
      const newNameError = [...nameError];
      newNameError[index] = valid ? "" : errorMsg;
      setNameError(newNameError);
    } else if (field === "contact") {
      // Only allow digits, max 11, must start with 09
      if (!/^\d*$/.test(value) || value.length > 11) {
        valid = false;
        errorMsg = language === "en" ? "Contact must be up to 11 digits." : "Hangtud ra sa 11 ka numero.";
      } else if (value.length > 0 && !value.startsWith("09")) {
        valid = false;
        errorMsg = language === "en" ? "Invalid phone number format" : "Sayop nga porma sa numero sa telepono.";
      }
      (updated[index][field] as string) = value;
      const newRefErrors = [...refErrors];
      newRefErrors[index] = valid ? "" : errorMsg;
      setRefErrors(newRefErrors);
    } else if (field === "relation") {
      // Max 3 words
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 3) {
        valid = false;
        errorMsg = language === "en" ? "Max 3 words only." : "Hangtud ra sa 3 ka pulong.";
      }
      (updated[index][field] as string) = value;
    } else {
      (updated[index][field] as string) = value;
    }
    setAppReferences(updated);
  };

  // Validate uniqueness against applicant + duplicates
  const validateReferenceUniqueness = (
    references: Reference[],
    applicantContact: string
  ) => {
    const errors = ["", "", ""];
    const namesSeen = new Set<string>();

    references.forEach((ref, idx) => {
      if (ref.name.trim() !== "" && ref.name.trim().toLowerCase() === applicantContact.toLowerCase()) {
        errors[idx] = "Reference name cannot be applicant’s name";
      }
      if (namesSeen.has(ref.name.trim()) && ref.name.trim() !== "") {
        errors[idx] = "Duplicate name not allowed";
      }
      namesSeen.add(ref.name.trim());

      if (ref.contact && ref.contact === applicantContact) {
        errors[idx] = "Reference contact cannot be applicant’s contact";
      }
    });

    setRefErrors(errors);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
        {language === "en" ? "Character References" : "Mga Reference"}
      </h4>
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? `Reference ${i + 1} Name:` : `Ngalan sa Reference ${i + 1}:`}
            </label>
            <input
              type="text"
              value={appReferences[i]?.name || ""}
              maxLength={50}
              onChange={e => handleReferenceChange(i, "name", e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${nameError[i] || missingFields.includes(`Reference ${i + 1} Name`) ? 'border-red-500' : 'border-gray-200'}`}
              placeholder={language === "en" ? "Enter name" : "Isulod ang ngalan"}
            />
            {nameError[i] && (
              <p className="text-sm text-red-600 mt-1">{nameError[i]}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Contact Number:" : "Numero sa Kontak:"}
            </label>
            <input
              type="text"
              value={appReferences[i]?.contact || ""}
              maxLength={11}
              onChange={e => handleReferenceChange(i, "contact", e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${refErrors[i] || missingFields.includes(`Reference ${i + 1} Contact`) ? 'border-red-500' : 'border-gray-200'}`}
              placeholder={language === "en" ? "Enter contact number" : "Isulod ang numero sa kontak"}
            />
            {refErrors[i] && (
              <p className="text-sm text-red-600 mt-1">{refErrors[i]}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Relationship:" : "Relasyon:"}
            </label>
            <input
              type="text"
              value={appReferences[i]?.relation || ""}
              maxLength={30}
              onChange={e => handleReferenceChange(i, "relation", e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${missingFields.includes(`Reference ${i + 1} Relationship`) ? 'border-red-500' : 'border-gray-200'}`}
              placeholder={language === "en" ? "Enter relationship" : "Isulod ang relasyon"}
            />
            {/* Could add error message for relation if needed */}
          </div>
        </div>
      ))}
    </div>
  );
}
