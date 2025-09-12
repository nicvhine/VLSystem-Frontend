"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface Payment {
  _id?: string;
  loanId: string;
  referenceNumber: string;
  borrowersId: string;
  collector?: string;
  amount: number;
  balance?: number;
  paidToCollection?: number;
  datePaid: string;
  status: string;
  mode?: string;
}

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string | null;
  totalPayable?: number;
}

export default function LedgerModal({
  isOpen,
  onClose,
  loanId,
  totalPayable = 0,
}: LedgerModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !loanId) return;

    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3001/payments/ledger/${loanId}`
        );
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err) {
        console.error("Failed to fetch ledger:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [isOpen, loanId]);

  if (!isOpen) return null;

  const sortedPayments = [...payments].sort(
    (a, b) =>
      new Date(a.datePaid).getTime() - new Date(b.datePaid).getTime()
  );

  let runningBalance = totalPayable;

  const formatCurrency = (amount?: number) =>
    typeof amount === "number"
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(amount)
      : "—";

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Payment Ledger
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading payments...</p>
        ) : sortedPayments.length === 0 ? (
          <p className="text-gray-500">No payment history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Reference #</th>
                  <th className="p-2 text-left">Collector</th>
                  <th className="p-2 text-left">Credit</th>
                  <th className="p-2 text-left">Debit</th>
                  <th className="p-2 text-left">Balance</th>
                  <th className="p-2 text-left">Mode</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((p) => {
                  const creditBefore = runningBalance;
                  runningBalance -= p.amount;
                  return (
                    <tr key={p._id} className="border-b border-gray-200">
                      <td className="p-2">
                        {new Date(p.datePaid).toLocaleDateString()}
                      </td>
                      <td className="p-2">{p.referenceNumber}</td>
                      <td className="p-2">{p.collector || "—"}</td>
                      <td className="p-2 text-green-600">
                        {formatCurrency(creditBefore)}
                      </td>
                      <td className="p-2 text-red-600">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="p-2 text-blue-600">
                        {formatCurrency(runningBalance)}
                      </td>
                      <td className="p-2">{p.mode || "Unknown"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
