'use client';

import { FiSearch, FiChevronDown } from 'react-icons/fi';
import Head from '@/app/userPage/headPage/page';
import Manager from '@/app/userPage/managerPage/page';
import LoanOfficer from '@/app/userPage/loanOfficerPage/page';
import AddAgentModal from '@/app/commonComponents/modals/addAgent/modal';
import SuccessModal from '@/app/commonComponents/modals/successModal/modal';
import Pagination from '../pagination';
import { useAgentPage } from './hook';

export default function AgentPage() {
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
    newAgentName,
    setNewAgentName,
    newAgentPhone,
    setNewAgentPhone,
    handleAddAgent,
    t,
  } = useAgentPage();

  if (!role) return <div className="text-center py-8">Loading role...</div>;

  const Wrapper = role === 'loan officer' ? LoanOfficer : role === 'head' ? Head : Manager;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{t.Agents}</h1>
            {role === 'loan officer' && (
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={() => setShowModal(true)}>
                {t.l39}
              </button>
            )}
          </div>

          {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.l22}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="relative w-full sm:w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                <option value="">{t.l38}</option>
                <option value="handled">{t.l19}</option>
                <option value="amount">{t.l4}</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="w-full rounded-lg bg-white shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l11}</th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l12}</th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l18}</th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l19}</th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l4}</th>
                  <th className="bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.l20}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-lg">Loading...</td></tr>
                ) : sortedAgents.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-lg">No agents found.</td></tr>
                ) : (
                  paginatedAgents.map(agent => (
                    <tr key={agent.agentId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{agent.agentId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{agent.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{agent.handledLoans}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">₱{agent.totalLoanAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">₱{agent.totalCommission.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AddAgentModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onAddAgent={handleAddAgent}
            loading={loading}
            newAgentName={newAgentName}
            setNewAgentName={setNewAgentName}
            newAgentPhone={newAgentPhone}
            setNewAgentPhone={setNewAgentPhone}
          />

          <SuccessModal isOpen={!!successMessage} message={successMessage} onClose={() => setSuccessMessage('')} />

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