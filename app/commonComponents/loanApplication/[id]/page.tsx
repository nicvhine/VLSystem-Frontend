"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

// Components
import Navbar from "../../navbarComponents/navbar";
import SuccessModal from "../../modals/successModal/modal";
import ErrorModal from "../../modals/errorModal/modal";
import LoanAgreementModal from "@/app/commonComponents/modals/loanAgreement/modal";
import ReleaseForm from "../../modals/loanAgreement/releaseForm";
import SetScheduleModal from "@/app/commonComponents/modals/loanApplication/scheduleModal";
import AccountModal from "@/app/commonComponents/modals/loanApplication/accountModal";
import ApplicationButtons from "./components/applicationButtons";
import WithCollateral from "./customization/withCollateral";
import OpenTerm from "./customization/openTerm";

// Wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import LoanOfficer from "@/app/userPage/loanOfficerPage/page";

// Hooks
import { useApplicationData } from "./hooks";
import { capitalizeWords, formatCurrency } from "@/app/commonComponents/utils/formatters";
import { authFetch } from "../function";

// Cards
import ProfileCard from "./cards/profileCard";
import BasicInfoCard from "./cards/basicInfoCard";
import LoanComputationCard from "./cards/loanComputationCard";
import IncomeCharactedCard from "./cards/incomeCharacterCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL 

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
    modalContainer,
  } = useApplicationData("http://localhost:3001/loan-applications");

  // Normalize role from localStorage to Navbar's expected union type
  const uiRole: 'head' | 'manager' | 'loanOfficer' | 'collector' | 'borrower' = (() => {
    const r = (role || '').toLowerCase();
    switch (r) {
      case 'head':
        return 'head';
      case 'manager':
        return 'manager';
      case 'loan officer':
      case 'loanofficer':
        return 'loanOfficer';
      case 'collector':
        return 'collector';
      case 'borrower':
        return 'borrower';
      default:
        return 'loanOfficer';
    }
  })();

  const [activeTab, setActiveTab] = useState("income");
  const [isAgreementOpen, setIsAgreementOpen] = useState<"loan" | "release" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const modalRef = useRef<any>(null);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const notFoundText = language === 'ceb' ? 'Wala nakit-an ang aplikasyon' : 'Application not found';

  const showSuccess = (msg: string) => {
    // ensure mutual exclusivity: close error before showing success
    setErrorModalOpen(false);
    setSuccessMessage(msg);
    setSuccessModalOpen(true);
    setTimeout(() => setSuccessModalOpen(false), 5000);
  };

  const showError = (msg: string) => {
    // ensure mutual exclusivity: close success before showing error
    setSuccessModalOpen(false);
    setErrorMessage(msg);
    setErrorModalOpen(true);
    setTimeout(() => setErrorModalOpen(false), 3000);
  };

  const Wrapper =
    role === "head" ? Head : role === "manager" ? Manager : LoanOfficer;

  const application = applications.find((app) => app.applicationId === id);

  if (!application && !loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-gray-50">
          <Navbar role={uiRole} />
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
      {/* Modal Portal Host */}
      <div id="modal-root"></div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">

              {/*BACK BUTTON LOGIC*/}
              <button
                onClick={() => {
                if (role === "head") {
                    router.push("/commonComponents/loanApplication");
                } else if (role === "manager") {
                    router.push("/commonComponents/loanApplication")
                }
                else {
                    router.push("/commonComponents/loanApplication");
                }
                }}
                className="text-gray-400 hover:text-gray-600"
                >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              {/*HEADER*/}
                <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {l.t34} | <span className="text-sm font-normal text-gray-500">{application?.applicationId}</span>
                </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      application?.status === 'Applied' ? 'bg-red-100 text-red-800' :
                      application?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      application?.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      application?.status === 'Denied' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application?.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">{application?.loanType || ''}</span>
                  </div>
                </div>
              </div>

              {/*BUTTONS*/}
              <div className="flex space-x-3">
                <ApplicationButtons
                  application={application!}
                  role={role}
                  setApplications={setApplications}
                  authFetch={authFetch}
                  API_URL={API_URL ?? "http://localhost:3001/loan-applications"}
                  setIsModalOpen={setIsModalOpen}
                  setIsAgreementOpen={setIsAgreementOpen}
                  modalRef={modalRef}
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

            {/* PROFILE SECTION */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <ProfileCard application={application} />
              <BasicInfoCard application={application} l={l} />
            </div>

            {/* MIDDLE */}
            <div className="lg:col-span-1 flex flex-col h-full">
            <IncomeCharactedCard application={application} l={l} t={t} />
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <LoanComputationCard application={application} t={t} l={l} />
            </div>
          </div>
        </div>

        {/* MODALS */}
          <SetScheduleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            application={application}
            setApplications={setApplications}
            authFetch={authFetch}
            showError={showError}
            showSuccess={showSuccess}
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
  <LoanAgreementModal
    isOpen={true}
    onClose={() => setIsAgreementOpen(null)}
    application={(application as any) ?? null}
  />
)}

{isAgreementOpen === "release" && (
  <ReleaseForm
    isOpen={true}
    onClose={() => setIsAgreementOpen(null)}
    application={(application as any) ?? null}
  />
)}

        <AccountModal ref={modalRef} />
      </div>
      </Wrapper>
    );
  }