"use client";

import { useMemo } from "react";

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
  // Always recalculate errors for all references on every render
  const nameError = useMemo(() => {
    return appReferences.map((ref, idx) => {
      if (!/^[A-Za-zñÑ.\- ]*$/.test(ref.name)) {
        return language === "en" ? "Invalid name format." : "Sayop ang porma sa ngalan.";
      }
      const lowerValue = ref.name.trim().toLowerCase();
      const isDuplicate = appReferences.filter((r, i) => r.name.trim().toLowerCase() === lowerValue && lowerValue !== "").length > 1;
      if (isDuplicate) {
        return language === "en" ? "Duplicate name not allowed." : "Dili pwede ang parehas nga ngalan.";
      }
      return "";
    });
  }, [appReferences, language]);

 const refErrors = useMemo(() => {
  return appReferences.map((ref, idx) => {
    if (!/^\d*$/.test(ref.contact) || ref.contact.length > 11) {
      return language === "en" ? "Contact must be up to 11 digits." : "Hangtud ra sa 11 ka numero.";
    }
    if (ref.contact.length > 0 && !ref.contact.startsWith("09")) {
      return language === "en" ? "Invalid phone number format" : "Sayop nga porma sa numero sa telepono.";
    }
    const trimmedValue = ref.contact.trim();
    // Check for duplicate among references
    const isDuplicate = appReferences.filter((r, i) => r.contact.trim() === trimmedValue && trimmedValue !== "").length > 1;
    if (isDuplicate) {
      return language === "en" ? "Duplicate contact number not allowed." : "Dili pwede ang parehas nga numero.";
    }
    // Check if matches applicant's contact number
    if (trimmedValue !== "" && trimmedValue === appContact) {
      return language === "en"
        ? "Reference contact cannot be applicant's contact number."
        : "Dili pwede nga parehas sa numero sa aplikante.";
    }
    return "";
  });
}, [appReferences, language, appContact]);

  // Simple handler: just update state, validation is handled by useMemo
  const handleReferenceChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    const updated = [...appReferences];
    (updated[index][field] as string) = value;
    setAppReferences(updated);
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