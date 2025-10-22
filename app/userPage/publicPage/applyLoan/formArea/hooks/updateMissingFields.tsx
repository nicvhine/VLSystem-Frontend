import { useEffect } from "react";

interface UpdateMissingFieldsParams {
    appName: string;
    appDob: string;
    appContact: string;
    appEmail: string;
    appMarital: string;
    appSpouseName: string;
    appSpouseOccupation: string;
    appAddress: string;
    appLoanPurpose: string;
    selectedLoan: any;
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
}

/**
 * Hook to automatically update the missing fields array based on current form values.
 */
export function useUpdateMissingFields(params: UpdateMissingFieldsParams) {
    const {
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
        missingFields,
        setMissingFields
    } = params;

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
        setMissingFields
    ]);
}
