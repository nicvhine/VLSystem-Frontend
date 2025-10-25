import { Dispatch, SetStateAction } from 'react';
import { BaseModalProps } from './modal';

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
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  collector: string;
  note?: string;
  collectionNumber: number;
  mode?: string;
  totalPayable: number;
}

export interface Payment {
  receipt: string;
  _id?: string;
  loanId: string;
  referenceNumber: string;
  borrowersId: string;
  collector?: string;
  amount: number;
  balance?: number;
  paidToCollection?: number;
  datePaid: string;
  status: string;
  mode?: string;
}

export interface CollectionsPageProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export interface NoteModalProps extends BaseModalProps<Collection> {
  noteText: string;
  setNoteText: Dispatch<SetStateAction<string>>;
  handleSaveNote: () => void;
}

export interface PaymentModalProps extends BaseModalProps<Collection> {
  paymentAmount: number;
  setPaymentAmount: Dispatch<SetStateAction<number>>;
  showPaymentConfirm: boolean;
  setShowPaymentConfirm: Dispatch<SetStateAction<boolean>>;
  handleConfirmPayment: () => void;
  paymentLoading: boolean;
}
