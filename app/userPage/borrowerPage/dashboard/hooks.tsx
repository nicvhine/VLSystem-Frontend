import { useState, useEffect } from "react";
import { Loan, Collection, Payments } from "./type";
import translations from "@/app/commonComponents/Translation";

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

  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  const t = translations.loanTermsTranslator[language];

  // Load language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language');
      if (stored === 'ceb') setLanguage('ceb');
    }
  }, []);

  // Check if terms need to be shown
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

  // Show terms modal if needed
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
    setLanguage
  };
}
