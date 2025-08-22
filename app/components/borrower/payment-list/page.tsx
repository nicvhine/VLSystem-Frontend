import React, { useEffect, useState } from 'react';

// Replace with actual values from user/session/context
const borrowersId = 'B00001';
const loanId = 'L00001';

interface PaymentScheduleEntry {
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  status: string;
  collector?: string;
}

export default function PaymentListPage() {
  const [payments, setPayments] = useState<PaymentScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/collections/schedule/${borrowersId}/${loanId}`);
        if (!res.ok) throw new Error('Failed to fetch payment schedule');
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError((err as Error).message || 'Error fetching payments');
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Payment Schedule</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Month</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Collector</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.collectionNumber}>
                <td className="py-2 px-4 border text-center">{p.collectionNumber}</td>
                <td className="py-2 px-4 border text-center">{new Date(p.dueDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td className="py-2 px-4 border text-center">₱{p.periodAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td className="py-2 px-4 border text-center">{p.status}</td>
                <td className="py-2 px-4 border text-center">{p.collector || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
