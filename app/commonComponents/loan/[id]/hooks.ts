import { useState, useEffect } from "react";
import { LoanDetails } from "../../utils/Types/loan";
import translations from "../../translation";

const API_URL = "http://localhost:3001/loans";

export const useLoanDetails = (id: string) => {
  const [loan, setLoan] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"manager" | "head" | "loan officer">("manager");
  const [language, setLanguage] = useState<"en" | "ceb">("en");

  // Fetch loan details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setLoan(data);
      } catch (error) {
        console.error("Failed to fetch loan details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoanDetails();
  }, [id]);

  // Get role and language from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role") as "manager" | "head" | "loan officer" | null;
    const storedLanguage = localStorage.getItem("language") as "en" | "ceb" | null;

    if (storedRole) setRole(storedRole);
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  // Listen for real-time language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
    };
  }, []);

  // Translation sets
  const t = translations.viewLoanTranslation[language];
  const s = translations.loanTermsTranslator[language]; 
  const a = translations.viewApplicationTranslation[language];
  return { loan, loading, role, language, t, s, a };
};
