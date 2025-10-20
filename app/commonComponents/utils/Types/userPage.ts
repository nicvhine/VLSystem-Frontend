export interface User {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "head" | "manager" | "loan officer" | "collector";
    status: "Active" | "Inactive";
    lastActive: string;
  }
  
  export interface DecisionConfig {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    danger?: boolean;
    error?: string;
  }
  