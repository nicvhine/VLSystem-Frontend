"use client";

import { useState, useEffect, Suspense } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FiSearch,
  FiChevronDown,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
} from 'react-icons/fi';

interface Collection {
  loanId: string;
  borrowersId: string;
  name: string;
  referenceNumber: string;
  dueDate: string;
  periodAmount: number;
  paidAmount: number;
  totalPayment: number,
  loanBalance: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  collector: string;
  note?: string;
  collectionNumber: number;
}




function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCollector, setCurrentCollector] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  useEffect(() => {
    const storedCollector = localStorage.getItem("collectorName");
    setCurrentCollector(storedCollector);
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const storedCollector = localStorage.getItem("collectorName");

      if (!storedCollector) {
        setCollections([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/collections?collector=${encodeURIComponent(storedCollector)}`);
        const data = await response.json();
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

 

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const filteredCollections = collections.filter((col) => {
    const due = new Date(col.dueDate);
    const selected = selectedDate;
    const sameDate =
      due.getFullYear() === selected.getFullYear() &&
      due.getMonth() === selected.getMonth() &&
      due.getDate() === selected.getDate();

    const matchesCollector = col.collector === currentCollector;
    const matchesSearch = col.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCollector && matchesSearch && sameDate;
  });

const overallCollections = collections.filter(col => col.collector === currentCollector);

const overallTotalPayments = overallCollections.length;
const overallCompletedPayments = overallCollections.filter(col => col.status === 'Paid').length;
const overallCollectionRate = overallTotalPayments > 0
  ? Math.round((overallCompletedPayments / overallTotalPayments) * 100)
  : 0;

const overallTotalCollected = overallCollections.reduce((sum, col) => sum + col.paidAmount, 0);
const overallTotalTarget = overallCollections.reduce((sum, col) => sum + col.periodAmount, 0);
const overallTargetAchieved = overallTotalTarget > 0
  ? Math.round((overallTotalCollected / overallTotalTarget) * 100)
  : 0;


  const totalPayments = filteredCollections.length;
  const completedPayments = filteredCollections.filter(col => col.status === 'Paid').length;
  const collectionRate = totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0;
  const totalCollected = filteredCollections.reduce((sum, col) => sum + col.paidAmount, 0);
  const totalTarget = filteredCollections.reduce((sum, col) => sum + col.periodAmount, 0);
  const targetAchieved = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const handleMakePayment = (collection: Collection) => {
    setSelectedCollection(collection);
    setPaymentAmount(collection.periodAmount - collection.paidAmount);
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedCollection) return;

    try {
      const response = await fetch(`http://localhost:3001/collections/${selectedCollection.referenceNumber}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: paymentAmount }),
      });

      if (!response.ok) throw new Error('Failed to post payment');

      // Apply update only to next month's collection
      setCollections((prev) =>
        prev.map((col) => {
          if (
            col.loanId === selectedCollection.loanId &&
            col.collectionNumber === selectedCollection.collectionNumber + 1
          ) {
            const newPaid = (col.paidAmount || 0) + paymentAmount;
            const newBal = Math.max((col.loanBalance || col.periodAmount) - paymentAmount, 0);
            return {
              ...col,
              paidAmount: newPaid,
              balance: newBal,
              status: newBal === 0 ? 'Paid' : 'Partial',
            };
          }

          return col;
        })
      );

    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed.');
    } finally {
      setShowModal(false);
      setSelectedCollection(null);
      setPaymentAmount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8">
        {/* Calendar and Stats */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-4 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Collection Calendar</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                inline
              />
              <div className="text-blue-600 font-medium">
                {selectedDate.toDateString()}
              </div>
            </div>
          </div>

<div className="col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Daily Collection Progress */}
  <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl flex items-center gap-4">
    <div className="bg-blue-100 p-4 rounded-full shadow-sm">
      <FiCheckCircle className="text-blue-600 w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Daily Progress</p>
      <h3 className="text-3xl font-bold text-gray-800">{collectionRate}%</h3>
      <p className="text-sm text-gray-400">{completedPayments} of {totalPayments} payments</p>
    </div>
  </div>

  {/* Daily Amount Collected */}
  <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl flex items-center gap-4">
    <div className="bg-green-100 p-4 rounded-full shadow-sm">
      <FiDollarSign className="text-green-600 w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Daily Collection</p>
      <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(totalCollected)}</h3>
      <p className="text-sm text-gray-400">of {formatCurrency(totalTarget)} ({targetAchieved}%)</p>
    </div>
  </div>

  {/* Overall Progress */}
  <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl flex items-center gap-4">
    <div className="bg-purple-100 p-4 rounded-full shadow-sm">
      <FiCheckCircle className="text-purple-600 w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Overall Progress</p>
      <h3 className="text-3xl font-bold text-gray-800">{overallCollectionRate}%</h3>
      <p className="text-sm text-gray-400">{overallCompletedPayments} of {overallTotalPayments} payments</p>
    </div>
  </div>

  {/* Overall Amount Collected */}
  <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl flex items-center gap-4">
    <div className="bg-indigo-100 p-4 rounded-full shadow-sm">
      <FiDollarSign className="text-indigo-600 w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Overall Collection</p>
      <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(overallTotalCollected)}</h3>
      <p className="text-sm text-gray-400">of {formatCurrency(overallTotalTarget)} ({overallTargetAchieved}%)</p>
    </div>
  </div>
</div>


        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600"
            >
              <option value="">Sort by</option>
              <option value="amount">Amount</option>
              <option value="balance">Balance</option>
              <option value="status">Status</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <FiChevronDown className="text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Reference #</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Loan ID</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Total Payment</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Balance</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Period Amount</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Paid Amount</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Note</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={9}><LoadingSpinner /></td></tr>
                ) : filteredCollections.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">No collections found.</td>
                  </tr>
                ) : (
                  filteredCollections.map((col) => (
                    <tr key={col.referenceNumber} className="hover:bg-blue-50/60">
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.referenceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.loanId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{col.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.totalPayment)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.loanBalance)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.periodAmount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.paidAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          col.status === 'Paid' ? 'bg-green-100 text-green-800'
                          : col.status === 'Partial' ? 'bg-yellow-100 text-yellow-800'
                          : col.status === 'Overdue' ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'}`}>
                          {col.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{col.note || '-'}</td>
                      <td className="px-6 py-4">
                        {col.status !== 'Paid' ? (
                          <button
                            onClick={() => handleMakePayment(col)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Make Payment
                          </button>
                        ) : (
                          <span className="text-green-600 text-xs">Paid</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Suspense>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4">Make Payment for {selectedCollection.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Due Date: {new Date(selectedCollection.dueDate).toDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Period Amount: {formatCurrency(selectedCollection.periodAmount)}
            </p>
            <label className="block text-sm text-gray-700 mb-1">Enter Amount</label>
            <input
              type="number"
              className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
              min={0}
              max={selectedCollection.periodAmount}
            />
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleConfirmPayment}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
