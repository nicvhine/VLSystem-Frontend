// Result from adding an agent
export interface AddAgentResult {
    success: boolean;
    fieldErrors?: { name?: string; phoneNumber?: string };
    message?: string;
  }
  
// Field error structure
export interface FieldErrors {
    name?: string;
    phoneNumber?: string;
}
  
// Props for the AddAgentModal component
export interface AddAgentModalProps {
    show: boolean;
    onClose: () => void;
    newAgentName: string;
    setNewAgentName: (name: string) => void;
    newAgentPhone: string;
    setNewAgentPhone: (phone: string) => void;
    onAddAgent: () => Promise<AddAgentResult>;
}
  