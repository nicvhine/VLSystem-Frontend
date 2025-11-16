'use client';

import React from 'react';
import { useState } from 'react';
import { useAgentPage } from './hook';
import AddAgentModal from '@/app/commonComponents/modals/addAgent/modal';
import AgentModal from '../modals/editAgentModal';
import SuccessModal from '@/app/commonComponents/modals/successModal';
import Pagination from '../utils/pagination';
import Filter from '../utils/sortAndSearch';
import { LoadingSpinner } from '@/app/commonComponents/utils/loading';
import dynamic from 'next/dynamic';
import translations from '@/app/commonComponents/translation';
import { formatCurrency } from '../utils/formatters';

const Head = dynamic(() => import('@/app/userPage/headPage/layout'), { ssr: false });
const Manager = dynamic(() => import('@/app/userPage/managerPage/layout'), { ssr: false });
const LoanOfficer = dynamic(() => import('@/app/userPage/loanOfficerPage/layout'), { ssr: false });

export default function AgentPageClient() {
  const {
    role,
    paginatedAgents,
    sortedAgents,
    totalPages,
    totalCount,
    loading,
    error,
    successMessage,
    setSuccessMessage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    language,
    showModal,
    setShowModal,
    showEditModal,
    setShowEditModal,
    selectedAgent,
    setSelectedAgent,
    newAgentName,
    setNewAgentName,
    newAgentPhone,
    setNewAgentPhone,
    handleAddAgent,
    handleEditAgent,
    handleToggleAgent,
    openEditModal,
    t,
    agentLoans,
    setAgentLoans,
    toggleRow,
    expandedRows,
  } = useAgentPage();

  const m = translations.managementTranslation[language];

  if (!role)
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
      </div>
    );

  const Wrapper =
    role === 'loan officer'
      ? LoanOfficer
      : role === 'head'
      ? Head
      : Manager;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.Agents}</h1>
            {role === 'loan officer' && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setShowModal(true)}
              >
                {t.l39}
              </button>
            )}
          </div>

          {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

          {/* Search + Sort */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: 'handled', label: t.l19 },
              { value: 'amount', label: t.l4 },
            ]}
            t={t}
          />

          {/* Table */}
          <div className="w-full rounded-lg bg-white shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.l11}
                  </th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.l12}
                  </th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.l18}
                  </th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.l19}
                  </th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {t.l4}
                  </th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  {role === 'loan officer' && (
                    <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : sortedAgents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {m.g1}
                    </td>
                  </tr>
                ) : (
                  paginatedAgents.map(agent => (
                    <React.Fragment key={agent.agentId}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(agent.agentId)}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{agent.agentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{agent.phoneNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{agent.handledLoans}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₱{agent.totalLoanAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              agent.status === 'Active'
                                ? 'text-green-600 font-semibold'
                                : 'text-gray-600 font-semibold'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </td>
                        {role === 'loan officer' && (
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button
                              onClick={() => openEditModal(agent)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleAgent(agent)}
                              className={`px-3 py-1 rounded-md text-white ${
                                agent.status === 'Active'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {agent.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        )}
                      </tr>

                      {/* Expanded row */}
                      {expandedRows.includes(agent.agentId) && (  // <-- use hook's expandedRows
                      <tr className="bg-gray-100">
                        <td colSpan={7} className="px-6 py-4 text-sm text-gray-700">
                          <strong>Handled Loans:</strong>
                          <ul className="list-disc ml-5 mt-2">
                            {agentLoans[agent.agentId]?.length > 0
                              ? agentLoans[agent.agentId].map((loan, idx) => (
                                  <li key={idx}>
                                    {loan.appName} - {formatCurrency(loan.appLoanAmount)} - {loan.status}
                                  </li>
                                ))
                              : <li>No loans yet</li>}
                          </ul>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* Modals */}
          <AddAgentModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onAddAgent={handleAddAgent}
            loading={loading}
            newAgentName={newAgentName}
            setNewAgentName={setNewAgentName}
            newAgentPhone={newAgentPhone}
            setNewAgentPhone={setNewAgentPhone}
            language={language}
          />

          <AgentModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            agent={selectedAgent}
            onSave={handleEditAgent}
            loading={loading}
          />

          <SuccessModal
            isOpen={!!successMessage}
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />

          <Pagination
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            language={language}
          />

        </div>
      </div>
    </Wrapper>
  );
}
