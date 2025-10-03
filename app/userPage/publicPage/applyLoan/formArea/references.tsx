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
}

export default function References({
  language,
  appReferences,
  setAppReferences,
  appContact,
}: ReferencesProps) {
  const [nameError, setNameError] = useState<string[]>(["", "", ""]);
  const [refErrors, setRefErrors] = useState<string[]>(["", "", ""]);

  // Handle reference field changes
  const handleReferenceChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    const updated = [...appReferences];
    updated[index][field] = value;
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
        {language === "en" ? "Character References" : "Mga Tigi-uyonanan"}
      </h4>

      {[1, 2, 3].map((i) => (
  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Reference Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en"
                ? `Reference ${i} Name:`
                : `Pangalan sa Tig-uyon ${i}:`}
            </label>
            <input
              type="text"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                nameError[i - 1] ? "border-red-400" : "border-gray-200"
              }`}
              placeholder={language === "en" ? "Full name" : "Buong pangalan"}
              value={appReferences[i - 1]?.name || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-zñÑ.\- ]*$/.test(value)) {
                  handleReferenceChange(i - 1, "name", value);
                  const updatedErrors = [...nameError];
                  updatedErrors[i - 1] = "";
                  setNameError(updatedErrors);
                } else {
                  const updatedErrors = [...nameError];
                  updatedErrors[i - 1] =
                    language === "en"
                      ? "Invalid name format."
                      : "Sayop ang porma sa ngalan.";
                  setNameError(updatedErrors);
                }
              }}
            />
            {(nameError[i - 1] ||
              (refErrors[i - 1] &&
                refErrors[i - 1].toLowerCase().match(/duplicate name|applicant’s name/))) && (
              <p className="text-sm text-red-600 mt-1">
                {nameError[i - 1] ||
                  refErrors[i - 1]
                    .split("•")
                    .filter(
                      (err) =>
                        err.toLowerCase().includes("duplicate name") ||
                        err.toLowerCase().includes("applicant’s name")
                    )
                    .join(" • ")}
              </p>
            )}
          </div>

          {/* Reference Contact */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Contact Number:" : "Numero ng Telepono:"}
            </label>
            <input
              type="text"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                refErrors[i - 1] &&
                refErrors[i - 1].toLowerCase().includes("contact")
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              placeholder="09XXXXXXXXX"
              value={appReferences[i - 1]?.contact || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 11) {
                  handleReferenceChange(i - 1, "contact", value);
                }
              }}
              onBlur={(e) => {
                const v = e.target.value.trim();
                const next = [...refErrors];
                if (v && !/^09\d{9}$/.test(v)) {
                  next[i - 1] = "Invalid mobile format";
                } else {
                  next[i - 1] = "";
                  validateReferenceUniqueness(appReferences, appContact);
                }
                setRefErrors(next);
              }}
              aria-invalid={
                !!refErrors[i - 1] &&
                refErrors[i - 1].toLowerCase().includes("contact")
              }
            />
            {refErrors[i - 1] &&
              refErrors[i - 1].toLowerCase().match(/contact|mobile|digits/) && (
                <p className="text-sm text-red-600 mt-1">{refErrors[i - 1]}</p>
              )}
          </div>

          {/* Reference Relationship */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Relationship:" : "Relasyon:"}
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={
                language === "en"
                  ? "e.g., Friend, Sibling"
                  : "hal. Higala, Igsoon"
              }
              value={appReferences[i - 1]?.relation || ""}
              onChange={(e) => {
                const value = e.target.value;
                const wordCount = value.trim().split(/\s+/).length;
                if (wordCount <= 3) {
                  handleReferenceChange(i - 1, "relation", value);
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
