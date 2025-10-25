'use client';

import { useState, useEffect } from "react";
import { Loan } from "@/app/commonComponents/utils/Types/loan";
import { Collection, Payment } from "@/app/commonComponents/utils/Types/collection";
import translations from "@/app/commonComponents/translation";

export default function useBorrowerDashboard(borrowersId: string | null) {
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [allLoans, setAllLoans] = useState<Loan[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"en" | "ceb">("en");
  const [role, setRole] = useState<string | null>(null);

  // Tems and Modal
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTosContent, setShowTosContent] = useState(false);
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [tosRead, setTosRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [termsReady, setTermsReady] = useState(false);

  // Payment
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalAnimateIn, setPaymentModalAnimateIn] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const t = translations.loanTermsTranslator[language];

  // Language
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const keyMap: Record<string, string> = {
      head: "headLanguage",
      "loan officer": "loanOfficerLanguage",
      manager: "managerLanguage",
      borrower: "language",
    };
    const langKey = keyMap[storedRole || ""] as keyof typeof keyMap;
    const storedLanguage = localStorage.getItem(langKey) as "en" | "ceb";
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const validRoles = ["borrower", "head", "loan officer", "manager"];
      if (validRoles.includes(role || "") && event.detail.language) {
        setLanguage(event.detail.language as "en" | "ceb");
      }
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, [role]);

  // Terms
  useEffect(() => {
    const mustChange = localStorage.getItem("forcePasswordChange") === "true";
    if (!mustChange) setTermsReady(true);

    const handleCompleted = () => setTermsReady(true);
    window.addEventListener("forcePasswordChangeCompleted", handleCompleted);
    return () => window.removeEventListener("forcePasswordChangeCompleted", handleCompleted);
  }, []);

  useEffect(() => {
    if (!termsReady) return;
    const key = "termsReminderSeenAt";
    const lastSeen = localStorage.getItem(key);
    const now = Date.now();
    const threshold = 24 * 60 * 60 * 1000; 

    if (!lastSeen || isNaN(Number(lastSeen)) || now - Number(lastSeen) > threshold) {
      setShowTermsModal(true);
    }
  }, [termsReady]);

  // Fetch all loans
  useEffect(() => {
    if (!borrowersId) return;
    const controller = new AbortController();
  
    const fetchAllLoans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/loans/all/${borrowersId}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch loans");
        const data: Loan[] = await res.json();
  
        setAllLoans(data); 
        const active = data.find(loan => loan.status === "Active") || null;
        setActiveLoan(active);
  
      } catch (err: any) {
        if (err.name === "AbortError") return; 
        console.error("Error fetching all loans:", err);
        setError("Failed to load loans");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllLoans();
    return () => controller.abort();
  }, [borrowersId]);
  

  // Loan details
  useEffect(() => {
    if (!activeLoan?.loanId) return;
    const controller = new AbortController();
  
    const fetchLoanDetails = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await fetch(
          `http://localhost:3001/loans/details/${activeLoan.loanId}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!res.ok) throw new Error("Failed to fetch loan details");
  
        const data: Loan = await res.json();
        if (data) setActiveLoan(prev => ({ ...prev, ...data, loanId: prev?.loanId }));
  
      } catch (err) {
        console.error("Error fetching loan details:", err);
      }
    };
  
    fetchLoanDetails();
    return () => controller.abort();
  }, [activeLoan?.loanId]);
  

  // Payments
  useEffect(() => {
    if (!activeLoan?.loanId) return;
    const controller = new AbortController();
  
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3001/payments/ledger/${activeLoan.loanId}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();
        const payments = Array.isArray(data.payments) ? data.payments : data;
        setPaidPayments(payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
  
    fetchPayments();
    return () => controller.abort();
  }, [activeLoan?.loanId]);
  
  // Collections
  useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return;
    const controller = new AbortController();
  
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await fetch(
          `http://localhost:3001/collections/schedule/${borrowersId}/${activeLoan.loanId}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!res.ok) throw new Error("Failed to fetch collections");
  
        const data: Collection[] = await res.json();
        setCollections(data);
  
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };
  
    fetchCollections();
    return () => controller.abort();
  }, [activeLoan?.loanId, borrowersId]);
  

  // Calculate payment progress
  useEffect(() => {
    if (collections.length === 0) return setPaymentProgress(0);

    const total = collections.reduce((sum, c) => sum + c.periodAmount, 0);
    const paid = collections
      .filter(c => c.status === "Paid")
      .reduce((sum, c) => sum + c.periodAmount, 0);

    setPaymentProgress(total > 0 ? Math.round((paid / total) * 100) : 0);
  }, [collections]);

  // Payment modal animation
  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentModalAnimateIn(false);
      const timer = setTimeout(() => setPaymentModalAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setPaymentModalAnimateIn(false);
    }
  }, [isPaymentModalOpen]);

  return {
    allLoans,
    activeLoan,
    collections,
    paidPayments,
    paymentProgress,
    loading,
    error,
    showTermsModal,
    setShowTermsModal,
    showTosContent,
    setShowTosContent,
    showPrivacyContent,
    setShowPrivacyContent,
    tosRead,
    setTosRead,
    privacyRead,
    setPrivacyRead,
    termsReady,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentModalAnimateIn,
    showErrorModal,
    setShowErrorModal,
    errorMsg,
    setErrorMsg,
    language,
    setLanguage,
    role,
    t,
  };
}
