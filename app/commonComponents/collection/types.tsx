export interface Collection {
    loanId: string;
    borrowersId: string;
    name: string;
    referenceNumber: string;
    dueDate: string;
    periodAmount: number;
    paidAmount: number;
    loanBalance: number;
    periodBalance: number;
    status: "Paid" | "Partial" | "Unpaid" | "Overdue";
    collector: string;
    note?: string;
    collectionNumber: number;
    mode?: string;
    totalPayable: number;
  }
  
export interface CollectionsPageProps {
  onModalStateChange?: (isOpen: boolean) => void;
}