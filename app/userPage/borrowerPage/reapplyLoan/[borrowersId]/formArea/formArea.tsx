"use client";

import { useState, useEffect } from "react";
import { ButtonDotsLoading, SubmitProgressModal } from "@/app/commonComponents/utils/loading";
import { useRouter } from "next/navigation";

import TermsGateModal from "@/app/commonComponents/modals/termsPrivacy/TermsGateModal";
import TermsContentModal from "@/app/commonComponents/modals/termsPrivacy/TermsContentModal";
import PrivacyContentModal from "@/app/commonComponents/modals/termsPrivacy/PrivacyContentModal";

import BasicInformation from "./sections/basicInformation";
import SourceOfIncome from "./sections/sourceOfIncome";
import References from "./sections/references";
import CollateralInformation from "./sections/collateral";
import LoanDetails from "./sections/loanDetails";
import UploadSection from "./sections/uploadSection";
import AgentDropdown from "./sections/agent";

import { ErrorModal, DocumentUploadErrorModal } from "./modals/errorModal";
import SuccessModalWithAnimation from "./modals/successModal";

import { useUpdateMissingFields } from "./hooks/updateMissingFields";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { handleFileChange, handleProfileChange, removeDocument, removeProfile } from "./function";
import { useSectionProgress } from "./hooks/useSectionProgress";

interface FormAreaProps {
  loanType: string;
  language: "en" | "ceb";
  isMobile?: boolean;
  onProgressUpdate?: (progress: {
    done: Record<string, boolean>;
    missingCounts: Record<string, number>;
    missingDetails: Record<string, string[]>;
  }) => void;
  borrowersId?: string | undefined;
}

interface ProfilePicData {
  fileName?: string;
  filePath?: string | { url: string };
  mimeType?: string;
  secure_url?: string;
  url?: string;
}

export default function FormArea({ loanType, language, isMobile, onProgressUpdate, borrowersId }: FormAreaProps) {
  const COMPANY_NAME = "Vistula Lending Corporation";
  const TERMS_VERSION = "1.0-draft";
  const PRIVACY_VERSION = "1.0-draft";

  const router = useRouter();

  const [loanId, setLoanId] = useState<string | null>(null);
  const [isPrefilled, setIsPrefilled] = useState(false);
  // borrowersId provided by parent page via route params

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const loanTypeParam =
    loanType === (language === "en" ? "Regular Loan With Collateral" : "Regular nga Pahulam (Naay Kolateral)")
      ? "with"
      : loanType === (language === "en" ? "Regular Loan Without Collateral" : "Regular nga Pahulam (Walay Kolateral)")
      ? "without"
      : "open-term";

  const requiresCollateral = loanTypeParam === "with" || loanTypeParam === "open-term";
  const requiredDocumentsCount = loanTypeParam === "with" || loanTypeParam === "open-term" ? 6 : 4;
  const requires2x2 = true;
  const API_URL = `http://localhost:3001/loan-applications/apply/${loanTypeParam}`;

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
    { name: "", contact: "", relation: "" },
  ]);

  // Agent
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
  // Previous uploads metadata (do not auto-fetch blobs). User must opt-in to "Use previous".
  const [prevProfilePicUrl, setPrevProfilePicUrl] = useState<string | null>(null);
  const [prevDocumentsMeta, setPrevDocumentsMeta] = useState<any[]>([]);

  // Compute section progress
  useSectionProgress({
    missingFields,
    photo2x2,
    requires2x2,
    appAgent,
    onProgressUpdate,
  });

  // Terms/Privacy Modal
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTosContent, setShowTosContent] = useState(false);
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [tosRead, setTosRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);

  // Document upload error modal
  const [showDocumentUploadErrorModal, setShowDocumentUploadErrorModal] = useState(false);
  const [documentUploadError, setDocumentUploadError] = useState("");

  // Hooks
  useUpdateMissingFields({
    appName, appDob, appContact, appEmail, appMarital, appSpouseName, appSpouseOccupation, appAddress,
    appLoanPurpose, selectedLoan, sourceOfIncome, appTypeBusiness, appBusinessName, appDateStarted,
    appBusinessLoc, appMonthlyIncome, appOccupation, appEmploymentStatus, appCompanyName, appReferences,
    requiresCollateral, requires2x2, collateralType, collateralValue, collateralDescription, ownershipStatus, appAgent,
    photo2x2, uploadedFiles, missingFields, setMissingFields,
  });

  const { handleSubmit, performSubmit, isSubmitting, progressOpen, activeStep, uploadProgress } = useFormSubmit({
    appName, appDob, appContact, appEmail, appMarital, appSpouseName, appSpouseOccupation, appAddress,
    appLoanPurpose, selectedLoan, sourceOfIncome, appTypeBusiness, appBusinessName, appDateStarted,
    appBusinessLoc, appMonthlyIncome, appOccupation, appEmploymentStatus, appCompanyName, appReferences,
    requiresCollateral, collateralType, collateralValue, collateralDescription, ownershipStatus, appAgent,
    photo2x2, uploadedFiles, missingFields, setMissingFields, setAgentMissingError,
    API_URL, COMPANY_NAME, TERMS_VERSION, PRIVACY_VERSION, language
  });

  useEffect(() => {
    // appAgent can be a string or object (from prefill). Coerce to string safely before trim.
    const rawAgent = appAgent ?? "";
    let agentString = "";
    if (typeof rawAgent === "string") agentString = rawAgent;
    else if (rawAgent && typeof rawAgent === "object") agentString = (rawAgent as any).agentId ?? "";
    else agentString = String(rawAgent || "");
    if (agentString.includes("[object") || agentString.toLowerCase() === "null" || agentString.toLowerCase() === "undefined") agentString = "";
    if (agentString.trim()) setAgentMissingError(false);
  }, [appAgent]);

  // Fetch latest application for this borrower and prefill when loan type is selected
  useEffect(() => {
    async function fetchAndPrefill() {
      if (!borrowersId) return;
      try {
        const res = await fetch(`http://localhost:3001/borrowers/${borrowersId}`);
        if (!res.ok) return;
        const data = await res.json();
        const latest = data?.latestApplication;
        if (!latest) {
          setIsPrefilled(false);
          return;
        }

        // Map backend application fields to form state
        setAppName(latest.appName || "");
        setAppDob(latest.appDob || "");
        setAppContact(latest.appContact || "");
        setAppEmail(latest.appEmail || "");
        setAppMarital(latest.appMarital || "");
        setAppChildren(latest.appChildren || 0);
        setAppSpouseName(latest.appSpouseName || "");
        setAppSpouseOccupation(latest.appSpouseOccupation || "");
        setAppAddress(latest.appAddress || "");

        setSourceOfIncome(latest.sourceOfIncome || "");
        setAppTypeBusiness(latest.appTypeBusiness || "");
        setAppBusinessName(latest.appBusinessName || "");
        setAppDateStarted(latest.appDateStarted || "");
        setAppBusinessLoc(latest.appBusinessLoc || "");
        setAppMonthlyIncome(latest.appMonthlyIncome || 0);
        setAppOccupation(latest.appOccupation || "");
        setAppEmploymentStatus(latest.appEmploymentStatus || "");
        setAppCompanyName(latest.appCompanyName || "");

        setAppReferences(latest.appReferences || [
          { name: "", contact: "", relation: "" },
          { name: "", contact: "", relation: "" },
          { name: "", contact: "", relation: "" },
        ]);

        // Normalize prefetched agent: backend may return an agent object or an agentId string.
        // AgentDropdown expects an agentId string as the select value. Ensure we set that.
        const resolvedAgent = latest.appAgent && typeof latest.appAgent === "object"
          ? (latest.appAgent.agentId ?? "")
          : (typeof latest.appAgent === "string" ? latest.appAgent : "");
        setAppAgent(resolvedAgent);

        setCollateralType(latest.collateralType || "");
        setCollateralValue(latest.collateralValue || 0);
        setCollateralDescription(latest.collateralDescription || "");
        setOwnershipStatus(latest.ownershipStatus || "");

  // Do NOT prefill loan selection or purpose for reapply — borrower should choose these anew.

        // Do NOT auto-fetch previous file blobs. Instead store metadata and let the user opt-in
        // to "Use previous" which will fetch the blob on demand.
        let resolvedUrl: string | null = null;
      if (latest.profilePic) {
        if (typeof latest.profilePic === "string") {
          resolvedUrl = latest.profilePic;
        } else if (typeof latest.profilePic === "object") {
          const filePath = latest.profilePic.filePath;

          if (typeof filePath === "string") {
            resolvedUrl = filePath;
          } else if (
            filePath &&
            typeof filePath === "object" &&
            typeof filePath.url === "string"
          ) {
            resolvedUrl = filePath.url;
          } else if (latest.profilePic.secure_url) {
            resolvedUrl = latest.profilePic.secure_url;
          }
        }
      }
      
        // store resolved profile pic URL (may be null)
        setPrevProfilePicUrl(resolvedUrl);
        setPrevDocumentsMeta(Array.isArray(latest.documents) ? latest.documents : []);

        setIsPrefilled(true);
      } catch (err) {
        console.error("Error fetching latest application for prefill:", err);
      }
    }

    // Trigger prefill when loan type param changes (borrower selected a loan type)
    if (loanTypeParam) fetchAndPrefill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanTypeParam, borrowersId]);

  // Helper: fetch image blob, validate (size + optional square), and return File
  async function fetchImageAsFileWithValidation(url: string, opts?: { maxBytes?: number; requireSquare?: boolean }) {
    const { maxBytes = 2 * 1024 * 1024, requireSquare = true } = opts || {};
    try {
      // Try fetching including credentials in case the file URL requires auth cookies
      let resp: Response | null = null;
      try {
        resp = await fetch(url, { credentials: 'include' });
      } catch (e) {
        // network error (CORS or other). Try a plain fetch as a fallback.
        try {
          resp = await fetch(url);
        } catch (e2) {
          throw new Error('Network error while fetching image (possible CORS or auth required)');
        }
      }

      if (!resp || !resp.ok) throw new Error('Failed to fetch image (non-200 response)');
      const blob = await resp.blob();
      if (blob.size > maxBytes) throw new Error('Image too large');

      // quick sanity: ensure we actually received an image
      if (!blob.type.startsWith('image/')) throw new Error('Fetched resource is not an image');

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        const objectUrl = URL.createObjectURL(blob);
        i.onload = () => { URL.revokeObjectURL(objectUrl); resolve(i); };
        i.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('image-load-error')); };
        i.src = objectUrl;
      });
      if (requireSquare && img.width !== img.height) throw new Error('Image must be square');

      let filename = url.split('/').pop() || 'photo2x2';
      // ensure file has an extension matching the mime type
      if (!filename.includes('.') && blob.type) {
        const ext = blob.type.split('/')[1] || 'jpg';
        filename = `${filename}.${ext}`;
      }
      const file = new File([blob], filename, { type: blob.type });
      return { ok: true as const, file };
    } catch (err: any) {
      return { ok: false as const, error: err.message || String(err) };
    }
  }

  // Called by UploadSection when user clicks "Use previous" for profile pic
  async function handleUsePreviousProfile() {
    if (!prevProfilePicUrl) return { ok: false, error: 'No previous profile URL' };
    const res = await fetchImageAsFileWithValidation(prevProfilePicUrl);
    if (res.ok) {
      setPhoto2x2([res.file]);
      // remove previous preview to reflect it's been consumed
      setPrevProfilePicUrl(null);
      return { ok: true };
    } else {
      setDocumentUploadError(res.error || 'Failed to fetch previous 2x2');
      setShowDocumentUploadErrorModal(true);
      return res;
    }
  }
  

  // Called by UploadSection when user clicks "Use" for a previous document at index
  async function handleUsePreviousDocument(index: number) {
    const doc = prevDocumentsMeta[index];
    if (!doc || !doc.filePath) return { ok: false, error: 'No previous document' };
    try {
      const resp = await fetch(doc.filePath);
      if (!resp.ok) throw new Error('Failed to fetch document');
      const blob = await resp.blob();
      const name = doc.fileName || (doc.filePath.split('/').pop() || 'document');
      const type = doc.mimeType || blob.type || 'application/octet-stream';
      const file = new File([blob], name, { type });
      setUploadedFiles(prev => [...prev, file]);
      // remove from previous meta list
      setPrevDocumentsMeta(prev => prev.filter((_, i) => i !== index));
      return { ok: true };
    } catch (err: any) {
      console.warn('Failed to fetch previous document', err);
      setDocumentUploadError(err.message || 'Failed to fetch document');
      setShowDocumentUploadErrorModal(true);
      return { ok: false, error: err.message || String(err) };
    }
  }

  return (
    <div className="relative max-w-4xl mx-auto py-0">
      {/* Progress Modal */}
      <SubmitProgressModal
        open={progressOpen}
        activeStep={activeStep}
        uploadProgress={uploadProgress}
        title={language === "en" ? "Submitting Application" : "Pag-submit sa Aplikasyon"}
        subtitle={
          language === "en"
            ? "Please keep this window open while we process your request."
            : "Palihog ayaw isira kini nga bintana samtang among gi-proseso ang imong hangyo."
        }
        steps={[
          language === "en" ? "Uploading documents" : "Nag-upload sa mga dokumento",
          language === "en" ? "Processing application" : "Nagproseso sa aplikasyon",
          language === "en" ? "Waiting for the server" : "Naghulat sa server",
        ]}
        blockDismiss
      />

      {/* Document upload error */}
      {showDocumentUploadErrorModal && (
        <DocumentUploadErrorModal
          message={documentUploadError}
          onClose={() => setShowDocumentUploadErrorModal(false)}
        />
      )}

      <div className={`${isSubmitting ? "pointer-events-none opacity-60" : ""}`}>
        {/* Form Sections */}
        <div id="basicInfo">
          <BasicInformation
            language={language} appName={appName} setAppName={setAppName} appDob={appDob} setAppDob={setAppDob}
            appContact={appContact} setAppContact={setAppContact} appEmail={appEmail} setAppEmail={setAppEmail}
            appMarital={appMarital} setAppMarital={setAppMarital} appChildren={appChildren} setAppChildren={setAppChildren}
            appSpouseName={appSpouseName} setAppSpouseName={setAppSpouseName} appSpouseOccupation={appSpouseOccupation}
            setAppSpouseOccupation={setAppSpouseOccupation} appAddress={appAddress} setAppAddress={setAppAddress}
            missingFields={missingFields}
            borrowersId={borrowersId || ''}
            isPrefilled={isPrefilled}
          />
        </div>

        <div id="income">
          <SourceOfIncome
            language={language} sourceOfIncome={sourceOfIncome} setSourceOfIncome={setSourceOfIncome}
            appTypeBusiness={appTypeBusiness} setAppTypeBusiness={setAppTypeBusiness} appBusinessName={appBusinessName}
            setAppBusinessName={setAppBusinessName} appDateStarted={appDateStarted} setAppDateStarted={setAppDateStarted}
            appBusinessLoc={appBusinessLoc} setAppBusinessLoc={setAppBusinessLoc} appMonthlyIncome={appMonthlyIncome}
            setAppMonthlyIncome={setAppMonthlyIncome} appOccupation={appOccupation} setAppOccupation={setAppOccupation}
            occupationError={occupationError} setOccupationError={setOccupationError}
            appEmploymentStatus={appEmploymentStatus} setAppEmploymentStatus={setAppEmploymentStatus}
            appCompanyName={appCompanyName} setAppCompanyName={setAppCompanyName} missingFields={missingFields}
          />
        </div>

        <div id="references">
          <References language={language} appReferences={appReferences} setAppReferences={setAppReferences}
            appContact={appContact} appName={appName} missingFields={missingFields} />
        </div>

        <div id="agent">
          <AgentDropdown language={language} appAgent={appAgent} setAppAgent={setAppAgent} missingError={agentMissingError} />
        </div>

        {requiresCollateral && (
          <div id="collateral">
            <CollateralInformation
              language={language} collateralType={collateralType} setCollateralType={setCollateralType}
              collateralValue={collateralValue} setCollateralValue={setCollateralValue}
              collateralDescription={collateralDescription} setCollateralDescription={setCollateralDescription}
              ownershipStatus={ownershipStatus} setOwnershipStatus={setOwnershipStatus}
              collateralTypeOptions={collateralTypeOptions} missingFields={missingFields}
            />
          </div>
        )}

        <div id="loanDetails">
          <LoanDetails
            language={language} loanType={loanTypeParam} appLoanPurpose={appLoanPurpose} setAppLoanPurpose={setAppLoanPurpose}
            onLoanSelect={(loan) => setSelectedLoan(loan)} missingFields={missingFields}
          />
        </div>

        <div id="photo2x2_and_documents">
          <UploadSection
            language={language} photo2x2={photo2x2} documents={uploadedFiles}
            handleProfileChange={(e) =>
              handleProfileChange(e, setPhoto2x2, language, setDocumentUploadError, setShowDocumentUploadErrorModal)
            }
            handleFileChange={(e) =>
              handleFileChange(e, uploadedFiles, setUploadedFiles, requiredDocumentsCount, language,
                setDocumentUploadError, setShowDocumentUploadErrorModal)
            }
            removeProfile={() => removeProfile(setPhoto2x2)}
            removeDocument={(index) => removeDocument(index, uploadedFiles, setUploadedFiles)}
            missingFields={missingFields} requiredDocumentsCount={requiredDocumentsCount}
            previousProfileUrl={prevProfilePicUrl}
            previousDocuments={prevDocumentsMeta}
            removePreviousProfile={() => setPrevProfilePicUrl(null)}
            removePreviousDocument={(index: number) => setPrevDocumentsMeta(prev => prev.filter((_, i) => i !== index))}
            onUsePreviousProfile={handleUsePreviousProfile}
            onUsePreviousDocument={handleUsePreviousDocument}
          />
        </div>
      </div>

      {showErrorModal && <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />}

      {/* Submit Button */}
      <div className={`mt-6 flex ${isMobile ? "justify-center" : "justify-end"}`}>
        <button
          onClick={async () => {
            if (isSubmitting) return;
            const valid = await handleSubmit();
            if (!valid) {
              setErrorMessage(
                language === "en"
                  ? "Please complete all required fields before submitting."
                  : "Palihug isulod ang tanang kinahanglan nga detalye una sa pag-submit."
              );
              setShowErrorModal(true);
              return;
            }
            setShowTermsModal(true);
          }}
          disabled={isSubmitting}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <ButtonDotsLoading label={language === "en" ? "Submitting" : "Nag-submit"} />
            : language === "en" ? "Submit Application" : "Isumite ang Aplikasyon"}
        </button>
      </div>

      {/* Terms / Privacy Modals */}
      {showTermsModal && (
        <TermsGateModal
          language={language}
          onCancel={() => setShowTermsModal(false)}
          onOpenTos={() => setShowTosContent(true)}
          onOpenPrivacy={() => setShowPrivacyContent(true)}
          tosRead={tosRead} privacyRead={privacyRead}
          onAccept={async () => {
            setShowTermsModal(false);
            try {
              const result = await performSubmit();
              if (result.ok && result.data.application?.applicationId) {
                setLoanId(result.data.application.applicationId);
                setShowSuccessModal(true);
              } else {
                setErrorMessage(result.error?.message || "Submission failed");
                setShowErrorModal(true);
              }
            } catch (err: any) {
              setErrorMessage(err.message || "Submission failed");
              setShowErrorModal(true);
            }
          }}
        />
      )}

      {showTosContent && (
        <TermsContentModal
          language={language}
          onClose={() => setShowTosContent(false)}
          onReadComplete={() => setTosRead(true)}
        />
      )}
      {showPrivacyContent && (
        <PrivacyContentModal
          language={language}
          onClose={() => setShowPrivacyContent(false)}
          onReadComplete={() => setPrivacyRead(true)}
        />
      )}

      {showSuccessModal && (
        <SuccessModalWithAnimation
          language={language} loanId={loanId}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
