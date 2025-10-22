"use client";

import { useState } from "react";

interface UseFormSubmitProps {
  appName: string;
  appDob: string;
  appContact: string;
  appEmail: string;
  appMarital: string;
  appSpouseName: string;
  appSpouseOccupation: string;
  appAddress: string;
  appLoanPurpose: string;
  selectedLoan: any | null;
  sourceOfIncome: string;
  appTypeBusiness: string;
  appBusinessName: string;
  appDateStarted: string;
  appBusinessLoc: string;
  appMonthlyIncome: number;
  appOccupation: string;
  appEmploymentStatus: string;
  appCompanyName: string;
  appReferences: { name: string; contact: string; relation: string }[];
  requiresCollateral: boolean;
  collateralType: string;
  collateralValue: number;
  collateralDescription: string;
  ownershipStatus: string;
  appAgent: string;
  photo2x2: File[];
  uploadedFiles: File[];
  missingFields: string[];
  setMissingFields: (fields: string[]) => void;
  setAgentMissingError: (val: boolean) => void;
  API_URL: string;
  COMPANY_NAME: string;
  TERMS_VERSION: string;
  PRIVACY_VERSION: string;
  language: 'en' | 'ceb';
  onSuccess?: (loanId: string) => void;
  onError?: (errorMessage: string) => void;
}

export function useFormSubmit(props: UseFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // --- Validate required fields ---
  const handleSubmit = async () => {
    const missing: string[] = [];

    // Basic Info
    if (!props.appName.trim()) missing.push("Name");
    if (!props.appDob) missing.push("Date of Birth");
    if (!props.appContact.trim()) missing.push("Contact Number");
    if (!props.appEmail.trim()) missing.push("Email Address");
    if (!props.appMarital) missing.push("Marital Status");
    if (props.appMarital === "Married") {
      if (!props.appSpouseName.trim()) missing.push("Spouse Name");
      if (!props.appSpouseOccupation.trim()) missing.push("Spouse Occupation");
    }
    if (!props.appAddress.trim()) missing.push("Home Address");

    // Loan info
    if (!props.appLoanPurpose.trim()) missing.push("Loan Purpose");
    if (!props.selectedLoan) missing.push("Loan Amount");

    // Source of income
    if (!props.sourceOfIncome) missing.push("Source of Income");
    if (props.sourceOfIncome === "business") {
      if (!props.appTypeBusiness.trim()) missing.push("Type of Business");
      if (!props.appBusinessName.trim()) missing.push("Business Name");
      if (!props.appDateStarted) missing.push("Date Started");
      if (!props.appBusinessLoc.trim()) missing.push("Business Location");
      if (!props.appMonthlyIncome) missing.push("Monthly Income");
    } else if (props.sourceOfIncome) {
      if (!props.appOccupation.trim()) missing.push("Occupation");
      if (!props.appEmploymentStatus.trim()) missing.push("Employment Status");
      if (!props.appCompanyName.trim()) missing.push("Company Name");
      if (!props.appMonthlyIncome) missing.push("Monthly Income");
    }

    // References
    props.appReferences.forEach((ref, i) => {
      if (!ref.name.trim()) missing.push(`Reference ${i + 1} Name`);
      if (!ref.contact.trim()) missing.push(`Reference ${i + 1} Contact`);
      if (!ref.relation.trim()) missing.push(`Reference ${i + 1} Relationship`);
    });

    // Agent
    if (!props.appAgent.trim()) missing.push("Agent");
    props.setAgentMissingError(!props.appAgent.trim());

    // Collateral
    if (props.requiresCollateral) {
      if (!props.collateralType) missing.push("Collateral Type");
      if (!props.collateralValue) missing.push("Collateral Value");
      if (!props.collateralDescription) missing.push("Collateral Description");
      if (!props.ownershipStatus) missing.push("Ownership Status");
    }

    // Uploads
    if (props.photo2x2.length === 0) missing.push("2x2 Photo");
    if (props.uploadedFiles.length === 0) missing.push("Document Upload");

    props.setMissingFields(missing);
    return missing.length === 0;
  };

  // --- Perform submission ---
  const performSubmit = async () => {
    try {
      setIsSubmitting(true);
      setProgressOpen(true);
      setActiveStep(0); // Step 0: Preparing submission

      const formData = new FormData();
      formData.append("appName", props.appName);
      formData.append("appDob", props.appDob);
      formData.append("appContact", props.appContact);
      formData.append("appEmail", props.appEmail);
      formData.append("appMarital", props.appMarital);
      formData.append("appSpouseName", props.appSpouseName);
      formData.append("appSpouseOccupation", props.appSpouseOccupation);
      formData.append("appAddress", props.appAddress);
      formData.append("sourceOfIncome", props.sourceOfIncome);
      formData.append("appMonthlyIncome", String(props.appMonthlyIncome));

      if (props.sourceOfIncome === "business") {
        formData.append("appTypeBusiness", props.appTypeBusiness);
        formData.append("appBusinessName", props.appBusinessName);
        formData.append("appDateStarted", props.appDateStarted);
        formData.append("appBusinessLoc", props.appBusinessLoc);
      } else {
        formData.append("appOccupation", props.appOccupation);
        formData.append("appEmploymentStatus", props.appEmploymentStatus);
        formData.append("appCompanyName", props.appCompanyName);
      }

      formData.append("appLoanPurpose", props.appLoanPurpose);
      if (props.selectedLoan) {
        formData.append("appLoanAmount", String(props.selectedLoan.amount));
        formData.append("appLoanTerms", String(props.selectedLoan.months));
        formData.append("appInterest", String(props.selectedLoan.interest));
      }

      props.appReferences.forEach((ref, i) => {
        formData.append(`appReferences[${i}][name]`, ref.name);
        formData.append(`appReferences[${i}][contact]`, ref.contact);
        formData.append(`appReferences[${i}][relation]`, ref.relation);
      });

      formData.append("appAgent", props.appAgent);

      if (props.requiresCollateral) {
        formData.append("collateralType", props.collateralType);
        formData.append("collateralValue", String(props.collateralValue));
        formData.append("collateralDescription", props.collateralDescription);
        formData.append("ownershipStatus", props.ownershipStatus);
      }

      props.uploadedFiles.forEach(f => formData.append("documents", f));
      if (props.photo2x2[0]) formData.append("profilePic", props.photo2x2[0]);

      // Consent info
      formData.append('companyName', props.COMPANY_NAME);
      formData.append('termsAcceptedAt', new Date().toISOString());
      formData.append('termsVersion', props.TERMS_VERSION);
      formData.append('privacyVersion', props.PRIVACY_VERSION);
      formData.append('consentToTerms', 'true');

      setActiveStep(1); // Step 1: Uploading documents

      const res = await fetch(props.API_URL, { method: "POST", body: formData });

      setActiveStep(2); // Step 2: Waiting for server response
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      // Extract loanId from response (check both possible structures)
      const loanId = data.application?.applicationId || data.applicationId;

      // Trigger success callback
      if (props.onSuccess && loanId) props.onSuccess(loanId);

      return { ok: true, data };
    } catch (error: any) {
      console.error(error);
      if (props.onError) {
        props.onError(error?.message || "An error occurred. Please try again.");
      }
      return { ok: false, error };
    } finally {
      setIsSubmitting(false);
      setProgressOpen(false);
      setActiveStep(0);
    }
  };

  return { handleSubmit, performSubmit, isSubmitting, progressOpen, activeStep };
}
