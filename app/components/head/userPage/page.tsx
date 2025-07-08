"use client";

import { useRef, useState } from "react";
import HeadNavbar from "../headNavbar/page";
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiMoreVertical, FiLoader } from "react-icons/fi";
import { createPortal } from "react-dom";
import CreateUserModal from "./createUserModal";
import ErrorModal from "./errorModal";
import Head from "../page";
import { useUsersLogic } from "./logic"; 

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

function UserActions({
  onEdit,
  onDelete,
  onClose,
  anchorRef,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // handle outside click
  useState(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  // position dropdown
  useState(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192,
      });
    }
  });

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[9999] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
      style={{ top: position.top, left: position.left }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button onClick={onEdit} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <FiEdit2 className="mr-3 h-4 w-4" />
          Edit User
        </button>
        <button onClick={onDelete} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          <FiTrash2 className="mr-3 h-4 w-4" />
          Delete User
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function UsersPage() {
  const {
    users,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    roleFilter,
    setRoleFilter,
    errorMessage,
    errorModalOpen,
    setErrorModalOpen,
    setErrorMessage,
    sortedUsers,
    handleDeleteUser,
    handleCreateUser,
  } = useUsersLogic();

  const [showActions, setShowActions] = useState<{ userId: string; anchorEl: HTMLButtonElement | null } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditUser = (userId: string) => {
    setErrorMessage(`Edit user with ID: ${userId}`);
    setErrorModalOpen(true);
    setShowActions(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "head": return "text-blue-700";
      case "manager": return "text-green-700";
      case "loan officer":
      case "collector": return "text-yellow-700";
      default: return "text-gray-700";
    }
  };

  return (
    <Head>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "head", "manager", "loan officer", "collector"].map((roleOption) => {
              const isActive = (roleOption === "All" && !roleFilter) || roleFilter === roleOption;
              return (
                <button
                  key={roleOption}
                  className={`px-5 py-2 text-sm rounded-full border font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400
                  ${
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow"
                  }`}
                  onClick={() =>
                    setRoleFilter(
                      roleOption === "All"
                        ? ""
                        : roleOption as "" | "head" | "manager" | "loan officer" | "collector"
                    )
                  }
                >
                  {roleOption === "All" ? "All Roles" : roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Search & Create */}
          <div className="flex gap-4 mb-6 items-center justify-between">
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <FiUserPlus />
              Create User
            </button>
          </div>

          {/* User Table */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.userId} className="border-b border-gray-200 hover:bg-gray-100 relative">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{user.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getRoleColor(user.role)}`}>{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <button
                        onClick={(e) =>
                          setShowActions(
                            showActions && showActions.userId === user.userId
                              ? null
                              : { userId: user.userId, anchorEl: e.currentTarget }
                          )
                        }
                        className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600"
                        aria-label="User actions"
                      >
                        <FiMoreVertical />
                      </button>
                      {showActions && showActions.userId === user.userId && showActions.anchorEl && (
                        <UserActions
                          onEdit={() => handleEditUser(user.userId)}
                          onDelete={() => handleDeleteUser(user.userId)}
                          onClose={() => setShowActions(null)}
                          anchorRef={{ current: showActions.anchorEl }}
                        />
                      )}
                    </td>
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

        {/* Modals */}
        <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateUser} />
        <ErrorModal isOpen={errorModalOpen} message={errorMessage} onClose={() => setErrorModalOpen(false)} />
      </div>
    </Head>
  );
}
