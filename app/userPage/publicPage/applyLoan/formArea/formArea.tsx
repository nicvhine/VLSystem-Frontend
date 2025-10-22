"use client";

import { useState, useEffect } from "react";
import { ButtonContentLoading, ButtonDotsLoading, SubmitProgressModal } from "@/app/commonComponents/utils/loading";
import { useRouter } from "next/navigation";
import { formToJSON } from "axios";
import TermsGateModal from "@/app/commonComponents/modals/termsPrivacy/TermsGateModal";
import TermsContentModal from "@/app/commonComponents/modals/termsPrivacy/TermsContentModal";
import PrivacyContentModal from "@/app/commonComponents/modals/termsPrivacy/PrivacyContentModal";
// Using SubmitProgressModal (system-style modal) instead of bottom-right overlay toast

// Form section components
import BasicInformation from "./sections/basicInformation";
import SourceOfIncome from "./sections/sourceOfIncome";
import References from "./sections/references";
import CollateralInformation from "./sections/collateral";
import LoanDetails from "./sections/loanDetails";
import UploadSection from "./sections/uploadSection";
import AgentDropdown from "./sections/agent";

<<<<<<< HEAD
/**
 * Error modal component for displaying missing field errors
 * Shows an animated modal with error message and close button
 * @param message - Error message to display
 * @param onClose - Callback function to close the modal
 * @returns JSX element containing the error modal
 */
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
    const [animateIn, setAnimateIn] = useState(false);
    
    useEffect(() => {
        setAnimateIn(true);
        return () => setAnimateIn(false);
    }, []);
    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(() => onClose(), 150);
    };
    
    // Determine header based on error message
    let header = "Error";
    if (message.toLowerCase().includes("agent") || message.toLowerCase().includes("does not exist")) {
        header = "Agent Selection Error";
    } else if (message.toLowerCase().includes("missing") || message.toLowerCase().includes("required field")) {
        header = "Missing Fields Error";
    } else if (message.toLowerCase().includes("upload")) {
        header = "Document Upload Error";
    }
    return (
        <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
                animateIn ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
                    animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{header}</h3>
                <p className="text-sm text-gray-600 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >Close</button>
                </div>
            </div>
        </div>
    );
}

// Modal for document upload errors
function DocumentUploadErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
    const [animateIn, setAnimateIn] = useState(false);
    useEffect(() => {
        setAnimateIn(true);
        return () => setAnimateIn(false);
    }, []);
    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(() => onClose(), 150);
    };
    return (
        <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
                animateIn ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-sm rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
                    animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Upload Issue</h3>
                <p className="text-sm text-gray-600 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >Close</button>
                </div>
            </div>
        </div>
    );
}
=======
import { ErrorModal, DocumentUploadErrorModal } from "./modals/errorModal";
import SuccessModalWithAnimation from "./modals/successModal";

import { useUpdateMissingFields } from "./hooks/updateMissingFields";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { handleFileChange, handleProfileChange, removeDocument, removeProfile } from "./function";

interface FormAreaProps {
  loanType: string;
  language: "en" | "ceb";
  isMobile?: boolean;
  onProgressUpdate?: (progress: Record<string, boolean>) => void;
}

export default function FormArea({ loanType, language, isMobile, onProgressUpdate }: FormAreaProps) {
  const COMPANY_NAME = "Vistula Lending Corporation";
  const TERMS_VERSION = "1.0-draft";
  const PRIVACY_VERSION = "1.0-draft";
>>>>>>> d4fff06 (Progress Tracker)


interface SuccessModalWithAnimationProps {
    language: string;
    loanId: string | null;
    onClose: () => void;
}

function SuccessModalWithAnimation({ language, loanId, onClose }: SuccessModalWithAnimationProps) {
    const [animateIn, setAnimateIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAnimateIn(true);
        return () => setAnimateIn(false);
    }, []);

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(() => {
            onClose();
            router.push('/');
        }, 150);
    };
    

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
                animateIn ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-md rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
                    animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Application Submitted' : 'Napasa ang Aplikasyon'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {language === 'en'
                        ? 'Your loan application has been received and is now being processed.'
                        : 'Nadawat na ang imong aplikasyon ug gi-proseso na karon.'}
                </p>
                {loanId && (
                    <div className="mb-4 rounded-md border border-gray-100 bg-gray-50 p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            {language === 'en' ? 'Application ID' : 'Application ID'}
                        </p>
                        <p className="text-lg font-semibold text-red-600">{loanId}</p>
                    </div>
                )}
                <p className="text-xs text-gray-500 mb-6">
                    {language === 'en'
                        ? 'We will contact you using your provided details for the next steps. Please keep your lines open.'
                        : 'Amo kang kontakon pinaagi sa imong contact details para sa sunod nga lakang. Palihug hulat sa among mensahe.'}
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        {language === 'en' ? 'Close' : 'Sirado'}
                    </button>
                </div>
            </div>
        </div>
    );
}

    interface FormAreaProps {
    loanType: string;
    language: 'en' | 'ceb';
    isMobile?: boolean;
    }

    export default function FormArea({ loanType, language, isMobile }: FormAreaProps) {
        // Branding and versioning
        const COMPANY_NAME = 'Vistula Lending Corporation';
        const TERMS_VERSION = '1.0-draft';
        const PRIVACY_VERSION = '1.0-draft';
        const router = useRouter();
        const [loanId, setLoanId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progressOpen, setProgressOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
        // Error modal state
        const [showErrorModal, setShowErrorModal] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
    const [missingFields, setMissingFields] = useState<string[]>([]);

        // Basic Info
        const [appName, setAppName] = useState("");
        const [appDob, setAppDob] = useState("");
        const [appContact, setAppContact] = useState("");
        const [appEmail, setAppEmail] = useState("");
        const [appMarital, setAppMarital] = useState("");
        const [appChildren, setAppChildren] = useState(0);
        const [appSpouseName, setAppSpouseName] = useState("");
        const [appSpouseOccupation, setAppSpouseOccupation] = useState("");
        const [appAddress, setAppAddress] = useState("");

        // Source of Income
        const [sourceOfIncome, setSourceOfIncome] = useState("");
        const [appTypeBusiness, setAppTypeBusiness] = useState("");
        const [appBusinessName, setAppBusinessName] = useState("");
        const [appDateStarted, setAppDateStarted] = useState("");
        const [appBusinessLoc, setAppBusinessLoc] = useState("");
        const [appMonthlyIncome, setAppMonthlyIncome] = useState<number>(0);
        const [appOccupation, setAppOccupation] = useState("");
        const [appEmploymentStatus, setAppEmploymentStatus] = useState("");
        const [appCompanyName, setAppCompanyName] = useState("");
        const [occupationError, setOccupationError] = useState("");

        // References
        const [appReferences, setAppReferences] = useState([
            { name: "", contact: "", relation: "" },
            { name: "", contact: "", relation: "" },
            { name: "", contact: "", relation: "" }
        ]);

        // Agents
    const [appAgent, setAppAgent] = useState("");
    const [agentMissingError, setAgentMissingError] = useState(false);

        // Collateral
        const [collateralType, setCollateralType] = useState("");
        const [collateralValue, setCollateralValue] = useState<number>(0);
        const [collateralDescription, setCollateralDescription] = useState("");
        const [ownershipStatus, setOwnershipStatus] = useState("");
        const collateralTypeOptions = [
            { value: "", label: language === "en" ? "Choose Collateral Type" : "Pilia ang klase sa kolateral" },
            { value: "vehicle", label: language === "en" ? "Vehicle" : "Sakyanan" },
            { value: "land", label: language === "en" ? "Land" : "Yuta" },
            { value: "house", label: language === "en" ? "House" : "Balay" },
        ];

        // Loan
        const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
        const [appLoanPurpose, setAppLoanPurpose] = useState("");

        // Uploads
        const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
        const [photo2x2, setPhoto2x2] = useState<File[]>([]);
    // Terms/Privacy modals
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showTosContent, setShowTosContent] = useState(false);
    const [showPrivacyContent, setShowPrivacyContent] = useState(false);
    const [tosRead, setTosRead] = useState(false);
    const [privacyRead, setPrivacyRead] = useState(false);

        const loanTypeParam = loanType === (language === "en" ? "Regular Loan With Collateral" : "Regular nga Pahulam (Naay Kolateral)")
            ? "with"
        : loanType === (language === "en" ? "Regular Loan Without Collateral" : "Regular nga Pahulam (Walay Kolateral)")
        ? "without"
        : "open-term";

    const requiresCollateral = loanTypeParam === "with" || loanTypeParam === "open-term";
    // Required docs as specified:
    // without collateral: 4, with collateral: 6, open-term: 6
    const requiredDocumentsCount = loanTypeParam === 'with' ? 6 : loanTypeParam === 'open-term' ? 6 : 4;
    const API_URL = `http://localhost:3001/loan-applications/apply/${loanTypeParam}`;

<<<<<<< HEAD
        useEffect(() => {
            setMissingFields((prev) => {
                const next = prev.filter((field) => {
                    const referenceMatch = field.match(/^Reference (\d+) (Name|Contact|Relationship)$/);
                    if (referenceMatch) {
                        const index = Number(referenceMatch[1]) - 1;
                        const key = referenceMatch[2];
                        const ref = appReferences[index];
                        if (!ref) return false;
                        if (key === "Name") return !ref.name.trim();
                        if (key === "Contact") return !ref.contact.trim();
                        return !ref.relation.trim();
                    }

                    switch (field) {
                        case "Name":
                            return !appName.trim();
                        case "Date of Birth":
                            return !appDob;
                        case "Contact Number":
                            return !appContact.trim();
                        case "Email Address":
                            return !appEmail.trim();
                        case "Marital Status":
                            return !appMarital;
                        case "Spouse Name":
                            return appMarital === "Married" && !appSpouseName.trim();
                        case "Spouse Occupation":
                            return appMarital === "Married" && !appSpouseOccupation.trim();
                        case "Home Address":
                            return !appAddress.trim();
                        case "Loan Purpose":
                            return !appLoanPurpose.trim();
                        case "Loan Amount":
                            return !selectedLoan;
                        case "Source of Income":
                            return !sourceOfIncome;
                        case "Type of Business":
                            return sourceOfIncome === "business" && !appTypeBusiness.trim();
                        case "Business Name":
                            return sourceOfIncome === "business" && !appBusinessName.trim();
                        case "Date Started":
                            return sourceOfIncome === "business" && !appDateStarted;
                        case "Business Location":
                            return sourceOfIncome === "business" && !appBusinessLoc.trim();
                        case "Occupation":
                            return sourceOfIncome && sourceOfIncome !== "business" && !appOccupation.trim();
                        case "Employment Status":
                            return sourceOfIncome && sourceOfIncome !== "business" && !appEmploymentStatus.trim();
                        case "Company Name":
                            return sourceOfIncome && sourceOfIncome !== "business" && !appCompanyName.trim();
                        case "Monthly Income":
                            return !!sourceOfIncome && appMonthlyIncome <= 0;
                        case "Collateral Type":
                            return requiresCollateral && !collateralType;
                        case "Collateral Value":
                            return requiresCollateral && (!collateralValue || collateralValue <= 0);
                        case "Collateral Description":
                            return requiresCollateral && !collateralDescription.trim();
                        case "Ownership Status":
                            return requiresCollateral && !ownershipStatus;
                        case "Agent":
                            return !appAgent.trim();
                        case "2x2 Photo":
                            return photo2x2.length === 0;
                        case "Document Upload":
                            return uploadedFiles.length === 0;
                        default:
                            return true;
                    }
                });

                return next.length === prev.length ? prev : next;
            });
        }, [
            appName,
            appDob,
            appContact,
            appEmail,
            appMarital,
            appSpouseName,
            appSpouseOccupation,
            appAddress,
            appLoanPurpose,
            selectedLoan,
            sourceOfIncome,
            appTypeBusiness,
            appBusinessName,
            appDateStarted,
            appBusinessLoc,
            appMonthlyIncome,
            appOccupation,
            appEmploymentStatus,
            appCompanyName,
            appReferences,
            requiresCollateral,
            collateralType,
            collateralValue,
            collateralDescription,
            ownershipStatus,
            appAgent,
            photo2x2,
            uploadedFiles,
        ]);

    useEffect(() => {
        if (appAgent.trim()) {
            setAgentMissingError(false);
=======
  // Progress tracking effect
  useEffect(() => {
    if (!onProgressUpdate) return;

    const progress: Record<string, boolean> = {
      basicInfo: false,
      income: false,
      collateral: false,
      references: false,
      agent: false,
      loanDetails: false,
      photo: false,
      documents: false,
    };

    // Check basic information completion
    const basicInfoComplete = !!(
      appName.trim() &&
      appDob &&
      appContact.trim() &&
      appEmail.trim() &&
      appMarital &&
      appAddress.trim() &&
      (appMarital !== "Married" || (appSpouseName.trim() && appSpouseOccupation.trim()))
    );
    progress.basicInfo = basicInfoComplete;

    // Check income information completion
    const incomeComplete = !!(
      sourceOfIncome &&
      appMonthlyIncome > 0 &&
      (
        (sourceOfIncome === "business" && appTypeBusiness.trim() && appBusinessName.trim() && appDateStarted && appBusinessLoc.trim()) ||
        (sourceOfIncome !== "business" && appOccupation.trim() && appEmploymentStatus.trim() && appCompanyName.trim())
      )
    );
    progress.income = incomeComplete;

    // Check references completion
    const referencesComplete = appReferences.every(ref => 
      ref.name.trim() && ref.contact.trim() && ref.relation.trim()
    );
    progress.references = referencesComplete;

    // Check collateral completion (only if required)
    const collateralComplete = !requiresCollateral || !!(
      collateralType &&
      collateralValue > 0 &&
      collateralDescription.trim() &&
      ownershipStatus
    );
    progress.collateral = collateralComplete;

    // Check agent completion
    const agentComplete = !!appAgent.trim();
    progress.agent = agentComplete;

    // Check loan details completion
    const loanDetailsComplete = !!(appLoanPurpose.trim() && selectedLoan);
    progress.loanDetails = loanDetailsComplete;

    // Check photo completion
    const photoComplete = photo2x2.length > 0;
    progress.photo = photoComplete;

    // Check documents completion
    const documentsComplete = uploadedFiles.length >= requiredDocumentsCount;
    progress.documents = documentsComplete;

    onProgressUpdate(progress);
  }, [
    appName, appDob, appContact, appEmail, appMarital, appSpouseName, appSpouseOccupation, appAddress,
    sourceOfIncome, appTypeBusiness, appBusinessName, appDateStarted, appBusinessLoc, appMonthlyIncome,
    appOccupation, appEmploymentStatus, appCompanyName, appReferences,
    requiresCollateral, collateralType, collateralValue, collateralDescription, ownershipStatus,
    appAgent, appLoanPurpose, selectedLoan, photo2x2, uploadedFiles, requiredDocumentsCount, onProgressUpdate
  ]);

  return (
    <div className="relative max-w-4xl mx-auto py-0">
      {/* Progress Modal */}
      <SubmitProgressModal
        open={progressOpen}
        activeStep={activeStep}
        title={language === "en" ? "Submitting Application" : "Pag-submit sa Aplikasyon"}
        subtitle={
          language === "en"
            ? "Please keep this window open while we process your request."
            : "Palihog ayaw isira kini nga bintana samtang among gi-proseso ang imong hangyo."
>>>>>>> d4fff06 (Progress Tracker)
        }
    }, [appAgent]);

        const handleSubmit = async () => {
            // Validate required fields
            const missing: string[] = [];
            if (!appName.trim()) missing.push("Name");
            if (!appDob) missing.push("Date of Birth");
            if (!appContact.trim()) missing.push("Contact Number");
            if (!appEmail.trim()) missing.push("Email Address");
            if (!appMarital) missing.push("Marital Status");
            if (appMarital === "Married") {
                if (!appSpouseName.trim()) missing.push("Spouse Name");
                if (!appSpouseOccupation.trim()) missing.push("Spouse Occupation");
            }
            if (!appAddress.trim()) missing.push("Home Address");
            if (!appLoanPurpose.trim()) missing.push("Loan Purpose");
            if (!selectedLoan) missing.push("Loan Amount");
            if (!sourceOfIncome) missing.push("Source of Income");
            if (requiresCollateral) {
                if (!collateralType) missing.push("Collateral Type");
                if (!collateralValue) missing.push("Collateral Value");
                if (!collateralDescription) missing.push("Collateral Description");
                if (!ownershipStatus) missing.push("Ownership Status");
            }
            if (sourceOfIncome === "business") {
                if (!appTypeBusiness.trim()) missing.push("Type of Business");
                if (!appBusinessName.trim()) missing.push("Business Name");
                if (!appDateStarted) missing.push("Date Started");
                if (!appBusinessLoc.trim()) missing.push("Business Location");
                if (!appMonthlyIncome) missing.push("Monthly Income");
            } else if (sourceOfIncome) {
                if (!appOccupation.trim()) missing.push("Occupation");
                if (!appEmploymentStatus.trim()) missing.push("Employment Status");
                if (!appCompanyName.trim()) missing.push("Company Name");
                if (!appMonthlyIncome) missing.push("Monthly Income");
            }
            // References
            appReferences.forEach((ref, i) => {
                if (!ref.name.trim()) missing.push(`Reference ${i + 1} Name`);
                if (!ref.contact.trim()) missing.push(`Reference ${i + 1} Contact`);
                if (!ref.relation.trim()) missing.push(`Reference ${i + 1} Relationship`);
            });

            if (!appAgent.trim()) missing.push("Agent");
    setAgentMissingError(!appAgent.trim());

            // Uploads
            if (photo2x2.length === 0) missing.push("2x2 Photo");
            if (uploadedFiles.length === 0) missing.push("Document Upload");

            setMissingFields(missing);
            if (missing.length > 0) {
                setErrorMessage(
                    language === 'en'
                        ? 'Please complete all required fields before submitting.'
                        : 'Palihug isulod ang tanang kinahanglan nga detalye una sa pag-submit.'
                );
                setShowErrorModal(true);
                return;
            }
            // Open terms modal first; submission proceeds on accept
            setShowTermsModal(true);
        };

        // Actual submit logic after accepting terms
    const performSubmit = async () => {
            try {
        setIsSubmitting(true);
        setProgressOpen(true);
        setActiveStep(0); // Uploading documents
                const formData = new FormData();
                // ...existing code for appending fields...
                formData.append("appName", appName);
                formData.append("appDob", appDob);
                formData.append("appContact", appContact);
                formData.append("appEmail", appEmail);
                formData.append("appMarital", appMarital);
                formData.append("appChildren", String(appChildren));
                formData.append("appSpouseName", appSpouseName);
                formData.append("appSpouseOccupation", appSpouseOccupation);
                formData.append("appAddress", appAddress);
                formData.append("sourceOfIncome", sourceOfIncome);
                formData.append("appMonthlyIncome", String(appMonthlyIncome));
                if (sourceOfIncome === "business") {
                    formData.append("appTypeBusiness", appTypeBusiness.trim());
                    formData.append("appBusinessName", appBusinessName.trim());
                    formData.append("appDateStarted", appDateStarted);
                    formData.append("appBusinessLoc", appBusinessLoc.trim());
                } else {
                    formData.append("appOccupation", appOccupation.trim());
                    formData.append("appEmploymentStatus", appEmploymentStatus.trim());
                    formData.append("appCompanyName", appCompanyName.trim());
                }
                formData.append("appLoanPurpose", appLoanPurpose);
                if (selectedLoan) {
                    formData.append("appLoanAmount", String(selectedLoan.amount));
                    formData.append("appLoanTerms", String(selectedLoan.months));
                    formData.append("appInterest", String(selectedLoan.interest));
                }
                appReferences.forEach((ref, i) => {
                    formData.append(`appReferences[${i}][name]`, ref.name);
                    formData.append(`appReferences[${i}][contact]`, ref.contact);
                    formData.append(`appReferences[${i}][relation]`, ref.relation);
                });
                formData.append("appAgent", appAgent);
                if (requiresCollateral) {
                    formData.append("collateralType", collateralType);
                    formData.append("collateralValue", String(collateralValue));
                    formData.append("collateralDescription", collateralDescription);
                    formData.append("ownershipStatus", ownershipStatus);
                }
                uploadedFiles.forEach(file => formData.append("documents", file));
                // Move to processing step before requesting
                setActiveStep(1); // Processing application
                if (photo2x2[0]) formData.append("profilePic", photo2x2[0]);
                // Append consent metadata for audit trail
                formData.append('companyName', COMPANY_NAME);
                formData.append('termsAcceptedAt', new Date().toISOString());
                formData.append('termsVersion', TERMS_VERSION);
                formData.append('privacyVersion', PRIVACY_VERSION);
                formData.append('consentToTerms', 'true');
                // Start request and show waiting step while awaiting
                const resPromise = fetch(API_URL, { method: "POST", body: formData });
                setActiveStep(2); // Waiting for the server
                const res = await resPromise;
                const data = await res.json();
                if (res.ok) {
                    setLoanId(data.application?.applicationId || null);
                    setShowSuccessModal(true);
                } else {
                    // Show document upload error modal for specific error
                    if (data.error && data.error.toLowerCase().includes('supporting documents must be uploaded')) {
                        setDocumentUploadError(data.error);
                        setShowDocumentUploadErrorModal(true);
                    } else {
                        setDocumentUploadError(language === 'en' ? data.error : "Napakyas: " + data.error);
                        setShowDocumentUploadErrorModal(true);
                    }
                }
            } catch (error) {
                console.error(error);
                setDocumentUploadError(language === 'en' ? "An error occurred. Please try again." : "Adunay sayop. Palihug sulayi pag-usab.");
                setShowDocumentUploadErrorModal(true);
            } finally {
                setIsSubmitting(false);
                setProgressOpen(false);
                setActiveStep(0);
            }
        };

    // State for document upload error modal
    const [showDocumentUploadErrorModal, setShowDocumentUploadErrorModal] = useState(false);
    const [documentUploadError, setDocumentUploadError] = useState("");

    return (
    <div className="relative max-w-4xl mx-auto py-0">
        <SubmitProgressModal
            open={progressOpen}
            activeStep={activeStep}
            title={language === 'en' ? 'Submitting Application' : 'Pag-submit sa Aplikasyon'}
            subtitle={language === 'en' ? 'Please keep this window open while we process your request.' : 'Palihog ayaw isira kini nga bintana samtang among gi-proseso ang imong hangyo.'}
            steps={[
                language === 'en' ? 'Uploading documents' : 'Nag-upload sa mga dokumento',
                language === 'en' ? 'Processing application' : 'Nagproseso sa aplikasyon',
                language === 'en' ? 'Waiting for the server' : 'Naghulat sa server',
            ]}
            blockDismiss
        />
        {showDocumentUploadErrorModal && (
            <DocumentUploadErrorModal
                message={documentUploadError}
                onClose={() => setShowDocumentUploadErrorModal(false)}
            />
        )}
        <div className={`${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}>
        <BasicInformation
            language={language}
            appName={appName} setAppName={setAppName}
            appDob={appDob} setAppDob={setAppDob}
            appContact={appContact} setAppContact={setAppContact}
            appEmail={appEmail} setAppEmail={setAppEmail}
            appMarital={appMarital} setAppMarital={setAppMarital}
            appChildren={appChildren} setAppChildren={setAppChildren}
            appSpouseName={appSpouseName} setAppSpouseName={setAppSpouseName}
            appSpouseOccupation={appSpouseOccupation} setAppSpouseOccupation={setAppSpouseOccupation}
            appAddress={appAddress} setAppAddress={setAppAddress}
            missingFields={missingFields}
        />

        <SourceOfIncome
            language={language}
            sourceOfIncome={sourceOfIncome} setSourceOfIncome={setSourceOfIncome}
            appTypeBusiness={appTypeBusiness} setAppTypeBusiness={setAppTypeBusiness}
            appBusinessName={appBusinessName} setAppBusinessName={setAppBusinessName}
            appDateStarted={appDateStarted} setAppDateStarted={setAppDateStarted}
            appBusinessLoc={appBusinessLoc} setAppBusinessLoc={setAppBusinessLoc}
            appMonthlyIncome={appMonthlyIncome} setAppMonthlyIncome={setAppMonthlyIncome}
            appOccupation={appOccupation} setAppOccupation={setAppOccupation}
            occupationError={occupationError} setOccupationError={setOccupationError}
            appEmploymentStatus={appEmploymentStatus} setAppEmploymentStatus={setAppEmploymentStatus}
            appCompanyName={appCompanyName} setAppCompanyName={setAppCompanyName}
            missingFields={missingFields}
        />

            <References
                language={language}
                appReferences={appReferences}
                setAppReferences={setAppReferences}
                appContact={appContact}
                appName={appName}
                missingFields={missingFields}
            />
        
        <AgentDropdown
                        language={language}
                        appAgent={appAgent}
                        setAppAgent={setAppAgent}
                        missingError={agentMissingError}
                    />

        {requiresCollateral && (
            <CollateralInformation
            language={language}
            collateralType={collateralType} setCollateralType={setCollateralType}
            collateralValue={collateralValue} setCollateralValue={setCollateralValue}
            collateralDescription={collateralDescription} setCollateralDescription={setCollateralDescription}
            ownershipStatus={ownershipStatus} setOwnershipStatus={setOwnershipStatus}
            collateralTypeOptions={collateralTypeOptions}
            missingFields={missingFields}
            />
        )}

        <LoanDetails
            language={language}
            loanType={loanTypeParam}
            appLoanPurpose={appLoanPurpose} setAppLoanPurpose={setAppLoanPurpose}
            onLoanSelect={(loan) => setSelectedLoan(loan)}
            missingFields={missingFields}
        />

        <UploadSection
            language={language}
            photo2x2={photo2x2}
            documents={uploadedFiles}
            handleProfileChange={async (e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                if (files.length === 0) return;
                const file = files[0];
                // Enforce single upload by replacing state
                // Validate type
                const allowed = ["image/jpeg", "image/png"];
                if (!allowed.includes(file.type)) {
                    setDocumentUploadError(
                        language === "en"
                            ? "Only JPG and PNG are allowed for 2x2 photo."
                            : "JPG ug PNG lang ang madawat para sa 2x2 nga litrato."
                    );
                    setShowDocumentUploadErrorModal(true);
                    e.target.value = "";
                    return;
                }
                // Validate size < 2MB
                if (file.size > 2 * 1024 * 1024) {
                    setDocumentUploadError(
                        language === "en"
                            ? "2x2 photo must be less than 2MB."
                            : "Ang 2x2 nga litrato kinahanglan dili molapas og 2MB."
                    );
                    setShowDocumentUploadErrorModal(true);
                    e.target.value = "";
                    return;
                }
                // Validate dimensions (square)
                try {
                    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                        const img = new Image();
                        const objectUrl = URL.createObjectURL(file);
                        img.onload = () => {
                            URL.revokeObjectURL(objectUrl);
                            resolve({ width: img.width, height: img.height });
                        };
                        img.onerror = () => {
                            URL.revokeObjectURL(objectUrl);
                            reject(new Error('image-load-error'));
                        };
                        img.src = objectUrl;
                    });
                    if (dims.width !== dims.height) {
                        setDocumentUploadError(
                            language === "en"
                                ? "2x2 photo must be square (equal width and height)."
                                : "Ang 2x2 nga litrato kinahanglan square (parehas ang gilapdon ug gitas-on)."
                        );
                        setShowDocumentUploadErrorModal(true);
                        e.target.value = "";
                        return;
                    }
                } catch (err) {
                    setDocumentUploadError(
                        language === "en" ? "Failed to read image. Please try again." : "Napakyas sa pagbasa sa litrato. Palihug sulayi pag-usab."
                    );
                    setShowDocumentUploadErrorModal(true);
                    e.target.value = "";
                    return;
                }
                setPhoto2x2([file]);
            }}
            handleFileChange={(e) => {
                const input = e.target as HTMLInputElement;
                const files = input.files ? Array.from(input.files) : [];
                if (files.length === 0) return;
                setUploadedFiles(prev => {
                    const remaining = requiredDocumentsCount - prev.length;
                    // Already at or above the limit
                    if (remaining <= 0) {
                        setDocumentUploadError(
                            language === 'en'
                                ? `You can only upload up to ${requiredDocumentsCount} documents for this loan type.`
                                : `Hangtod ${requiredDocumentsCount} ka dokumento lang ang pwede i-upload para ani nga klase sa loan.`
                        );
                        setShowDocumentUploadErrorModal(true);
                        input.value = "";
                        return prev;
                    }

                    // Accept only up to remaining, drop the rest
                    const toAdd = files.slice(0, Math.max(0, remaining));
                    if (files.length > remaining) {
                        setDocumentUploadError(
                            language === 'en'
                                ? `Only ${remaining} more ${remaining === 1 ? 'document is' : 'documents are'} allowed (max ${requiredDocumentsCount}). Extra files were not added.`
                                : `${remaining} na lang ka ${remaining === 1 ? 'dokumento' : 'mga dokumento'} ang pwede (max ${requiredDocumentsCount}). Ang sobra wala gi-dugang.`
                        );
                        setShowDocumentUploadErrorModal(true);
                    }

                    input.value = ""; // allow selecting same files again later
                    return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
                });
            }}
            removeProfile={(index) => setPhoto2x2(prev => prev.filter((_, i) => i !== index))}
            removeDocument={(index) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
            missingFields={missingFields}
            requiredDocumentsCount={requiredDocumentsCount}
        />
        </div>
                        {showErrorModal && (
                            <ErrorModal
                                message={errorMessage}
                                onClose={() => setShowErrorModal(false)}
                            />
                        )}

        <div className={`mt-6 flex ${isMobile ? 'justify-center' : 'justify-end'}`}>
            <button
                onClick={isSubmitting ? undefined : handleSubmit}
                disabled={isSubmitting}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <ButtonDotsLoading label={language === 'en' ? 'Submitting' : 'Nag-submit'} />
                ) : (
                    language === "en" ? "Submit Application" : "Isumite ang Aplikasyon"
                )}
            </button>
        </div>

        {showTermsModal && (
            <TermsGateModal
                language={language}
                onCancel={() => setShowTermsModal(false)}
                onOpenTos={() => setShowTosContent(true)}
                onOpenPrivacy={() => setShowPrivacyContent(true)}
                tosRead={tosRead}
                privacyRead={privacyRead}
                onAccept={() => {
                    setShowTermsModal(false);
                    performSubmit();
                }}
            />
        )}
        {showTosContent && (
            <TermsContentModal language={language} onClose={() => setShowTosContent(false)} onReadComplete={() => setTosRead(true)} />
        )}
        {showPrivacyContent && (
            <PrivacyContentModal language={language} onClose={() => setShowPrivacyContent(false)} onReadComplete={() => setPrivacyRead(true)} />
        )}

        {showSuccessModal && (
            <SuccessModalWithAnimation
            language={language}
            loanId={loanId}
            onClose={() => setShowSuccessModal(false)}
            />
        )}
        </div>
    );
    }
