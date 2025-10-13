"use client";
import { useEffect, useState } from "react";

export default function TermsContentModal({ language, onClose }: { language: 'en' | 'ceb'; onClose: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => { setAnimateIn(true); return () => setAnimateIn(false); }, []);
  return (
    <div className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden relative text-black transform transition-all duration-300 ease-out ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 transition text-2xl bg-white/80 rounded-full leading-none w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
        <div className="p-6 overflow-y-auto h-[80vh] pt-10">
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
        </div>
      </div>
    </div>
  );
}
