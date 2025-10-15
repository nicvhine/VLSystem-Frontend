"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formToJSON } from "axios";
import TermsGateModal from "@/app/commonComponents/modals/termsPrivacy/TermsGateModal";
import TermsContentModal from "@/app/commonComponents/modals/termsPrivacy/TermsContentModal";
import PrivacyContentModal from "@/app/commonComponents/modals/termsPrivacy/PrivacyContentModal";

// Form section components
import BasicInformation from "./sections/basicInformation";
import SourceOfIncome from "./sections/sourceOfIncome";
import References from "./sections/references";
import CollateralInformation from "./sections/collateral";
import LoanDetails from "./sections/loanDetails";
import UploadSection from "./sections/uploadSection";
import AgentDropdown from "./sections/agent";

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
        <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition text-2xl"
                    aria-label="Close"
                >×</button>
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">{header}</h3>
                    <p className="text-gray-700 mb-4 text-sm">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors text-sm"
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
    return (
        <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition text-2xl"
                    aria-label="Close"
                >×</button>
                <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2">Document Upload Error</h3>
                    <p className="text-gray-700 mb-4 text-sm">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-semibold transition-colors text-sm"
                    >Close</button>
                </div>
            </div>
        </div>
    );
}


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
        onClose();
        router.push('/');
    };
    

    return (
        <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition text-2xl"
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {language === 'en' ? 'Application Submitted Successfully!' : 'Malampusong Napasa ang Aplikasyon!'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {language === 'en'
                            ? 'Your loan application has been received and is being processed.'
                            : 'Nadawat na ang imong aplikasyon ug gi-proseso na.'}
                    </p>
                    {loanId && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">
                                {language === 'en' ? 'Your Application ID:' : 'Imong Application ID:'}
                            </p>
                            <p className="text-lg font-semibold text-red-600">{loanId}</p>
                        </div>
                    )}
                    <span className="block text-xs text-gray-500 mb-6">
                        {language === 'en'
                            ? 'We will soon notify you for the next step of your application through your provided contact details. Stay tuned for the updates.'
                            : 'Amo kang pahibaw-an sa sunod nga lakang sa imong aplikasyon pinaagi sa imong gihatag nga contact details. Pabilin sa pagpaminaw para sa mga update.'}
                    </span>
                    <button
                        onClick={handleClose}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
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
    const API_URL = `http://localhost:3001/loan-applications/apply/${loanTypeParam}`;

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
                if (photo2x2[0]) formData.append("profilePic", photo2x2[0]);
                // Append consent metadata for audit trail
                formData.append('companyName', COMPANY_NAME);
                formData.append('termsAcceptedAt', new Date().toISOString());
                formData.append('termsVersion', TERMS_VERSION);
                formData.append('privacyVersion', PRIVACY_VERSION);
                formData.append('consentToTerms', 'true');
                const res = await fetch(API_URL, { method: "POST", body: formData });
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
            }
        };

    // State for document upload error modal
    const [showDocumentUploadErrorModal, setShowDocumentUploadErrorModal] = useState(false);
    const [documentUploadError, setDocumentUploadError] = useState("");

    return (
    <div className="max-w-4xl mx-auto py-0">
        {showDocumentUploadErrorModal && (
            <DocumentUploadErrorModal
                message={documentUploadError}
                onClose={() => setShowDocumentUploadErrorModal(false)}
            />
        )}
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
            handleProfileChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setPhoto2x2(prev => [...prev, ...files]);
            }}
            handleFileChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setUploadedFiles(prev => [...prev, ...files]);
            }}
            removeProfile={(index) => setPhoto2x2(prev => prev.filter((_, i) => i !== index))}
            removeDocument={(index) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
            missingFields={missingFields}
        />
                        {showErrorModal && (
                            <ErrorModal
                                message={errorMessage}
                                onClose={() => setShowErrorModal(false)}
                            />
                        )}

        <div className={`mt-6 flex ${isMobile ? 'justify-center' : 'justify-end'}`}>
            <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
            >
                {language === "en" ? "Submit Application" : "Isumite ang Aplikasyon"}
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
