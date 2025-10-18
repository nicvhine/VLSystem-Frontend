export interface CharacterReference {
    name: string;
    contact: string;
    relation?: string;
  }
  
  export interface CurrentLoan {
    purpose: string;
    type: string;
    principal: number;
    termsInMonths: number;
    interestRate: number;
    paymentSchedule: string;
    startDate: string;
    paidAmount: number;
    remainingBalance: number;
    totalPayable: number;
    dateDisbursed: string;
    status?: string;
  }
  
  export interface ProfilePic {
    fileName: string;
    filePath: string;
    mimeType: string;
  }
  
  export interface LoanDetails {
    loanId: string;
    name: string;
    loanType: string;
    borrowersId: string;
    appDob?: string;
    appMarital?: string;
    appSpouseName?: string;
    appSpouseOccupation?: string;
    appChildren?: number;
    contactNumber?: string;
    emailAddress?: string;
    address?: string;
    sourceOfIncome?: string;
    appEmploymentStatus?: string;
    appOccupation?: string;
    businessType: string;
    dateStarted: string;
    businessLocation: string;
    totalPayable: string;
    principal: string;
    appMonthlyIncome?: number;
    score?: number;
    status?: string;
    totalLoans?: number;
    references?: CharacterReference[];
    currentLoan?: CurrentLoan;
    profilePic?: ProfilePic;
    previousLoans?: CurrentLoan[];
    collateralType: string;
    collateralValue: string;
    collateralDescription: string;
    ownershipStatus: string;
  }

export interface DetailRowProps {
  label: string;
  value: string | number;
}
  