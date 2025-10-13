"use client";
import { useEffect, useRef, useState } from "react";

export default function PrivacyContentModal({ language, onClose, onReadComplete }: { language: 'en' | 'ceb'; onClose: () => void; onReadComplete?: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { setAnimateIn(true); return () => setAnimateIn(false); }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const threshold = 24;
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      if (atEnd && !hasReachedEnd) {
        setHasReachedEnd(true);
        onReadComplete?.();
      }
    };
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasReachedEnd, onReadComplete]);

  return (
    <div className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 transition text-2xl bg-white/80 rounded-full leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
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
        </div>
      </div>
    </div>
  );
}
