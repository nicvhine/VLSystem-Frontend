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
  missingFields = [],
  showFieldErrors = false,
}: BasicInformationProps) {
  const [error, setError] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [nameError, setNameError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [modalMessage, setModalMessage] = useState("");


  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppAddress(e.target.value);
  };

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
          if (["Pending", "Applied", "Cleared"].includes(data.status)) {
            // Pending-type applications
            setModalMessage(
              language === "en"
                ? "Oops! You have a pending application with us. If there’s a problem kindly contact the office."
                : "Naay pending nga aplikasyon sa among opisina. Kung adunay problema, palihug kontaka ang opisina."
            );
            setDuplicateError(
              language === "en"
                ? `Duplicate found (Status: ${data.status})`
                : `Duplicate naay status: ${data.status}`
            );
          } else if (["Approved", "Disbursed", "Active", "Closed"].includes(data.status)) {
            // Existing accounts
            setModalMessage(
              language === "en"
                ? "You already have an existing borrower account. You may go there if you wish to re-loan."
                : "Aduna kay existing nga borrower account. Mahimo nimo adto kung gusto ka mag-reloan."
            );
            setDuplicateError(
              language === "en"
                ? `Duplicate found (Status: ${data.status})`
                : `Duplicate naay status: ${data.status}`
            );
          }
        } else {
          setModalMessage("");
          setDuplicateError("");
        }
        
      } catch (err) {
        console.error("Error checking duplicate application:", err);
      }
    };
  
    const timeout = setTimeout(checkDuplicate, 500);
    return () => clearTimeout(timeout);
  }, [appName, appDob, appEmail, language, BASE_URL]);
  

  return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">

      {modalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg text-center">
            <p className="text-gray-800">{modalMessage}</p>
            <button
              onClick={() => setModalMessage("")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
            onChange={(e) => setAppDob(e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0]}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields.includes('Date of Birth')) ? 'border-red-500' : 'border-gray-200'}`}
          />
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
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && (missingFields.includes('Contact Number') || error)) ? 'border-red-500' : 'border-gray-200'}`}
            placeholder={language === "en" ? "Enter contact number" : "Isulod ang numero sa kontak"}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
              (showFieldErrors && missingFields.includes("Email Address")) ? "border-red-500" : "border-gray-200"
            }`}
            placeholder={language === "en" ? "Enter email" : "Isulod ang email"}
          />
          <span className="px-4 py-3 border border-l-0 border-gray-200 rounded-r-lg bg-gray-100 text-gray-700 select-none">
            @gmail.com
          </span>
        </div>
        {duplicateError && <p className="text-red-500 text-sm mt-1">{duplicateError}</p>}
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
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(showFieldErrors && missingFields.includes('Spouse Name')) ? 'border-red-500' : 'border-gray-200'}`}
              placeholder={language === "en" ? "Enter spouse name" : "Isulod ang ngalan sa bana/asawa"}
              value={appSpouseName}
              onChange={(e) => setAppSpouseName(e.target.value)}
            />
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
  );
}
