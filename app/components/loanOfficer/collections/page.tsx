"use client";

import { useState, useEffect, Suspense } from 'react';
import Navbar from '../navbar';
import {
  FiSearch,
  FiChevronDown,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
} from 'react-icons/fi';

interface Collection {
  id: string;
  name: string;
  balance: number;
  pastDue: number;
  periodAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  collector: string;
  note?: string;
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
  const [selectedDate, setSelectedDate] = useState('March 25, 2025');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:3001/collections');
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const collectors = ['All', 'Rodelo', 'Earl', 'Shiela', 'Voltair', 'Morgan', 'Stephen'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
          <div className="col-span-4 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Collection Calendar</h2>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <span className="text-gray-500">Calendar Component Here</span>
            </div>
            <div className="mt-4 text-center text-blue-600 font-medium">{selectedDate}</div>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FiCheckCircle className="w-6 h-6 opacity-90" />
                <h3 className="text-lg font-medium">Collection Progress</h3>
              </div>
              <div className="text-3xl font-bold">Coming Soon</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="w-6 h-6 opacity-90" />
                <h3 className="text-lg font-medium">Amount Collected</h3>
              </div>
              <div className="text-3xl font-bold">Coming Soon</div>
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
                  {[
                    'ID',
                    'Name',
                    'Balance',
                    'Past Due',
                    'Period Amount',
                    'Paid Amount',
                    'Status',
                    'Collector',
                    'Note',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3.5 text-left text-sm font-medium text-gray-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9}>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : collections.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No collections found.
                    </td>
                  </tr>
                ) : (
                  collections
                    .filter(
                      (col) =>
                        (activeCollector === 'All' || col.collector === activeCollector) &&
                        col.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((col) => (
                      <tr
                        key={col.id}
                        className="hover:bg-blue-50/60 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{col.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.balance)}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(col.pastDue)}</td>
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
