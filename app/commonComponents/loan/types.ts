export interface LoanDetails {
    loanId: string;
    name: string;
    interestRate: number;
    principal: number;
    termsInMonths: number;
    totalPayable: number;
    balance: number;
    status: string;
    dateDisbursed: string;
    appLoanAmount: number;
  }
  
  export type Language = 'en' | 'ceb';
  