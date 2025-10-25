'use client';

import Head from '@/app/userPage/headPage/page';
import Manager from '@/app/userPage/managerPage/page';
import LoanOfficer from '@/app/userPage/loanOfficerPage/page';
import AddAgentModal from '@/app/commonComponents/modals/addAgent/modal';
import SuccessModal from '@/app/commonComponents/modals/successModal';
import Pagination from '../utils/pagination';
import { useAgentPage } from './hook';
import Filter from '../utils/sortAndSearch';
import { LoadingSpinner } from '@/app/commonComponents/utils/loading';

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

  if (!role) return <div className="text-center py-8"><LoadingSpinner /></div>;

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

          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "handled", label: t.l19 },
              { value: "amount", label: t.l4 },
            ]}
            t={t}
          />


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
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500 text-lg"><LoadingSpinner /></td></tr>
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