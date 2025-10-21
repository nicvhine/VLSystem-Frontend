import translations from "../../../commonComponents/translation";

export function getRequirements(type: string, language: 'en' | 'ceb') {
    const t = translations.requirementsTranslation[language];
    
    switch (type) {
        case t.t1: // Regular Loan Without Collateral
            return [
                t.t4, // Valid Government-issued ID
                t.t5, // Proof of Income
                t.t6, // Certificate of Employment / Business Permit
                t.t7, // Proof of Billing
            ];

        case t.t2: // Regular Loan With Collateral
            return [
                t.t4, // Valid Government-issued ID
                t.t5, // Proof of Income
                t.t6, // Certificate of Employment / Business Permit
                t.t7, // Proof of Billing
                t.t8, // Collateral Document
                t.t9, // Appraisal Report of Collateral
            ];

        case t.t3: // Open-Term Loan
            return [
                t.t4, // Valid Government-issued ID
                t.t5, // Proof of Income
                t.t6, // Certificate of Employment / Business Permit
                t.t7, // Proof of Billing
                t.t8, // Collateral Document
                t.t9, // Appraisal Report of Collateral
            ];

        default:
            return [];
    }
}