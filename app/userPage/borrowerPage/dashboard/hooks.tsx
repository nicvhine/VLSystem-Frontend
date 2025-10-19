'use client';

import { useState, useEffect, useMemo } from "react";
import { Loan, Collection, Payments } from "./type";
import translations from "@/app/commonComponents/Translation";

type Language = 'en' | 'ceb';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paidPayments, setPaidPayments] = useState<Payments[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Initialize role and language
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    const storedLang = storedRole === 'borrower'
      ? localStorage.getItem('borrowerLanguage')
      : storedRole === 'head'
      ? localStorage.getItem('headLanguage')
      : storedRole === 'loan officer'
      ? localStorage.getItem('loanOfficerLanguage')
      : storedRole === 'manager'
      ? localStorage.getItem('managerLanguage')
      : null;

    if (storedLang) setLanguage(storedLang as Language);
  }, []);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { userType, language } = event.detail;
      if (
        (role === 'borrower' && userType === 'borrower') ||
        (role === 'head' && userType === 'head') ||
        (role === 'loan officer' && userType === 'loanOfficer') ||
        (role === 'manager' && userType === 'manager')
      ) {
        setLanguage(language);
      }
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, [role]);

  // Translation object
  const t = useMemo(() => translations.loanTermsTranslator[language], [language]);

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

  useEffect(() => {
    if (!termsReady) return;
    try {
      const key = 'termsReminderSeenAt';
      const lastSeen = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const now = Date.now();
      const thresholdMs = 24 * 60 * 60 * 1000; // 24h
      if (!lastSeen || now - Number(lastSeen) > thresholdMs) {
        setShowTermsModal(true);
      }
    } catch {
      setShowTermsModal(true);
    }
  }, [termsReady]);

  // Fetch active loan
  useEffect(() => {
    if (!borrowersId) return;

    async function fetchActiveLoan() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/loans/active-loan/${borrowersId}`);
        if (!res.ok) throw new Error('No active loan found');
        const data: Loan = await res.json();
        setActiveLoan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching active loan');
      } finally {
        setLoading(false);
      }
    }

    fetchActiveLoan();
  }, [borrowersId]);

  // Fetch loan details
  useEffect(() => {
    if (!activeLoan?.loanId) return;

    async function fetchLoanDetails() {
      try {
        const res = await fetch(`http://localhost:3001/loans/details/${activeLoan.loanId}`);
        if (!res.ok) throw new Error('Failed to fetch loan details');
        const data: Loan = await res.json();
        setActiveLoan(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Error fetching loan details:", err);
      }
    }

    fetchLoanDetails();
  }, [activeLoan?.loanId]);

  // Fetch payments
  useEffect(() => {
    if (!borrowersId) return;

    async function fetchPayments() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/payments/${borrowersId}`);
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data: Payments[] = await res.json();
        const uniquePayments = data.filter(
          (payment, index, self) => index === self.findIndex(p => p.referenceNumber === payment.referenceNumber)
        );
        setPaidPayments(uniquePayments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching payments');
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [borrowersId]);

  // Fetch collection schedule
  useEffect(() => {
    if (!activeLoan?.loanId || !borrowersId) return;
    const loanIdLocal = activeLoan.loanId;

    async function fetchCollections() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${loanIdLocal}`);
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data: Collection[] = await res.json();
        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching collections');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [activeLoan, borrowersId]);

  // Calculate payment progress
  useEffect(() => {
    if (!activeLoan) return;
    if (collections.length > 0) {
      const totalAmount = collections.reduce((sum, c) => sum + c.periodAmount, 0);
      const paidAmount = collections.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.periodAmount, 0);
      const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
      setPaymentProgress(Math.round(progress));
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
