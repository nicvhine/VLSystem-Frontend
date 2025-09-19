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
import HeadNavbar from '../navbar/page';

interface Collection {
  loanId: string;
  borrowersId: string;
  name: string;
  collectionNumber: number;
  dueDate: string;
  periodAmount: number;
  paidAmount: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  collector: string;
  note?: string;
  referenceNumber: string;
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
  const [activeCollector, setActiveCollector] = useState('All');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCollector, setCurrentCollector] = useState<string | null>(null);

useEffect(() => {
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const url = 'http://localhost:3001/collections'; // No ?collector
      const response = await fetch(url);
      const data = await response.json();

      console.log('Fetched collections:', data);

      if (Array.isArray(data)) {
        setCollections(data);
      } else if (Array.isArray(data.collections)) {
        setCollections(data.collections);
      } else {
        console.error('Unexpected response format:', data);
        setCollections([]);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
      setCurrentCollector(activeCollector === 'All' ? null : activeCollector);
    }
  };

  fetchCollections();
}, [activeCollector]);


  const collectors = ['All', 'Rodelo', 'Earl', 'Shiela', 'Voltair', 'Morgan', 'Stephen'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Calculate statistics
  const filteredCollections = collections.filter((col) => {
    const due = new Date(col.dueDate);
    const selected = selectedDate;
    const sameDate =
      due.getFullYear() === selected.getFullYear() &&
      due.getMonth() === selected.getMonth() &&
      due.getDate() === selected.getDate();

    const matchesCollector =
    activeCollector === 'All' ||
    col.collector?.split(' ')[0].toLowerCase() === activeCollector.toLowerCase();

    const matchesSearch = col.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCollector && matchesSearch && sameDate;
  });

const overallCollections = collections.filter(col =>
  currentCollector === null
    ? true
    : col.collector?.split(' ')[0].toLowerCase() === currentCollector.toLowerCase()
);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <HeadNavbar />
      <div className="mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Collections</h1>

        {/* Collector Filters */}
        <div className="flex items-center gap-2 mb-6">
          {collectors.map((collector) => (
            <button
              key={collector}
              onClick={() => setActiveCollector(collector)}
              className={`px-4 py-1.5 rounded-md text-sm ${
                activeCollector === collector
                  ? 'bg-red-200 text-red-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {collector}
            </button>
          ))}
        </div>

        {/* Calendar and Stats Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Calendar Section */}
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
                className="rounded-md"
              />
              <div className="text-blue-600 font-medium">
                {selectedDate.toDateString()}
              </div>
            </div>
          </div>

          {/* Stats Cards Section */}
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

        {/* Search and Sort Controls */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
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

        {/* Collections Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Reference Number</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Balance</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Period Amount</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Paid Amount</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Collector</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">Note</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8}>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredCollections.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No collections found.
                    </td>
                  </tr>
                ) : (
                  filteredCollections.map((col) => (
                    <tr
                      className="hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.referenceNumber}</td>

                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.loanId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{col.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.balance)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.periodAmount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.paidAmount)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            col.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : col.status === 'Partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : col.status === 'Overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {col.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{col.collector}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{col.note || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Suspense>
        </div>
      </div>
    </div>
  );
}