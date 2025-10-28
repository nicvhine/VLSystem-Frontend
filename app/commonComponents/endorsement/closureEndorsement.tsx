'use client';

import React, { useState, useEffect } from "react";

export default function ClosureEndorsementTab() {
  const [closures, setClosures] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/closure-endorsement');
      const data = await res.json();
      setClosures(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <table className="min-w-full bg-white border rounded shadow-sm">
        <thead>
          <tr>
            <th className="p-2 border">Reference</th>
            <th className="p-2 border">Borrower</th>
            <th className="p-2 border">Loan Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {closures.map(cl => (
            <tr key={cl._id}>
              <td className="p-2 border">{cl.referenceNumber}</td>
              <td className="p-2 border">{cl.name}</td>
              <td className="p-2 border">{cl.status}</td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-blue-600 text-white rounded">
                  Endorse Closure
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
