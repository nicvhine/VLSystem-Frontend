"use client";

import { useRef, useState, useEffect } from "react";
  // Removed Floating UI imports
import HeadNavbar from "../headNavbar/page";
import { FiSearch, FiUserPlus, FiChevronDown, FiLoader, FiMoreVertical } from "react-icons/fi";
import ErrorModal from "./errorModal";
import Head from "../page";
import { useUsersLogic } from "./logic";
import type { User } from "./logic";
import React from "react";
import CreateUserModal from "./createUserModal";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function Page() {
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
    handleDeleteUser,
    handleCreateUser,
  } = useUsersLogic();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Pure CSS/JS dropdown state for three-dot menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // No need for reference attachment with pure CSS/JS dropdown

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e: MouseEvent) {
      if (
        openMenuId == null ||
        (!menuRefs.current[openMenuId]?.contains(e.target as Node) &&
        !buttonRefs.current[openMenuId]?.contains(e.target as Node))
      ) {
        setOpenMenuId(null);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [openMenuId]);

  const handleEditClick = (user: User) => {
    setEditingUserId(user.userId);
    setEditFormData({ ...user });
  };

  const handleEditChange = (field: keyof User, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    // Implement save logic here (API call or update state)
    setEditingUserId(null);
    setEditFormData({});
  };

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
                onChange={(e) => setRoleFilter(e.target.value === "All" ? "" : e.target.value as any)}
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
                  onClick={() => setRoleFilter(roleOption === "All" ? "" : roleOption as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    (roleFilter === roleOption || (!roleFilter && roleOption === "All"))
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ minWidth: 100 }}
                >
                  {roleOption === "All" ? "All Roles" : roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
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
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white rounded-lg px-5 py-2 flex items-center gap-2 shadow-md cursor-pointer hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transform hover:scale-105 font-semibold text-base w-full sm:w-72"
            >
              <FiUserPlus className="w-5 h-5" />
              <span>Create User</span>
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    {["ID", "Name", "Email", "Phone", "Role", "Actions"].map((heading) => (
                      <th
                        key={heading}
                        className={`bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap${heading === "Actions" ? " text-center" : " text-left"}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedUsers.map((user) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-right relative flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 font-medium hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${user.role === 'manager' ? 'bg-green-100 text-green-800' :
                                user.role === 'collector' ? 'bg-orange-100 text-orange-800' :
                                user.role === 'loan officer' ? 'bg-yellow-100 text-yellow-800' :
                                user.role === 'head' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right relative">
                            <div className="flex justify-center items-center">
                              <button
                                ref={el => {
                                  buttonRefs.current[user.userId] = el;
                                }}
                                onClick={() => setOpenMenuId(openMenuId === user.userId ? null : user.userId)}
                                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                              >
                                <FiMoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                            </div>
                            {openMenuId === user.userId && (
                              <div
                                ref={el => { menuRefs.current[user.userId] = el; }}
                                className="fixed w-20 border border-gray-300 rounded-lg shadow-2xl z-[9999]"
                                style={{
                                  top: `${(buttonRefs.current[user.userId]?.getBoundingClientRect().bottom || 0) + 8}px`,
                                  left: `${(buttonRefs.current[user.userId]?.getBoundingClientRect().left || 0) - 20}px`,
                                  backgroundColor: '#d4d4d4'
                                }}
                              >
                                  <button
                                    onClick={() => {
                                      handleEditClick(user);
                                      setOpenMenuId(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 rounded-t-lg"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteUser(user.userId);
                                      setOpenMenuId(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-300 rounded-b-lg"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
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
          <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateUser} />
          {/* Error Modal */}
          <ErrorModal isOpen={errorModalOpen} message={errorMessage} onClose={() => setErrorModalOpen(false)} />
        </div>
      </div>
      {/* ...existing code... */}
    </Head>
  );
}
