'use client';

import { useState, useEffect } from "react";
import { 
  LoanStats, CollectionStats, TypeStats, ApplicationStats, LoanTypeStat, 
  TopBorrower, TopCollector, TopAgent 
} from "../utils/Types/statsType";
import translations from "../translation";

const STAT_URL = process.env.NEXT_PUBLIC_STAT_URL

export function useLoanStats(userType: "manager" | "loanOfficer") {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('language')) localStorage.setItem('language', 'en');
      return (localStorage.getItem('language') as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  const t = translations.statisticTranslation[language];
  const s = translations.loanTermsTranslator[language];

  const [loanStats, setLoanStats] = useState<LoanStats>({ totalPrincipal: 0, totalInterest: 0, typeStats: [] });
  const [collectionStats, setCollectionStats] = useState<CollectionStats>({ totalCollectables: 0, totalCollected: 0, totalUnpaid: 0 });
  const [typeStats, setTypeStats] = useState<TypeStats>({ withCollateral: 0, withoutCollateral: 0, openTerm: 0 });
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({ applied: 0, approved: 0, denied: 0 });
  const [monthlyInterest, setMonthlyInterest] = useState<{ month: number; totalInterest: number }[]>(
    Array.from({ length: 12 }, (_, i) => ({ month: i + 1, totalInterest: 0 }))
  );

  const [topBorrowers, setTopBorrowers] = useState<TopBorrower[]>([]);
  const [topCollectors, setTopCollectors] = useState<TopCollector[]>([]);
  const [topAgents, setTopAgents] = useState<TopAgent[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMainStats = async () => {
      try {
        if (userType === "manager") {
          // Fetch main stats
          const [typeRes, loanRes, collectionRes, appRes] = await Promise.all([
            fetch(`${STAT_URL}/loan-type-stats`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/loan-stats`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/collection-stats`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/applicationStatus-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);

          const typeDataRes = await typeRes.json();
          console.log("typeData response:", typeDataRes); // debug
          const typeData: LoanTypeStat[] = Array.isArray(typeDataRes)
            ? typeDataRes
            : typeDataRes?.typeStats || [];
          const loanData = await loanRes.json();
          const collectionData: CollectionStats = await collectionRes.json();
          const appData: ApplicationStats = await appRes.json();

          setLoanStats({ typeStats: typeData, ...loanData });
          setCollectionStats(collectionData);
          setApplicationStats(appData);

          const withCollateral = typeData.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
          const withoutCollateral = typeData.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
          const openTerm = typeData.find(t => t.loanType === "Open-Term Loan")?.count || 0;
          setTypeStats({ withCollateral, withoutCollateral, openTerm });
        } else {
          // Loan officer stats
          const [typeRes, appRes] = await Promise.all([
            fetch(`${STAT_URL}/applied-loan-type-stats`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/applicationStatus-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);

          const typeData: LoanTypeStat[] = await typeRes.json();
          const appData: ApplicationStats = await appRes.json();

          const withCollateral = typeData.find(t => t.loanType === "Regular Loan With Collateral")?.count || 0;
          const withoutCollateral = typeData.find(t => t.loanType === "Regular Loan Without Collateral")?.count || 0;
          const openTerm = typeData.find(t => t.loanType === "Open-Term Loan")?.count || 0;

          setTypeStats({ withCollateral, withoutCollateral, openTerm });
          setApplicationStats(appData);
        }
      } catch (err) {
        console.error("Failed to fetch main loan stats:", err);
      }
    };

    const fetchTopLists = async () => {
      try {
        if (userType === "manager") {
          const [borrowerRes, collectorRes, agentRes] = await Promise.all([
            fetch(`${STAT_URL}/top-borrowers`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/top-collectors`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${STAT_URL}/top-agents`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);

          const borrowerData = await borrowerRes.json();
          const collectorData = await collectorRes.json();
          const agentData = await agentRes.json();

          setTopBorrowers(borrowerData.topBorrowers || []);
          setTopCollectors(collectorData || []);
          setTopAgents(agentData || []);
        }
      } catch (err) {
        console.error("Failed to fetch top lists:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchMainStats(), fetchTopLists()]);
      setLoading(false);
    };

    fetchAll();
  }, [userType]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.userType === userType) setLanguage(e.detail.language);
    };
    if (typeof window !== "undefined") window.addEventListener("languageChange", handler);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("languageChange", handler);
    };
  }, [userType]);

  return { 
    s, 
    t, 
    loading, 
    loanStats, 
    collectionStats, 
    typeStats, 
    applicationStats, 
    monthlyInterest, 
    language, 
    topBorrowers, 
    topCollectors, 
    topAgents  
  };
}