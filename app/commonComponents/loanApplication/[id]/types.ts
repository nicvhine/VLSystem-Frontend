export interface CharacterReference {
    name: string;
    contact: string;
    relation: string;
  }
  
  export interface Application {
    applicationId: string;
    loanType: string;
    status: string;
    interviewDate?: string;
    interviewTime?: string;
    documents?: { fileName: string; filePath: string; mimeType: string }[];
    appName?: string;
    appDob?: string;
    appContact?: string;
    appEmail?: string;
    appMarital?: string;
    appSpouseName?: string;
    appSpouseOccupation?: string;
    appChildren?: number;
    appAddress?: string;
    sourceOfIncome?: string;
    appTypeBusiness?: string;
    appBusinessName?: string;
    appDateStarted?: string;
    appBusinessLoc?: string;
    appMonthlyIncome?: number;
    appEmploymentStatus?: string;
    appOccupation?: string;
    appCompanyName?: string;
    monthlyIncome?: number;
    lengthOfService?: string;
    otherIncome?: number;
    appLoanPurpose?: string;
    appLoanAmount?: string;
    appLoanTerms?: string;
    appInterestRate?: number;
    appTotalInterestAmount?: number;
    appTotalPayable?: number;
    appMonthlyDue?: number;
    collateralDescription?: string;
    collateralValue?: number;
    collateralType?: string;
    ownershipStatys?: string;
    unsecuredReason?: string;
    openTermConditions?: string;
    paymentSchedule?: string;
    appReferences?: appReferences[];
    profilePic: string;
  }