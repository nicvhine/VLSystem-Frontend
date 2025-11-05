"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import Sysad from "../page";
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

  const openErrorModal = (msg: string) => setErrorMessage(msg);
  const closeErrorModal = () => setErrorMessage(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await authFetch(`${LOG_URL}/all`);
        if (!res.ok) throw new Error("Failed to fetch logs");
  
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []); 
      } catch (err) {
        console.error(err);
        openErrorModal("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, []);
  

  if (loading) return <p className="p-6 text-gray-500">Loading logs...</p>;

  return (
    <Sysad>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h1 className="text-lg font-bold mb-6">System Activity Logs</h1>

        {errorMessage && (
          <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
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
    </Sysad>
  );
}
