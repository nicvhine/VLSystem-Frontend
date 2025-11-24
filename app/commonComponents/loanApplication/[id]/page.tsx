"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Components
import SuccessModal from "../../modals/successModal";
import ErrorModal from "../../modals/errorModal";
import LoanAgreementModal from "@/app/commonComponents/modals/loanAgreement/regularLoan/modal";
import OpenLoanAgreementModal from "@/app/commonComponents/modals/loanAgreement/openTerm/modal";
import ReleaseForm from "../../modals/loanAgreement/regularLoan/releaseForm";
import SetScheduleModal from "@/app/commonComponents/modals/loanApplication/scheduleModal";
import AccountModal from "@/app/commonComponents/modals/loanApplication/accountModal";
import ApplicationButtons from "./components/applicationButtons";

// Wrappers
import Head from "@/app/userPage/headPage/layout";
import Manager from "@/app/userPage/managerPage/layout";
import LoanOfficer from "@/app/userPage/loanOfficerPage/layout";

// Hooks
import { useApplicationData } from "./hooks";
import { authFetch } from "../function";

// Cards
import ProfileCard from "./cards/profileCard";
import BasicInfoCard from "./cards/basicInfoCard";
import LoanComputationCard from "./cards/loanComputationCard";
import IncomeCharactedCard from "./cards/incomeCharacterCard";

// Translation 
import { translateLoanType } from "../../utils/formatters";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const {
    applications,
    setApplications,
    loading,
    role,
    language,
    t,
    l,
    a,
  } = useApplicationData(`${BASE_URL}/loan-applications`);

  const [isEditing, setIsEditing] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState<any>({});

  const [isAgreementOpen, setIsAgreementOpen] = useState<"loan" | "release" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<any>(null);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const notFoundText = language === 'ceb' ? 'Wala nakit-an ang aplikasyon' : 'Application not found';

  const showSuccess = (msg: string) => {
    setErrorModalOpen(false);
    setSuccessMessage(msg);
    setSuccessModalOpen(true);
    setTimeout(() => setSuccessModalOpen(false), 5000);
  };

  const showError = (msg: string) => {
    setSuccessModalOpen(false);
    setErrorMessage(msg);
    setErrorModalOpen(true);
    setTimeout(() => setErrorModalOpen(false), 3000);
  };

  const Wrapper = role === "head" ? Head : role === "manager" ? Manager : LoanOfficer;

  const application = Array.isArray(applications) 
    ? applications.find((app) => app.applicationId === id)
    : undefined;

  // Sync local basic info with application
  useEffect(() => {
    if (application) {
      setBasicInfoData({
        appDob: application.appDob || "",
        appAddress: application.appAddress || "",
        appMarital: application.appMarital || "",
        appSpouseName: application.appSpouseName || "",
        appSpouseOccupation: application.appSpouseOccupation || "",
        appChildren: application.appChildren || "",
      });
    }
  }, [application]);

  const handleSaveBasicInfo = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/loan-applications/${application?.applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basicInfoData),
      });

      if (!res.ok) throw new Error("Failed to update basic info");

      const updatedApp = await res.json();

      setApplications((prev: any) =>
        prev.map((app: any) =>
          app.applicationId === updatedApp.applicationId ? updatedApp : app
        )
      );

      setIsEditing(false);
      showSuccess("Basic information updated successfully!");
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Failed to update application");
    }
  };

  if (!application && !loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-gray-50">
          <div className="p-10 text-center text-gray-600 text-lg">
            {notFoundText}
          </div>
        </div>
      </Wrapper>
    );
  }
 
  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div id="modal-root"></div>

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Back Button */}
                <button
                  onClick={() => (typeof window !== "undefined" ? window.history.back() : null)}
                  className="mt-1 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {l.t34} |{" "}
                    <span className="text-sm font-normal text-gray-500">
                      {application?.applicationId}
                    </span>
                  </h1>

                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      application?.status === "Applied" ? "bg-red-100 text-red-800" :
                      application?.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      application?.status === "Approved" ? "bg-green-100 text-green-800" :
                      application?.status === "Denied" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {application?.status || "Unknown"}
                    </span>

                    <span className="text-sm text-gray-500">
                      {translateLoanType(application?.loanType, language)}
                    </span>
                  </div>

                  {(application?.status === "Denied" || application?.status === "Denied by LO") && (
                    <span className="text-sm text-red-600 mt-5">
                      Loan denied due to: {application?.denialReason}
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center sm:justify-end space-x-3">
                <button
                  onClick={() => {
                    if (isEditing) handleSaveBasicInfo();
                    else setIsEditing(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  {isEditing ? "Save" : "Edit Details"}
                </button>

                <ApplicationButtons
                  application={application!}
                  role={role}
                  setApplications={setApplications}
                  authFetch={authFetch}
                  API_URL={`${BASE_URL}`}
                  setIsModalOpen={setIsModalOpen}
                  setIsAgreementOpen={setIsAgreementOpen}
                  modalRef={modalRef}
                  a={a}
                  showSuccess={showSuccess}
                  showError={showError}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col h-full">
              <ProfileCard application={application} />
              <BasicInfoCard
                application={application}
                l={l}
                isEditing={isEditing}
                basicInfoData={basicInfoData}
                setBasicInfoData={setBasicInfoData}
              />
            </div>

            <div className="lg:col-span-1 flex flex-col h-full">
              <IncomeCharactedCard application={application} l={l} t={t} />
            </div>

            <div className="lg:col-span-1 flex flex-col h-full">
              <LoanComputationCard application={application} t={t} l={l} />
            </div>
          </div>
        </div>

        {/* Modals */}
        <SetScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          application={application}
          setApplications={setApplications}
          authFetch={authFetch}
          showError={showError}
          showSuccess={showSuccess}
          a={a}
        />
        <ErrorModal
          isOpen={errorModalOpen}
          message={errorMessage}
          onClose={() => setErrorModalOpen(false)}
        />
        <SuccessModal
          isOpen={successModalOpen}
          message={successMessage}
          onClose={() => setSuccessModalOpen(false)}
        />

        {isAgreementOpen === "loan" && (
          application?.loanType === "Open-Term Loan" ? (
            <OpenLoanAgreementModal
              isOpen={true}
              onClose={() => setIsAgreementOpen(null)}
              application={application ?? null}
            />
          ) : (
            <LoanAgreementModal
              isOpen={true}
              onClose={() => setIsAgreementOpen(null)}
              application={application ?? null}
            />
          )
        )}

        {isAgreementOpen === "release" && (
          <ReleaseForm
            isOpen={true}
            onClose={() => setIsAgreementOpen(null)}
            application={(application as any) ?? null}
          />
        )}

        <AccountModal ref={modalRef} a={a} />
      </div>
    </Wrapper>
  );
}
