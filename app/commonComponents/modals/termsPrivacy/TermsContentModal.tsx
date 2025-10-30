"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function TermsContentModal({ language, onClose, onReadComplete }: { language: 'en' | 'ceb'; onClose: () => void; onReadComplete?: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [nearEnd, setNearEnd] = useState(false);

  // Use rAF to ensure a frame passes before animating in (prevents no-op transitions)
  useEffect(() => {
    let raf = requestAnimationFrame(() => setAnimateIn(true));
    return () => { cancelAnimationFrame(raf); setAnimateIn(false); };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Fallback scroll-based check
    const onScroll = () => {
      // Robust progress + end detection
      const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
      const progress = el.scrollTop / maxScroll;
      if (progress >= 0.9 && !nearEnd) setNearEnd(true);

      const thresholdPx = 8; // small tolerance for sub-pixel rounding
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx;
      if ((progress >= 0.97 || atEnd) && !hasReachedEnd) {
        setHasReachedEnd(true);
        onReadComplete?.();
      }
    };
    el.addEventListener('scroll', onScroll);

    // If content doesn't overflow, mark as read immediately
    if (el.scrollHeight <= el.clientHeight + 1 && !hasReachedEnd) {
      setHasReachedEnd(true);
      onReadComplete?.();
    }

    // IntersectionObserver sentinel at bottom for robust detection
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

    // Initial check
    onScroll();
    // Extra pass after paint to catch late layout
    requestAnimationFrame(onScroll);

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (observer && bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [hasReachedEnd, onReadComplete]);

  // Ensure client-only render to avoid hydration mismatch and allow portal
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
          <h2 className="text-xl font-semibold mb-2">{language === 'en' ? 'Terms of Service' : 'Mga Termino sa Serbisyo'}</h2>
          <p className="text-sm text-gray-500 mb-4">Effective Date: {new Date().toLocaleDateString()}</p>
          <div className="prose prose-sm max-w-none text-gray-700">
            <h3>1. Introduction</h3>
            <p>These Terms govern your use of our loan application services and related features (the “Service”). By submitting an application, you agree to these Terms.</p>
            <h3>2. Eligibility</h3>
            <p>Applicants must be of legal age and capable of entering into binding contracts. Additional eligibility criteria may apply based on loan products.</p>
            <h3>3. Application and Verification</h3>
            <p>You authorize us to collect and verify information, contact references, and conduct credit checks with authorized bureaus or partners.</p>
            <h3>4. Interest, Fees, and Charges</h3>
            <p>Interest rates, service charges, penalties, and any other fees applicable to your loan will be disclosed to you prior to approval and form part of your loan agreement.</p>
            <h3>5. Repayment and Default</h3>
            <p>Repayments must be made on schedule. Late or missed payments may incur penalties, collections actions, and affect your credit standing.</p>
            <h3>6. Communications</h3>
            <p>You consent to receive communications (SMS, email, calls, in-app notifications) related to your application and account.</p>
            <h3>7. Data Privacy</h3>
            <p>Your information is processed in accordance with our Privacy Policy. Do not submit third-party data unless you have obtained proper consent.</p>
            <h3>8. Prohibited Use</h3>
            <p>Do not submit false documents, misrepresent identity, or use the Service for unlawful purposes.</p>
            <h3>9. Changes to the Service</h3>
            <p>We may update the Service or these Terms from time to time. Material changes will be communicated through the app or by email.</p>
            <h3>10. Governing Law</h3>
            <p>These Terms are governed by applicable laws of your jurisdiction. Disputes shall be resolved by competent courts as provided by law.</p>
            <h3>11. Contact Us</h3>
            <p>For questions about these Terms, contact our support team through the details provided in the app.</p>
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
          {/* Sentinel used by IntersectionObserver to detect end-of-content */}
          <div ref={bottomRef} className="h-1 w-full"></div>
        </div>
      </div>
    </div>
  );
  const target = typeof document !== 'undefined' ? document.body : null;
  if (!target) return null;
  return createPortal(markup, target);
}
