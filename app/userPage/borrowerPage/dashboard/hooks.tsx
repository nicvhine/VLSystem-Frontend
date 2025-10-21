'use client';

import { useState, useEffect } from "react";
import { Loan } from "@/app/commonComponents/utils/Types/loan";
import { Collection, Payment } from "@/app/commonComponents/utils/Types/collection";
import translations from "@/app/commonComponents/translation";

export default function useBorrowerDashboard(borrowersId: string | null) {
  // State variables
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTosContent, setShowTosContent] = useState(false);
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [tosRead, setTosRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [termsReady, setTermsReady] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalAnimateIn, setPaymentModalAnimateIn] = useState(false);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allLoans, setAllLoans] = useState<Loan[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ceb">("en");

  const t = translations.loanTermsTranslator[language];

  // Initialize role and language from localStorage
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

  // Listen to language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (
        role === "borrower" ||
        (role === "head" && event.detail.userType === "head") ||
        (role === "loan officer" && event.detail.userType === "loanOfficer") ||
        (role === "manager" && event.detail.userType === "manager")
      ) {
        setLanguage(event.detail.language as "en" | "ceb");
      }
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, [role]);

  // Check if terms modal should be shown
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const evaluate = () => {
      const mustChange = localStorage.getItem('forcePasswordChange') === 'true';
      if (!mustChange) setTermsReady(true);
    };
    evaluate();
    const handleCompleted = () => evaluate();
    window.addEventListener('forcePasswordChangeCompleted', handleCompleted);
    return () => window.removeEventListener('forcePasswordChangeCompleted', handleCompleted);
  }, []);

  // Show terms modal if not seen recently
  useEffect(() => {
    if (!termsReady) return;
    try {
      const key = 'termsReminderSeenAt';
      const lastSeen = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const now = Date.now();
      const thresholdMs = 24 * 60 * 60 * 1000; // 24 hours
      if (!lastSeen || isNaN(Number(lastSeen)) || now - Number(lastSeen) > thresholdMs) {
        setShowTermsModal(true);
      }
    } catch {
      setShowTermsModal(true);
    }
  }, [termsReady]);

  // Fetch all loans for borrower
  useEffect(() => {
    if (!borrowersId) return;
    const controller = new AbortController();
    async function fetchAllLoans() {
      try {
        const res = await fetch(`http://localhost:3001/loans/all/${borrowersId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch loans');
        const data: Loan[] = await res.json();
        setAllLoans(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) console.error(err);
      }
    }
    fetchAllLoans();
    return () => controller.abort();
  }, [borrowersId]);

  // Fetch active loan or fallback to latest
  useEffect(() => {
    if (!borrowersId) return;
    const controller = new AbortController();
    async function fetchActiveLoan() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`, { signal: controller.signal });
        if (res.ok) {
          const data: Loan = await res.json();
          setActiveLoan(data);
        } else if (allLoans.length > 0) {
          const latestLoan = [...allLoans].sort((a, b) =>
            new Date(b.dateDisbursed).getTime() - new Date(a.dateDisbursed).getTime()
          )[0];
          setActiveLoan(latestLoan);
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : 'Error fetching active loan');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchActiveLoan();
    return () => controller.abort();
  }, [borrowersId, allLoans]);

  // Fetch loan details
  useEffect(() => {
    if (!activeLoan?.loanId) return;
    const controller = new AbortController();
    async function fetchLoanDetails() {
      try {
        const res = await fetch(`http://localhost:3001/loans/details/${activeLoan.loanId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch loan details');
        const data: Loan = await res.json();
        setActiveLoan(prev => ({ ...prev, ...data }));
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) console.error("Error fetching loan details:", err);
      }
    }
    fetchLoanDetails();
    return () => controller.abort();
  }, [activeLoan?.loanId]);

  // Fetch payments for active loan only
  useEffect(() => {
    if (!activeLoan?.loanId) return;
    const controller = new AbortController();
    async function fetchPayments() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/payments/ledger/${activeLoan.loanId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch payments for loan');
        const data: any = await res.json();
        const paymentsArray = Array.isArray(data.payments) ? data.payments : data;
        const uniquePayments = paymentsArray.filter(
          (payment, index, self) =>
            index === self.findIndex(p => p.referenceNumber === payment.referenceNumber)
        );
        setPaidPayments(uniquePayments);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) setError(err instanceof Error ? err.message : 'Error fetching payments');
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
    return () => controller.abort();
  }, [activeLoan?.loanId]);

  // Fetch collections for active loan
  useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return;
    const controller = new AbortController();
    async function fetchCollections() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${activeLoan.loanId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data: Collection[] = await res.json();
        setCollections(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) setError(err instanceof Error ? err.message : 'Error fetching collections');
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
    return () => controller.abort();
  }, [activeLoan, borrowersId]);

  // Calculate payment progress
  useEffect(() => {
    if (!activeLoan) return;
    if (collections.length > 0) {
      const totalAmount = collections.reduce((sum, c) => sum + c.periodAmount, 0);
      const paidAmount = collections.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.periodAmount, 0);
      setPaymentProgress(Math.round(totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0));
    } else {
      setPaymentProgress(0);
    }
  }, [activeLoan, collections]);

  // Animate payment modal
  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentModalAnimateIn(false);
      const timer = setTimeout(() => setPaymentModalAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setPaymentModalAnimateIn(false);
    }
  }, [isPaymentModalOpen]);

  // Return all state and setters
  return {
    allLoans,
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
    activeLoan,
    collections,
    loading,
    error,
    paymentProgress,
    paidPayments,
    showErrorModal,
    setShowErrorModal,
    errorMsg,
    setErrorMsg,
    language,
    setLanguage,
    role,
    t
  };
}
