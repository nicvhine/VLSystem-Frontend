'use client';

import { useEffect, useState } from 'react';
import {
  FiUserCheck,
  FiEdit3,
  FiTrash2,
  FiInfo,
} from 'react-icons/fi';

interface LogEntry {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/logs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch logs:', err);
        setLoading(false);
      });
  }, []);

  const getIcon = (action: string) => {
    const base = "p-1.5 rounded-full";
    switch (action) {
      case 'CREATE_LOAN':
      case 'CREATE_USER':
        return <div className={`${base} bg-green-100`}><FiUserCheck className="text-green-600" /></div>;
      case 'DELETE_USER':
        return <div className={`${base} bg-red-100`}><FiTrash2 className="text-red-600" /></div>;
      case 'UPDATE_LOAN':
        return <div className={`${base} bg-yellow-100`}><FiEdit3 className="text-yellow-600" /></div>;
      case 'DELETE_LOAN':
        return <div className={`${base} bg-red-100`}><FiTrash2 className="text-red-600" /></div>;
      default:
        return <div className={`${base} bg-slate-100`}><FiInfo className="text-slate-500" /></div>;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm max-w-sm w-full h-[450px] overflow-y-auto">
      <h2 className="text-base font-semibold text-slate-700 mb-3 border-b pb-2">Audit Log</h2>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-500 text-sm">No logs available.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition"
            >
              <div>{getIcon(log.action)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-800">
                    {log.actor ?? 'Unknown'}
                  </p>
                  <span className="text-xs text-slate-400">{formatDate(log.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {log.action.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {log.details}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
