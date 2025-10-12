// frontend/app/userPage/hooks/useApplications.ts  Hook: fetch and map loan applications with auth
import { useState, useEffect } from "react";

export interface CharacterReference {
  name: string;
  contact: string;
  relation: string;
}

export interface Application {
  applicationId: string;
  loanType: string;
  status: string;
  interviewDate?: string;
  interviewTime?: string;
  documents?: { fileName: string; filePath: string; mimeType: string }[];
  appName?: string;
  appDob?: string;
  appContact?: string;
  appEmail?: string;
  appMarital?: string;
  appSpouseName?: string;
  appSpouseOccupation?: string;
  appChildren?: number;
  appAddress?: string;
  sourceOfIncome?: string;
  appTypeBusiness?: string;
  appBusinessName?: string;
  appDateStarted?: string;
  appBusinessLoc?: string;
  appMonthlyIncome?: number;
  appEmploymentStatus?: string;
  appOccupation?: string;
  appCompanyName?: string;
  monthlyIncome?: number;
  lengthOfService?: string;
  otherIncome?: number;
  appLoanPurpose?: string;
  appLoanAmount?: string;
  appLoanTerms?: string;
  appInterestRate?: number;
  appTotalInterestAmount?: number;
  appTotalPayable?: number;
  appMonthlyDue?: number;
  collateralDescription?: string;
  collateralValue?: number;
  collateralType?: string;
  ownershipStatys?: string;
  unsecuredReason?: string;
  openTermConditions?: string;
  paymentSchedule?: string;
  appReferences?: appReferences[];
  profilePic: string;
}

// Fetch applications with auth and normalize nested references
export function useApplications(apiUrl: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to add auth header from localStorage
  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in localStorage");

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  }

  // Load applications on mount or when apiUrl changes
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token in localStorage");

        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        const mappedData = data.map((app: any) => ({
          ...app,
          appReferences: app.appReferences?.map((ref: any) => ({
            name: ref.name,
            contact: ref.contact,
            relation: ref.relation,
          })) || [],
        }));
        setApplications(mappedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [apiUrl]);

  // Utility: capitalizes each word for display
  const capitalizeWords = (text?: string) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  return { applications, setApplications, loading };
}
