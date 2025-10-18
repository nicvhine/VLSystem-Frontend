export interface Application {
  applicationId: string;
  appName: string;
  appEmail: string;
  dateApplied: string;
  appLoanAmount: number;
  appInterestRate: number;
  appTotalPayable: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  totalPayable: number;
  isReloan?: boolean;
  borrowersId: string;
  displayStatus?: string; 
}

export type Language = 'en' | 'ceb';
