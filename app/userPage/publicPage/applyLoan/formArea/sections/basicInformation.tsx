"use client";

import { useState, useEffect } from "react";
import MapComponent from "../../MapComponent"; 
import { BasicInformationProps } from "@/app/commonComponents/utils/Types/components";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function BasicInformation({
  language,
  appName,
  setAppName,
  appDob,
  setAppDob,
  appContact,
  setAppContact,
  appEmail,
  setAppEmail,
  appMarital,
  setAppMarital,
  appChildren,
  setAppChildren,
  appSpouseName,
  setAppSpouseName,
  appSpouseOccupation,
  setAppSpouseOccupation,
  appAddress,
  setAppAddress,
  appReferences = [],
  missingFields = [],
  showFieldErrors = false,
  resetForm,
}: BasicInformationProps) {
  const [error, setError] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [phoneConflictError, setPhoneConflictError] = useState("");
  const [emailConflictError, setEmailConflictError] = useState("");
  const [spouseNameError, setSpouseNameError] = useState("");
  
  // ✅ ADD MISSING MODAL STATE
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppAddress(e.target.value);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAppDob(value);

    if (value) {
      const age = calculateAge(value);
      if (age < 18) {
        setDobError(
          language === "en"
            ? "You must be at least 18 years old to apply."
            : "Kinahanglan ka labing menos 18 anyos aron maka-apply."
        );
      } else {
        setDobError("");
      }
    } else {
      setDobError("");
    }
  };

  // Check for duplicate applications (same name, DOB, email)
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!appName || !appDob || !appEmail) return;
  
      console.log("Trigger check:", { appName, appDob, appEmail });
  
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/loan-applications/check-duplicate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ appName, appDob, appEmail }),
        });
  
        const data = await res.json();
  
        console.log("Server response:", data);
  
        if (data.isDuplicate) {
          if (["Pending", "Applied", "Cleared", "Approved", "Disbursed"].includes(data.status)) {
            // Pending-type applications
            setModalMessage(
              language === "en"
                ? "Oops! It looks like you have a pending application with us. Please track your application status. If you think there's a mistake, kindly contact our office."
                : "Naay pending nga aplikasyon sa among opisina. Palihug i-track ang imong aplikasyon. Kung naay sayop, palihug kontaka ang opisina."
            );
          } else if (data.status === "Active") {
            // Active accounts
            setModalMessage(
              language === "en"
                ? "Oops! It looks like you have an existing active account with us. If you're a borrower, you may apply for a re-loan through the borrower portal. If you think there's a mistake, kindly contact our office."
                : "Aduna kay existing nga active account sa among sistema. Kung ikaw borrower, mahimo ka mag-reloan sa borrower portal. Kung naay sayop, palihug kontaka ang opisina."
            );
          }
          setIsModalVisible(true);
          setTimeout(() => setIsModalAnimating(true), 10);
        } else {
          setModalMessage("");
          setDuplicateError("");
          setIsModalVisible(false);
          setIsModalAnimating(false);
        }
        
      } catch (err) {
        console.error("Error checking duplicate application:", err);
      }
    };
  
    const timeout = setTimeout(checkDuplicate, 500);
    return () => clearTimeout(timeout);
  }, [appName, appDob, appEmail, language]);

  // Check for contact/email conflicts (same contact/email with different name)
  useEffect(() => {
    const checkContactConflict = async () => {
      if (!appName || (!appContact && !appEmail)) {
        setPhoneConflictError("");
        setEmailConflictError("");
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BASE_URL}/loan-applications/check-contact-conflict`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ appName, appContact, appEmail }),
          }
        );
  
        const data = await res.json();
        console.log("Contact conflict response:", data);
  
        if (!data.hasConflict) {
          setPhoneConflictError("");
          setEmailConflictError("");
          return;
        }
  
        if (data.field === "contact") {
          setPhoneConflictError(data.message);
          setEmailConflictError("");
        }
  
        if (data.field === "email") {
          setEmailConflictError(data.message);
          setPhoneConflictError("");
        }
      } catch (err) {
        console.error("Error checking contact conflict:", err);
      }
    };
  
    const timeout = setTimeout(checkContactConflict, 600);
    return () => clearTimeout(timeout);
  }, [appName, appContact, appEmail]);
  
  

  const handleCloseModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsModalVisible(false);
      setModalMessage("");
    }, 300);
  };

  return (
    <>
      {/* DUPLICATE APPLICATION MODAL */}
      {isModalVisible && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl transition-all duration-300 ${
              isModalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "en" ? "Application Found" : "Nakit-an ang Aplikasyon"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{modalMessage}</p>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {language === "en" ? "Understood" : "Nasabtan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
          {language === "en" ? "Basic Information" : "Pangunang Impormasyon"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Name:" : "Ngalan:"}
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => {
                const value = e.target.value;

                if (/^[A-Za-zñÑ.\-\s]*$/.test(value)) {
                  setAppName(value);

                  const words = value.trim().split(/\s+/).filter(Boolean);
                  if (words.length < 2) {
                    setNameError(
                      language === "en"
                        ? "Please enter at least first and last name."
                        : "Palihug isulod ang labing menos ngalan ug apelyido."
                    );
                  } else {
                    setNameError("");
                  }
                }
              }}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                (showFieldErrors && (missingFields.includes("Name") || nameError)) ? "border-red-500" : "border-gray-200"
              }`}
              placeholder={language === "en" ? "Enter your full name" : "Isulod ang imong tibuok ngalan"}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Date of Birth:" : "Petsa sa Pagkatawo:"}
            </label>
            <input
              type="date"
              value={appDob}
              onChange={handleDobChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                (showFieldErrors && missingFields.includes('Date of Birth')) || dobError ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Contact Number:" : "Numero sa Kontak:"}
            </label>
            <input
              type="text"
              value={appContact}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  if (value.length <= 11) {
                    setAppContact(value);
                    setError("");
                  }
                }
              }}
              onBlur={() => {
                if (!/^09\d{9}$/.test(appContact)) {
                  setError(
                    language === "en"
                      ? "Invalid phone number format"
                      : "Sayop nga porma sa numero sa telepono."
                  );
                } else {
                  setError("");
                }
              }}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && (missingFields.includes('Contact Number') || error || phoneConflictError)) ? 'border-red-500' : 'border-gray-200'}`}
              placeholder={language === "en" ? "Enter contact number" : "Isulod ang numero sa kontak"}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {phoneConflictError && <p className="text-red-500 text-sm mt-1">{phoneConflictError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Email Address:" : "Email Address:"}
            </label>
            <div className="flex">
              <input
                type="text"
                value={appEmail.replace("@gmail.com", "")}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/@.*/, "");
                  setAppEmail(value + "@gmail.com");
                }}
                className={`w-full border p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  (showFieldErrors && (missingFields.includes("Email Address") || emailConflictError)) ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={language === "en" ? "Enter email" : "Isulod ang email"}
              />
              <span className="px-4 py-3 border border-l-0 border-gray-200 rounded-r-lg bg-gray-100 text-gray-700 select-none">
                @gmail.com
              </span>
            </div>
            {duplicateError && <p className="text-red-500 text-sm mt-1">{duplicateError}</p>}
            {emailConflictError && <p className="text-red-500 text-sm mt-1">{emailConflictError}</p>}
          </div>
        </div>

        {/* Marital Status + Children */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Marital Status:" : "Sibil nga Kahimtang:"}
            </label>
            <select
              value={appMarital}
              onChange={(e) => setAppMarital(e.target.value)}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields.includes('Marital Status')) ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="">{language === "en" ? "Select Status" : "Pilia ang Kahimtang"}</option>
              <option value="Single">{language === "en" ? "Single" : "Walay Bana/Asawa"}</option>
              <option value="Married">{language === "en" ? "Married" : "Minyo"}</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {language === "en" ? "Number of Children:" : "Ilang Anak:"}
            </label>
            <input
              type="number"
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === "en" ? "Enter number of children" : "Isulod ang ihap sa anak"}
              value={appChildren || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setAppChildren(0);
                } else {
                  const numValue = parseInt(value);
                  setAppChildren(isNaN(numValue) ? 0 : numValue);
                }
              }}
              min={0}
            />
          </div>
        </div>

        {/* Spouse Fields */}
        {appMarital === "Married" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                {language === "en" ? "Spouse Name:" : "Ngalan sa Bana/Asawa:"}
              </label>
              <input
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && (missingFields.includes('Spouse Name') || spouseNameError)) ? 'border-red-500' : 'border-gray-200'}`}
                placeholder={language === "en" ? "Enter spouse name" : "Isulod ang ngalan sa bana/asawa"}
                value={appSpouseName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-zñÑ.\-\s]*$/.test(value)) {
                    setAppSpouseName(value);
                    
                    const trimmedValue = value.trim();
                    const words = trimmedValue.split(/\s+/).filter(Boolean);
                    
                    if (trimmedValue && words.length < 2) {
                      setSpouseNameError(
                        language === "en"
                          ? "Please enter at least first and last name."
                          : "Palihug isulod ang labing menos ngalan ug apelyido."
                      );
                    } else if (trimmedValue && appName && trimmedValue.toLowerCase() === appName.toLowerCase()) {
                      setSpouseNameError(
                        language === "en"
                          ? "Spouse name cannot be the same as applicant name."
                          : "Ang ngalan sa bana/asawa dili mahimong pareho sa applicant."
                      );
                    } else if (trimmedValue && appReferences.some(ref => ref.name.trim().toLowerCase() === trimmedValue.toLowerCase())) {
                      setSpouseNameError(
                        language === "en"
                          ? "Spouse name cannot be the same as any reference name."
                          : "Ang ngalan sa bana/asawa dili mahimong pareho sa reperensya."
                      );
                    } else {
                      setSpouseNameError("");
                    }
                  }
                }}
              />
              {spouseNameError && <p className="text-red-500 text-sm mt-1">{spouseNameError}</p>}
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                {language === "en" ? "Spouse Occupation:" : "Trabaho sa Bana/Asawa:"}
              </label>
              <input
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields.includes('Spouse Occupation')) ? 'border-red-500' : 'border-gray-200'}`}
                placeholder={language === "en" ? "Enter spouse occupation" : "Isulod ang trabaho sa bana/asawa"}
                value={appSpouseOccupation}
                onChange={(e) => setAppSpouseOccupation(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Address */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">
            {language === "en" ? "Home Address:" : "Address sa Panimalay:"}
          </label>
          <input
            type="text"
            value={appAddress}
            onChange={handleAddressChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields.includes('Home Address')) ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={language === "en" ? "Click on the map or type here" : "I-klik ang mapa o isulat dinhi"}
          />
        </div>

        {/* Map */}
        <div
          className="rounded-lg overflow-hidden shadow-sm border border-gray-200 relative"
          style={{ height: 300 }}
        >
          <MapComponent
            address={appAddress}
            setAddress={setAppAddress}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </div>
      </div>
    </>
  );
}