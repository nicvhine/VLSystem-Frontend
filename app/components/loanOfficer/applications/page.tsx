"use client";

import { useState, Suspense } from 'react';
import Navbar from '../navbar';
import { FiSearch, FiChevronDown, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface Application {
  id: string;
  name: string;
  applicationDate: string;
  principalAmount: number;
  interestRate: number;
  status: 'Pending' | 'Accepted' | 'Denied' | 'Onhold';
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeFilter, setActiveFilter] = useState('Pending');

  const applications: Application[] = [
   
    {
      id: "APP002",
      name: "Jane Smith",
      applicationDate: "2024-03-23",
      principalAmount: 75000,
      interestRate: 2.5,
      status: "Onhold"
    },
    {
      id: "APP003",
      name: "Robert Johnson",
      applicationDate: "2024-03-22",
      principalAmount: 100000,
      interestRate: 3.0,
      status: "Accepted"
    },
    {
      id: "APP004",
      name: "Maria Garcia",
      applicationDate: "2024-03-21",
      principalAmount: 25000,
      interestRate: 2.0,
      status: "Denied"
    },
    {
      id: "APP005",
      name: "Nichole Garcia",
      applicationDate: "2024-03-21",
      principalAmount: 30000,
      interestRate: 10.0,
      status: "Pending"
    }
  ];

  const filteredApplications = applications.filter(application => {
    const matchesSearch = Object.values(application).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All') return true;
    return application.status === activeFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Loan Applications</h1>
            <p className="text-gray-500 mt-1">Manage and review loan applications</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeFilter === 'All'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          
          <button
            onClick={() => setActiveFilter('Pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeFilter === 'Pending'
                ? 'bg-yellow-50 text-yellow-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('Accepted')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeFilter === 'Accepted'
                ? 'bg-green-50 text-green-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveFilter('Denied')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeFilter === 'Denied'
                ? 'bg-red-50 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Denied
          </button>
          <button
            onClick={() => setActiveFilter('Onhold')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeFilter === 'Onhold'
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            On Hold
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID or amount..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
            >
              <option value="">Sort by</option>
              <option value="date">Release Date</option>
              <option value="amount">Amount</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <FiChevronDown className="text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Amount</th>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredApplications.map((application) => (
                <tr 
                  key={application.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link href={`/components/loanOfficer/applications/${application.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {application.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{application.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{formatDate(application.applicationDate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(application.principalAmount)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{application.interestRate}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'Denied' ? 'bg-red-100 text-red-800' :
                      application.status === 'Onhold' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status === 'Onhold' ? 'On Hold' : application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 