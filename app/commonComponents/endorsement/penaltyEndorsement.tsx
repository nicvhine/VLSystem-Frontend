'use client';

import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatters"; 

export default function PenaltyEndorsementTab() {
  const [endorsements, setEndorsements] = useState<any[]>([]);

  const fetchEndorsements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch('http://localhost:3001/penalty', {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch penalty endorsements');
      const data = await res.json();
      setEndorsements(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchEndorsements();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:3001/penalty/${id}/approve`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks: "Approved" })
      });

      if (!res.ok) throw new Error("Failed to approve endorsement");
      alert("Endorsement approved successfully!");
      fetchEndorsements(); // refresh table
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:3001/penalty/reject/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ remarks: "Rejected" })
      });

      if (!res.ok) throw new Error("Failed to reject endorsement");
      alert("Endorsement rejected successfully!");
      fetchEndorsements(); // refresh table
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white border rounded shadow-sm">
        <thead>
          <tr>
            <th className="p-2 border">Reference</th>
            <th className="p-2 border">Borrower</th>
            <th className="p-2 border">Penalty</th>
            <th className="p-2 border">Payable</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {endorsements.map(col => (
            <tr key={col._id}>
              <td className="p-2 border">{col.referenceNumber}</td>
              <td className="p-2 border">{col.name}</td>
              <td className="p-2 border">{formatCurrency(col.penaltyAmount)}</td>
              <td className="p-2 border">{formatCurrency(col.payableAmount)}</td>
              <td className="p-2 border space-x-2">
                {col.status === "Pending" ? (
                  <>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded"
                      onClick={() => handleApprove(col._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleReject(col._id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">{col.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
