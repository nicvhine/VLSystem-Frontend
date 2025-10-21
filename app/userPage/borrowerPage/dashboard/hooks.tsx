'use client';

import { useState, useEffect } from "react";
import { Loan } from "@/app/commonComponents/utils/Types/loan";
import { Collection, Payment } from "@/app/commonComponents/utils/Types/collection";
import translations from "@/app/commonComponents/translation";

export default function useBorrowerDashboard(borrowersId: string | null) {
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
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ceb">("en");

  // Translation object (reactive)
  const t = translations.loanTermsTranslator[language];

  // Initialize role and language from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const keyMap: Record<string, string> = {
      head: "headLanguage",
      "loan officer": "loanOfficerLanguage",
      manager: "managerLanguage",
      borrower: "language", // handle borrower
    };

    const langKey = keyMap[storedRole || ""] as keyof typeof keyMap;
    const storedLanguage = localStorage.getItem(langKey) as "en" | "ceb";
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  // Listen to language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (
        role === "borrower" || // allow borrower
        (role === "head" && event.detail.userType === "head") ||
        (role === "loan officer" && event.detail.userType === "loanOfficer") ||
        (role === "manager" && event.detail.userType === "manager")
      ) {
        setLanguage(event.detail.language as "en" | "ceb");
      }
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, [role]);

  // Terms modal check
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

  // Show terms modal if not seen
  useEffect(() => {
    if (!termsReady) return;
    try {
      const key = 'termsReminderSeenAt';
      const lastSeen = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const now = Date.now();
      const thresholdMs = 24 * 60 * 60 * 1000; // 24h
      if (!lastSeen || isNaN(Number(lastSeen)) || now - Number(lastSeen) > thresholdMs) {
        setShowTermsModal(true);
      }
    } catch {
      setShowTermsModal(true);
    }
  }, [termsReady]);

  // Fetch active loan
  useEffect(() => {
    if (!borrowersId) return;
    const controller = new AbortController();
    async function fetchActiveLoan() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('No active loan found');
        const data: Loan = await res.json();
        setActiveLoan(data);
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
  }, [borrowersId]);

  // Fetch loan details
  useEffect(() => {
    if (!activeLoan?.loanId) return;
    const controller = new AbortController();
    async function fetchLoanDetails() {
      try {
        const res = await fetch(`http://localhost:3001/loans/details/${activeLoan.loanId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch loan details');
        const data: Loan = await res.json();
        setActiveLoan(prev => ({ ...prev, ...data }));
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Error fetching loan details:", err);
        }
      }
    }
    fetchLoanDetails();
    return () => controller.abort();
  }, [activeLoan?.loanId]);

  // Fetch payments
  useEffect(() => {
    if (!borrowersId) return;
    const controller = new AbortController();
    async function fetchPayments() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/payments/${borrowersId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data: Payment[] = await res.json();
        const uniquePayments = data.filter(
          (payment, index, self) => index === self.findIndex(p => p.referenceNumber === payment.referenceNumber)
        );
        setPaidPayments(uniquePayments);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : 'Error fetching payments');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
    return () => controller.abort();
  }, [borrowersId]);

  // Fetch collections
  useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return;
    const controller = new AbortController();
    async function fetchCollections() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${activeLoan.loanId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data: Collection[] = await res.json();
        setCollections(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : 'Error fetching collections');
        }
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
