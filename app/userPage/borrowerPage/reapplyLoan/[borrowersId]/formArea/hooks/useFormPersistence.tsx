import { useEffect, useCallback } from 'react';

interface FormData {
  // Basic Info
  appName: string;
  appDob: string;
  appContact: string;
  appEmail: string;
  appMarital: string;
  appChildren: number;
  appSpouseName: string;
  appSpouseOccupation: string;
  appAddress: string;
  
  // Source of Income
  sourceOfIncome: string;
  appTypeBusiness: string;
  appBusinessName: string;
  appDateStarted: string;
  appBusinessLoc: string;
  appMonthlyIncome: number;
  appOccupation: string;
  appEmploymentStatus: string;
  appCompanyName: string;
  
  // References
  appReferences: Array<{ name: string; contact: string; relation: string }>;
  
  // Agent
  appAgent: string;
  
  // Collateral
  collateralType: string;
  collateralValue: number;
  collateralDescription: string;
  ownershipStatus: string;
  
  // Loan
  selectedLoan: any | null;
  appLoanPurpose: string;
  
  // Loan Type
  loanType: string;
  
  // Balance Decision
  balanceDecision?: 'deduct' | 'addPrincipal';
}

interface UseFormPersistenceProps {
  formData: FormData;
  setters: {
    setAppName: (v: string) => void;
    setAppDob: (v: string) => void;
    setAppContact: (v: string) => void;
    setAppEmail: (v: string) => void;
    setAppMarital: (v: string) => void;
    setAppChildren: (v: number) => void;
    setAppSpouseName: (v: string) => void;
    setAppSpouseOccupation: (v: string) => void;
    setAppAddress: (v: string) => void;
    setSourceOfIncome: (v: string) => void;
    setAppTypeBusiness: (v: string) => void;
    setAppBusinessName: (v: string) => void;
    setAppDateStarted: (v: string) => void;
    setAppBusinessLoc: (v: string) => void;
    setAppMonthlyIncome: (v: number) => void;
    setAppOccupation: (v: string) => void;
    setAppEmploymentStatus: (v: string) => void;
    setAppCompanyName: (v: string) => void;
    setAppReferences: (v: Array<{ name: string; contact: string; relation: string }>) => void;
    setAppAgent: (v: string) => void;
    setCollateralType: (v: string) => void;
    setCollateralValue: (v: number) => void;
    setCollateralDescription: (v: string) => void;
    setOwnershipStatus: (v: string) => void;
    setSelectedLoan: (v: any) => void;
    setAppLoanPurpose: (v: string) => void;
    setBalanceDecision?: (v: 'deduct' | 'addPrincipal') => void;
  };
  storageKey?: string;
  enabled?: boolean;
  borrowersId?: string;
}

export function useFormPersistence({
  formData,
  setters,
  storageKey = 'reloanApplicationFormData',
  enabled = true,
  borrowersId,
}: UseFormPersistenceProps) {
  // Create unique storage key per borrower
  const actualStorageKey = borrowersId ? `${storageKey}_${borrowersId}` : storageKey;

  // Load saved form data on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const savedData = localStorage.getItem(actualStorageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Restore all form fields
        if (parsed.appName) setters.setAppName(parsed.appName);
        if (parsed.appDob) setters.setAppDob(parsed.appDob);
        if (parsed.appContact) setters.setAppContact(parsed.appContact);
        if (parsed.appEmail) setters.setAppEmail(parsed.appEmail);
        if (parsed.appMarital) setters.setAppMarital(parsed.appMarital);
        if (parsed.appChildren !== undefined) setters.setAppChildren(parsed.appChildren);
        if (parsed.appSpouseName) setters.setAppSpouseName(parsed.appSpouseName);
        if (parsed.appSpouseOccupation) setters.setAppSpouseOccupation(parsed.appSpouseOccupation);
        if (parsed.appAddress) setters.setAppAddress(parsed.appAddress);
        
        if (parsed.sourceOfIncome) setters.setSourceOfIncome(parsed.sourceOfIncome);
        if (parsed.appTypeBusiness) setters.setAppTypeBusiness(parsed.appTypeBusiness);
        if (parsed.appBusinessName) setters.setAppBusinessName(parsed.appBusinessName);
        if (parsed.appDateStarted) setters.setAppDateStarted(parsed.appDateStarted);
        if (parsed.appBusinessLoc) setters.setAppBusinessLoc(parsed.appBusinessLoc);
        if (parsed.appMonthlyIncome !== undefined) setters.setAppMonthlyIncome(parsed.appMonthlyIncome);
        if (parsed.appOccupation) setters.setAppOccupation(parsed.appOccupation);
        if (parsed.appEmploymentStatus) setters.setAppEmploymentStatus(parsed.appEmploymentStatus);
        if (parsed.appCompanyName) setters.setAppCompanyName(parsed.appCompanyName);
        
        if (parsed.appReferences && Array.isArray(parsed.appReferences)) {
          setters.setAppReferences(parsed.appReferences);
        }
        
        if (parsed.appAgent) setters.setAppAgent(parsed.appAgent);
        
        if (parsed.collateralType) setters.setCollateralType(parsed.collateralType);
        if (parsed.collateralValue !== undefined) setters.setCollateralValue(parsed.collateralValue);
        if (parsed.collateralDescription) setters.setCollateralDescription(parsed.collateralDescription);
        if (parsed.ownershipStatus) setters.setOwnershipStatus(parsed.ownershipStatus);
        
        if (parsed.selectedLoan) setters.setSelectedLoan(parsed.selectedLoan);
        if (parsed.appLoanPurpose) setters.setAppLoanPurpose(parsed.appLoanPurpose);
        
        if (parsed.balanceDecision && setters.setBalanceDecision) {
          setters.setBalanceDecision(parsed.balanceDecision);
        }
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }, [enabled, actualStorageKey]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const dataToSave = JSON.stringify(formData);
      localStorage.setItem(actualStorageKey, dataToSave);
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData, actualStorageKey, enabled]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(actualStorageKey);
    } catch (error) {
      console.error('Error clearing form data from localStorage:', error);
    }
  }, [actualStorageKey]);

  return { clearSavedData };
}
