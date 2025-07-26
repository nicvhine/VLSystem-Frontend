'use client';

import { useEffect, useState } from 'react';
import {
  FiUserCheck,
  FiEdit3,
  FiTrash2,
  FiInfo,
  FiActivity
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
      console.log("Fetched logs:", data); 
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]); 
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch logs:', err);
      setLoading(false);
    });
}, []);


  const getIcon = (action: string) => {
    const base = "p-2 rounded-full";
    switch (action) {
      case 'CREATE_LOAN':
      case 'CREATE_USER':
        return <div className={`${base} bg-green-50`}><FiUserCheck className="text-green-600 w-4 h-4" /></div>;
      case 'DELETE_USER':
        return <div className={`${base} bg-red-50`}><FiTrash2 className="text-red-600 w-4 h-4" /></div>;
      case 'UPDATE_LOAN':
        return <div className={`${base} bg-blue-50`}><FiEdit3 className="text-blue-600 w-4 h-4" /></div>;
      case 'DELETE_LOAN':
        return <div className={`${base} bg-red-50`}><FiTrash2 className="text-red-600 w-4 h-4" /></div>;
      default:
        return <div className={`${base} bg-gray-50`}><FiInfo className="text-gray-500 w-4 h-4" /></div>;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-200 w-110 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiActivity className="text-red-600 w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <FiActivity className="mx-auto text-gray-400 w-12 h-12 mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs
            .filter(log => log.action !== 'CREATE_USER' && log.action !== 'DELETE_USER')
            .map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <div className="flex-shrink-0">{getIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {log.actor ?? 'Unknown'}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-medium mb-1">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}