export type Payment = {
    _id?: string;
    referenceNumber: string;
    datePaid?: string;
    amount?: number;
    mode: string;
};

export interface PaymentHistoryModalProps {
  isOpen: boolean;
  animateIn: boolean;
  onClose: () => void;
  paidPayments: Payment[];
}

export interface Collection {
    collectionNumber: number;
    dueDate: string;
    periodAmount: number;
    status: string;
    referenceNumber: string;
    borrowersId: string;
    loanId: string;
}

export interface Loan {
    loanId: string;
    type?: string;
    dateDisbursed?: string;
    appTotalPayable?: number;
    borrowersId: string;
    paymentProgress?: number;
    appLoanAmount: number;
    appInterestRate: number;
    appInterestAmount: string;
    appTotalInterestAmount: string;
    appMonthlyDue: string;
    loanType: string;
}

export interface Payments {
    referenceNumber: string;
    datePaid: string;
    amount: number;
    mode: string;
}