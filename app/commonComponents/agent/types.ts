export type Language = 'en' | 'ceb';

export interface Agent {
  agentId: string;
  name: string;
  phoneNumber: string;
  handledLoans: number;
  totalLoanAmount: number;
  totalCommission: number;
}

export interface FieldErrors {
  name?: string;
  phoneNumber?: string;
}
