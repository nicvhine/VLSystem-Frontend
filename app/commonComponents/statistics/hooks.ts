'use client';

import { useState, useEffect } from "react";

export interface LoanTypeStat {
  loanType: string;
  count: number;
}

export interface LoanStats {
  totalPrincipal: number;
  totalInterest: number;
  typeStats: LoanTypeStat[];
}

export interface CollectionStats {
  totalCollectables: number;
  totalCollected: number;
  totalUnpaid: number;
}

export interface TypeStats {
  withCollateral: number;
  withoutCollateral: number;
  openTerm: number;
}

export interface ApplicationStats {
  applied: number;
  pending?: number;
  approved: number;
  denied: number;
}

export function useLoanStats(userType: "manager" | "loanOfficer") {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "ceb">(() => {
    if (typeof window !== "undefined") {
      const key = userType === "manager" ? "managerLanguage" : "loanOfficerLanguage";
      return (localStorage.getItem(key) as "en" | "ceb") || "en";
    }
    return "en";
  });

  const [loanStats, setLoanStats] = useState<LoanStats>({
    totalPrincipal: 0,
    totalInterest: 0,
    typeStats: [],
  });

  const [collectionStats, setCollectionStats] = useState<CollectionStats>({
    totalCollectables: 0,
    totalCollected: 0,
    totalUnpaid: 0,
  });

  const [typeStats, setTypeStats] = useState<TypeStats>({
    withCollateral: 0,
    withoutCollateral: 0,
    openTerm: 0,
  });

  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    applied: 0,
    pending: 0,
    approved: 0,
    denied: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const urls = userType === "manager"
          ? [
              "http://localhost:3001/loans/loan-type-stats",
              "http://localhost:3001/loans/loan-stats",
              "http://localhost:3001/collections/collection-stats",
              "http://localhost:3001/loan-applications/applicationStatus-stats",
            ]
          : [
              "http://localhost:3001/loan-applications/loan-type-stats",
              "http://localhost:3001/loan-applications/applicationStatus-stats",
            ];

        const responses = await Promise.all(
          urls.map((url) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }))
        );

        // Manager
        if (userType === "manager") {
          const typeData: LoanTypeStat[] = await responses[0].json();
          const loanData = await responses[1].json();
          const collectionData: CollectionStats = await responses[2].json();
          const appData: ApplicationStats = await responses[3].json();

          setLoanStats({ typeStats: typeData, ...loanData });
          setCollectionStats(collectionData);
          setApplicationStats(appData);

          const withCollateral = typeData.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
          const withoutCollateral = typeData.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
          const openTerm = typeData.find(t => t.loanType === "Open-Term Loan")?.count || 0;
          setTypeStats({ withCollateral, withoutCollateral, openTerm });
        } 
        // Loan Officer
        else {
          const typeData: LoanTypeStat[] = await responses[0].json();
          const appData: ApplicationStats = await responses[1].json();

          const withCollateral = typeData.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
          const withoutCollateral = typeData.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
          const openTerm = typeData.find(t => t.loanType === "Open-Term Loan")?.count || 0;

          setTypeStats({ withCollateral, withoutCollateral, openTerm });
          setApplicationStats(appData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch loan stats:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [userType]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.userType === userType) {
        setLanguage(e.detail.language);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("languageChange", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("languageChange", handler);
      }
    };
  }, [userType]);

  return { loading, loanStats, collectionStats, typeStats, applicationStats, language };
}
