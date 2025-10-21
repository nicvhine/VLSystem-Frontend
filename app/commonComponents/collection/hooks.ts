'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import useIsMobile from "@/app/commonComponents/utils/useIsMobile";
import { Collection } from "../utils/Types/collection";
import translations from "../translation";

// Role-based wrappers
import Head from "@/app/userPage/headPage/page";
import Manager from "@/app/userPage/managerPage/page";
import Collector from "@/app/userPage/collectorPage/page";

export const useCollectionPage = (onModalStateChange?: (isOpen: boolean) => void) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCollector, setCurrentCollector] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [printMode, setPrintMode] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isPaymentModalAnimating, setIsPaymentModalAnimating] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [isNoteModalAnimating, setIsNoteModalAnimating] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [role, setRole] = useState<'manager' | 'head' | 'loan officer' | 'collector'>('manager');
  const [language, setLanguage] = useState<"en" | "ceb">("en");

  const t = translations.loanTermsTranslator[language];
  const s = translations.statisticTranslation[language];
  const b = translations.buttonTranslation[language];


  // Load role and language
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole((storedRole as any) || "manager");

    //  Correct universal language key
    const storedLanguage = localStorage.getItem("language") as "en" | "ceb";
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Update language when changed in other tabs/components
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail?.language) {
        setLanguage(event.detail.language);
      }
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, []);

  // Load current collector
  useEffect(() => {
    const storedCollector = localStorage.getItem("collectorName");
    setCurrentCollector(storedCollector);
  }, []);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        let url = "http://localhost:3001/collections";
        if (role === "collector" && currentCollector) {
          url += `?collector=${encodeURIComponent(currentCollector)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [role, currentCollector]);

  // Animate Payment Modal
  useEffect(() => {
    if (showModal) {
      setIsPaymentModalVisible(true);
      setTimeout(() => setIsPaymentModalAnimating(true), 10);
    } else {
      setIsPaymentModalAnimating(false);
      setTimeout(() => setIsPaymentModalVisible(false), 150);
    }
  }, [showModal]);

  // Animate Note Modal
  useEffect(() => {
    if (showNoteModal) {
      setIsNoteModalVisible(true);
      setTimeout(() => setIsNoteModalAnimating(true), 10);
    } else {
      setIsNoteModalAnimating(false);
      setTimeout(() => setIsNoteModalVisible(false), 150);
    }
  }, [showNoteModal]);

  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(isPaymentModalVisible || isNoteModalVisible);
    }
  }, [isPaymentModalVisible, isNoteModalVisible, onModalStateChange]);


  const filteredCollections = collections.filter((col) => {
    const due = new Date(col.dueDate);
    const selected = selectedDate;
    const sameDate =
      due.getFullYear() === selected.getFullYear() &&
      due.getMonth() === selected.getMonth() &&
      due.getDate() === selected.getDate();

    const matchesCollector = role === "collector" ? col.collector === currentCollector : true;
    const matchesSearch = col.name.toLowerCase().includes(searchQuery.toLowerCase());

    return sameDate && matchesCollector && matchesSearch;
  });

  const overallCollections =
    role === "collector"
      ? collections.filter((col) => col.collector === currentCollector)
      : collections;

  const overallTotalPayments = overallCollections.length;
  const overallCompletedPayments = overallCollections.filter((col) => col.status === "Paid").length;
  const overallCollectionRate =
    overallTotalPayments > 0
      ? Math.round((overallCompletedPayments / overallTotalPayments) * 100)
      : 0;
  const overallTotalCollected = overallCollections.reduce(
    (sum, col) => sum + col.paidAmount,
    0
  );
  const overallTotalTarget = overallCollections.reduce(
    (sum, col) => sum + col.periodAmount,
    0
  );
  const overallTargetAchieved =
    overallTotalTarget > 0
      ? Math.round((overallTotalCollected / overallTotalTarget) * 100)
      : 0;

  const totalPayments = filteredCollections.length;
  const completedPayments = filteredCollections.filter((col) => col.status === "Paid").length;
  const collectionRate =
    totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0;
  const totalCollected = filteredCollections.reduce(
    (sum, col) => sum + col.paidAmount,
    0
  );
  const totalTarget = filteredCollections.reduce(
    (sum, col) => sum + col.periodAmount,
    0
  );
  const targetAchieved =
    totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const Wrapper =
    role === "head" ? Head : role === "collector" ? Collector : Manager;

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedDate,
    setSelectedDate,
    collections,
    setCollections,
    filteredCollections,
    loading,
    currentCollector,
    showModal,
    setShowModal,
    selectedCollection,
    setSelectedCollection,
    paymentAmount,
    setPaymentAmount,
    showNoteModal,
    setShowNoteModal,
    noteText,
    setNoteText,
    role,
    t,
    s,
    b,
    language,
    isMobile,
    printMode,
    setPrintMode,
    showErrorModal,
    setShowErrorModal,
    errorMsg,
    setErrorMsg,
    isPaymentModalVisible,
    setIsPaymentModalVisible,
    isPaymentModalAnimating,
    setIsPaymentModalAnimating,
    isNoteModalVisible,
    setIsNoteModalVisible,
    isNoteModalAnimating,
    setIsNoteModalAnimating,
    tableRef,
    showPaymentConfirm,
    setShowPaymentConfirm,
    paymentLoading,
    setPaymentLoading,
    totalPayments,
    completedPayments,
    collectionRate,
    totalCollected,
    totalTarget,
    targetAchieved,
    overallTotalPayments,
    overallCompletedPayments,
    overallCollectionRate,
    overallTotalCollected,
    overallTotalTarget,
    overallTargetAchieved,
    Wrapper,
  };
};
