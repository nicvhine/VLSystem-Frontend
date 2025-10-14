"use client";

import { useRef, useState, useEffect } from "react";
import { FiSearch, FiUserPlus, FiChevronDown, FiLoader, FiMoreVertical } from "react-icons/fi";
import Head from "../page";
import { useUsersLogic } from "./logic";
import type { User } from "./logic";
import React from "react";
// Removed portal-based dropdown; actions will be inline
import CreateUserModal from "./createUserModal";
import DecisionModal from "./modal";
import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
import headTranslations from "../components/translation"; 

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function Page() {
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("headLanguage") as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.userType === 'head') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const t = headTranslations[language];

  const {
    roleFilter,
    setRoleFilter,
    searchQuery,
    setSearchQuery,
    sortedUsers,
    loading,
    errorMessage,
    errorModalOpen,
    setErrorModalOpen,
    handleCreateUser,
    decisionModalOpen,
    setDecisionModalOpen,
    decisionConfig,
    setDecisionConfig,
    handleDeleteUser,
    handleSaveEdit,
    setUsers,
    editingUserId,  
    setEditingUserId, 
    editFormData,   
    setEditFormData,
    successMessage,
    setSuccessMessage,
  } = useUsersLogic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionPopoverRef = useRef<HTMLDivElement | null>(null);
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openActionId) return;
      const popoverEl = actionPopoverRef.current;
      const trigger = actionButtonRefs.current[openActionId];
      if (!popoverEl || !event.target) return;
      const target = event.target as Node;
      if (popoverEl.contains(target)) return;
      if (trigger && trigger.contains(target)) return;
      setOpenActionId(null);
    };

    const closeOnScroll = () => setOpenActionId(null);
    const closeOnResize = () => setOpenActionId(null);

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", closeOnResize);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [openActionId]);
  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalCount = sortedUsers.length;
  const showingStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * pageSize);
  // Inline actions now; no dropdown state needed
  
  // No outside-click handling needed without dropdown

  // No scroll handling needed without dropdown

  const handleEditClick = (user: User) => {
    setEditingUserId(user.userId);
    setEditFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      lastActive: user.lastActive
    });    
  };  

  const handleEditChange = (field: keyof User, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const toggleActions = (userId: string) => {
    setOpenActionId((prev) => (prev === userId ? null : userId));
  };

  const handleAction = (action: "edit" | "delete", user: User) => {
    setOpenActionId(null);
    if (action === "edit") {
      handleEditClick(user);
    } else {
      handleDeleteUser(user.userId);
    }
  };

  function capitalizeWords(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  
  return (
    <Head>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
            </div>
          </div>
          {/* Filter - Responsive */}
          <div className="mb-6">
            {/* Dropdown for mobile */}
            <div className="block sm:hidden relative max-w-full">
              <select
                value={roleFilter || "All"}
                onChange={(e) => { setRoleFilter(e.target.value === "All" ? "" : e.target.value as any); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
              >
                {["All", "head", "manager", "loan officer", "collector"].map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption === "All" ? "All Roles" : roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {/* Desktop buttons */}
            <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-full max-w-full">
              {["All", "head", "manager", "loan officer", "collector"].map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => { setRoleFilter(roleOption === "All" ? "" : roleOption as any); setCurrentPage(1); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    (roleFilter === roleOption || (!roleFilter && roleOption === "All"))
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ minWidth: 100 }}
                >
                  {roleOption === "All" ? t.allRoles : (roleOption === "head" ? t.head : roleOption === "manager" ? t.manager : roleOption === "loan officer" ? t.loanOfficer : t.collector)}
                </button>
              ))}
            </div>
          </div>
          {/* Search and Create User */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 w-full max-w-full">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white rounded-lg px-4 py-[14px] flex items-center gap-2 shadow-sm cursor-pointer hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 font-medium text-sm w-auto whitespace-nowrap"
            >
              <FiUserPlus className="w-4 h-4" />
              <span className="leading-none">{t.createUser}</span>
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <table className="min-w-full table-fixed">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col className="w-[120px]" />
                </colgroup>
                <thead>
                  <tr>
                    {[t.id, t.name, t.email, t.phoneNumber, t.role, t.actions].map((heading) => (
                      <th
                        key={heading}
                        className={`bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap${heading === "Actions" || heading === "Mga Aksyon" ? " text-center" : " text-left"}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{user.userId}</td>
                      {editingUserId === user.userId ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <input className="border border-gray-300 rounded px-2 py-1 w-full" value={editFormData.name || ''} onChange={(e) => handleEditChange("name", e.target.value)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <input className="border border-gray-300 rounded px-2 py-1 w-full" value={editFormData.email || ''} onChange={(e) => handleEditChange("email", e.target.value)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <input className="border border-gray-300 rounded px-2 py-1 w-full" value={editFormData.phoneNumber || ''} onChange={(e) => handleEditChange("phoneNumber", e.target.value)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <select className="border border-gray-300 rounded px-2 py-1 w-full" value={editFormData.role || ''} onChange={(e) => handleEditChange("role", e.target.value)}>
                              <option value="head">Head</option>
                              <option value="manager">Manager</option>
                              <option value="loan officer">Loan Officer</option>
                              <option value="collector">Collector</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center w-[120px]">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={handleSaveEdit}
                                className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
                              >
                                {t.save}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-sm text-red-600 hover:text-red-700 hover:underline"
                              >
                                {t.cancel}
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                ${user.role === "manager"
                                  ? "text-black"
                                  : user.role === "collector"
                                  ? "text-black"
                                  : user.role === "loan officer"
                                  ? "text-black"
                                  : user.role === "head"
                                  ? "text-black"
                                  : "bg-gray-100 text-gray-800"}
                              `}
                            >
                              {capitalizeWords(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center w-[120px]">
                            <div className="relative inline-flex items-center justify-center">
                              <button
                                ref={(el) => { actionButtonRefs.current[user.userId] = el; }}
                                onClick={() => toggleActions(user.userId)}
                                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-gray-600"
                                aria-haspopup="menu"
                                aria-expanded={openActionId === user.userId}
                                aria-label={t.actions}
                              >
                                <FiMoreVertical className="w-5 h-5" />
                              </button>
                              {openActionId === user.userId && actionButtonRefs.current[user.userId] && (() => {
                                const rect = actionButtonRefs.current[user.userId]!.getBoundingClientRect();
                                const style: React.CSSProperties = {
                                  position: "fixed",
                                  top: rect.bottom + 8,
                                  left: rect.right - 128,
                                  width: 128,
                                  zIndex: 40,
                                };
                                return (
                                  <div
                                    ref={actionPopoverRef}
                                    style={style}
                                    className="rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                                    role="menu"
                                  >
                                    <button
                                      onClick={() => handleAction("edit", user)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      role="menuitem"
                                    >
                                      {t.edit}
                                    </button>
                                    <button
                                      onClick={() => handleAction("delete", user)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      role="menuitem"
                                    >
                                      {t.delete}
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {sortedUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500 font-semibold">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination + Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 text-black">
            <div className="text-sm text-gray-700">
              {totalCount === 0 ? (
                <>Showing 0 of 0</>
              ) : (
                <>Showing <span className="font-medium">{showingStart}</span>–<span className="font-medium">{showingEnd}</span> of <span className="font-medium">{totalCount}</span></>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 bg-white border border-gray-300 rounded-md text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <span className="px-1 py-1 text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateUser} />
          {successMessage && (
            <SuccessModal isOpen={!!successMessage} message={successMessage} onClose={() => setSuccessMessage("")} />
          )}
        </div>
      </div>

      {decisionConfig && (
      <DecisionModal
      isOpen={decisionModalOpen}
      title={decisionConfig?.title || ""}
      message={decisionConfig?.message || ""}
      confirmText={decisionConfig?.confirmText}
      danger={decisionConfig?.danger}
      error={decisionConfig?.error} 
      onConfirm={decisionConfig?.onConfirm || (() => {})}
      onCancel={() => setDecisionModalOpen(false)}
    />
    
    )}

    </Head>
  );
}
