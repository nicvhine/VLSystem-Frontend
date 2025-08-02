"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import translations from "../components/translation";
import LoanHistory from "../components/loanHistory";
import Borrower from "../page";

export default function BorrowerLoanHistoryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');
  const [allLoans, setAllLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const borrowersId = localStorage.getItem('borrowersId');
    if (!token || !borrowersId) {
      router.push('/');
      return;
    }
    fetch(`http://localhost:3001/loans/borrower-loans/${borrowersId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch loans');
        return res.json();
      })
      .then(data => {
        setAllLoans(data);
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-6 text-center">{translations[language].loading}</div>;

  return (
    <Borrower>
      <div className="min-h-screen bg-gray-50 relative">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-between">
            {translations[language].loanHistory || 'Loan History'}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
              onClick={() => router.push('/components/borrower/dashboard')}
            >
              {translations[language].loanDetails || 'Loan Details'}
            </button>
          </h1>
          <LoanHistory loans={allLoans} translations={translations} language={language} />
        </main>
      </div>
    </Borrower>
  );
}
