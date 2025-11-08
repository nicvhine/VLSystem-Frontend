"use client";

import { useState, useEffect } from "react";
import translations from "@/app/commonComponents/translation";
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import ErrorModal from "@/app/commonComponents/modals/errorModal";

const LOG_URL = process.env.NEXT_PUBLIC_LOG_URL 

interface LogEntry {
  logId: string;
  userId: string;
  name: string;
  role: string;
  action: string;
  description: string;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ceb'>('en');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (saved === 'en' || saved === 'ceb') setLanguage(saved);
    const onLang = (e: Event) => {
      try {
        const ev = e as CustomEvent;
        const lang = ev.detail?.language;
        if (lang === 'en' || lang === 'ceb') setLanguage(lang);
      } catch {}
    };
    const onStorage = () => {
      const l = localStorage.getItem('language');
      if (l === 'en' || l === 'ceb') setLanguage(l);
    };
    window.addEventListener('languageChange', onLang as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('languageChange', onLang as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const s = translations.sysadTranslation[language];

  const openErrorModal = (msg: string) => setErrorMessage(msg);
  const closeErrorModal = () => setErrorMessage(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await authFetch(`${LOG_URL}/all`);
        if (!res.ok) throw new Error(s.t25);
  
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []); 
      } catch (err) {
        console.error(err);
        openErrorModal(s.t25);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, []);
  

  if (loading) return <p className="p-6 text-gray-500">{s.t69} {s.t2.toLowerCase()}...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h1 className="text-lg font-bold mb-6">{s.t16}</h1>

        {errorMessage && (
          <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t24}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t37}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t41}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t20}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t22}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
            <tr key={log.logId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-600">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{typeof log.name === "string" ? log.name : JSON.stringify(log.name)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{typeof log.role === "string" ? log.role : JSON.stringify(log.role)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{typeof log.action === "string" ? log.action : JSON.stringify(log.action)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{typeof log.description === "string" ? log.description : JSON.stringify(log.description)}</td>
            </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
