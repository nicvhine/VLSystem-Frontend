"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function PrivacyContentModal({ language, onClose, onReadComplete }: { language: 'en' | 'ceb'; onClose: () => void; onReadComplete?: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [nearEnd, setNearEnd] = useState(false);
  // Use rAF to ensure a frame passes before animating in
  useEffect(() => {
    let raf = requestAnimationFrame(() => setAnimateIn(true));
    return () => { cancelAnimationFrame(raf); setAnimateIn(false); };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Fallback scroll-based check
    const onScroll = () => {
      const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
      const progress = el.scrollTop / maxScroll;
      if (progress >= 0.9 && !nearEnd) setNearEnd(true);
      const thresholdPx = 8;
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx;
      if ((progress >= 0.97 || atEnd) && !hasReachedEnd) {
        setHasReachedEnd(true);
        onReadComplete?.();
      }
    };
    el.addEventListener('scroll', onScroll);

    // If no overflow, mark as read
    if (el.scrollHeight <= el.clientHeight + 1 && !hasReachedEnd) {
      setHasReachedEnd(true);
      onReadComplete?.();
    }

    // IntersectionObserver sentinel
    let observer: IntersectionObserver | null = null;
    if (bottomRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && !hasReachedEnd) {
            setHasReachedEnd(true);
            onReadComplete?.();
          }
        },
        { root: el, threshold: 0, rootMargin: '0px 0px -1px 0px' }
      );
      observer.observe(bottomRef.current);
    }

    onScroll();
    requestAnimationFrame(onScroll);

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (observer && bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [hasReachedEnd, onReadComplete]);

  // Client-only and portal for proper stacking over TermsGate
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  // Per latest requirement: mark as read immediately upon opening the modal
  useEffect(() => {
    if (!hasReachedEnd) {
      setHasReachedEnd(true);
      onReadComplete?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = () => { setAnimateIn(false); setTimeout(() => onClose(), 300); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setAnimateIn(false); setTimeout(() => onClose(), 300); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted) return null;

  const markup = (
    <div style={{ zIndex: 1100 }} className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div style={{ zIndex: 1101 }} className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
  <button onClick={() => { setAnimateIn(false); setTimeout(() => onClose(), 300); }} className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 transition text-2xl bg-white/80 rounded-full leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
        <div ref={scrollRef} className="p-6 overflow-y-auto h-[80vh] pt-10">
          <h2 className="text-xl font-semibold mb-2">{language === 'en' ? 'Privacy Policy' : 'Palisiya sa Privacy'}</h2>
          <p className="text-sm text-gray-500 mb-4">Effective Date: {new Date().toLocaleDateString()}</p>
          <div className="prose prose-sm max-w-none text-gray-700">
            <h3>1. Scope</h3>
            <p>This Policy explains how we collect, use, disclose, and protect your personal data when you apply for and use our Service.</p>
            <h3>2. Data We Collect</h3>
            <p>Includes identification details, contact information, demographic data, financial and employment details, references, documents, device and usage data.</p>
            <h3>3. Purposes of Processing</h3>
            <p>To evaluate your application, perform credit and risk assessments, comply with legal obligations, communicate with you, and improve the Service.</p>
            <h3>4. Legal Bases</h3>
            <p>We process data based on your consent, performance of a contract, legal obligations, and legitimate interests such as fraud prevention and Service improvement.</p>
            <h3>5. Sharing and Disclosure</h3>
            <p>We may share data with regulators, credit bureaus, payment and verification partners, affiliates, and service providers subject to appropriate safeguards.</p>
            <h3>6. Data Retention</h3>
            <p>We retain personal data only as long as necessary for the purposes stated and as required by law and regulatory guidelines.</p>
            <h3>7. Your Rights</h3>
            <p>You may access, correct, or request deletion of your data, withdraw consent, and object to processing, subject to applicable laws.</p>
            <h3>8. Security</h3>
            <p>We implement organizational, technical, and physical safeguards to protect your information from unauthorized access and misuse.</p>
            <h3>9. International Transfers</h3>
            <p>Where data is transferred across borders, we ensure appropriate protection consistent with applicable data protection laws.</p>
            <h3>10. Cookies and Tracking</h3>
            <p>We may use cookies and similar technologies for analytics and functionality. You can control cookies via your browser settings.</p>
            <h3>11. Updates</h3>
            <p>We may update this Policy from time to time. Material updates will be communicated via the app or email.</p>
            <h3>12. Contact</h3>
            <p>For privacy inquiries or complaints, contact our Data Protection Officer via the contact details in the app.</p>
          </div>
          {!hasReachedEnd && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              {language === 'en' ? 'Scroll to the bottom to mark as read' : 'I-scroll sa ubos aron ma-mark nga nabasa'}
            </div>
          )}
          {!hasReachedEnd && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => { setHasReachedEnd(true); onReadComplete?.(); }}
                className={`px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700`}
              >
                {language === 'en' ? 'Mark as Read' : 'I-mark nga Nabasa'}
              </button>
            </div>
          )}
          {/* Sentinel for end-of-content detection */}
          <div ref={bottomRef} className="h-1 w-full"></div>
        </div>
      </div>
    </div>
  );
  const target = typeof document !== 'undefined' ? document.body : null;
  if (!target) return null;
  return createPortal(markup, target);
}
