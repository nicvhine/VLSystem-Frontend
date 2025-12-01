"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import emailjs from "emailjs-com";
import { FiSearch, FiUserPlus, FiMoreVertical } from "react-icons/fi";
import ErrorModal from "@/app/commonComponents/modals/errorModal";
import SuccessModal from "@/app/commonComponents/modals/successModal";
import ConfirmModal from "./confirmModal";
import CreateUserModal from "../../headPage/userPage/createUserModal";
import { useTranslation } from "../translationHook";
import { User } from "@/app/commonComponents/utils/Types/userPage";
import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function UserManagementPage() {
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  // Action menu state
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionPopoverRef = useRef<HTMLDivElement | null>(null);
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Add user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Reset password state
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  // Toggle status state
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Confirm modal state
  const [confirmResetUser, setConfirmResetUser] = useState<User | null>(null);
  const [confirmToggleUser, setConfirmToggleUser] = useState<User | null>(null);

  // Error modal state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openErrorModal = (msg: string) => setErrorMessage(msg);
  const closeErrorModal = () => setErrorMessage(null);

  // Success modal state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const openSuccessModal = (msg: string) => setSuccessMessage(msg);
  const closeSuccessModal = () => setSuccessMessage(null);

  // Translation hook
  const { s, language } = useTranslation();

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

  useEffect(() => {
    const role = localStorage.getItem('role') || '';
    if (!role) {
      router.push('/');
      return;
    }
    setCurrentUserRole(role);

    const fetchUsers = async () => {
      try {
        const res = await authFetch(`${BASE_URL}/users`);
        const data = await res.json();
        setActiveStaff(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        openErrorModal(s.t67);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const sendEmail = async ({
    to_name,
    email,
    user_username,
    user_password,
    onError,
  }: {
    to_name: string;
    email?: string | null;
    user_username: string;
    user_password: string;
    onError: (msg: string) => void;
  }) => {
    if (!email) return;
    try {
      const result = await emailjs.send(
        "service_gsrml74",
        "template_ry9tq57",
        { to_name, email, user_username, user_password },
        "6VII8ATdscjZi3UYW"
      );
      console.log("Email sent:", result?.text || result);
    } catch (error: any) {
      console.error("EmailJS error:", error);
      onError("Email failed: " + (error?.text || error.message || "Unknown error"));
    }
  };

  const handleCreateUser = async (
    input: Omit<User, "userId" | "lastActive" | "status">
  ): Promise<{ success: boolean; fieldErrors?: { email?: string; phoneNumber?: string; name?: string }; message?: string }> => {
    try {
      const payload = { ...input };
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to parse server error
        let msg = "Failed to create user";
        try {
          const data = await res.json();
          msg = data?.error || data?.message || msg;
        } catch {
          try { msg = await res.text(); } catch {}
        }

        // Map known uniqueness errors to field-level errors
        const fieldErrors: { email?: string; phoneNumber?: string; name?: string } = {};
        if (/email\s+already\s+(registered|in use)/i.test(msg)) fieldErrors.email = "Email already in use.";
        if (/phone\s*number\s+already\s+(registered|in use)/i.test(msg)) fieldErrors.phoneNumber = "Phone number already in use.";
        if (/name\s+already\s+(registered|in use)/i.test(msg)) fieldErrors.name = "Name already in use.";

        if (fieldErrors.email || fieldErrors.phoneNumber || fieldErrors.name) {
          // Let caller show inline errors
          return { success: false, fieldErrors };
        }

        setErrorMessage(msg);
        setErrorModalOpen(true);
        return { success: false, message: msg };
      }

      const { user: createdUser, credentials } = await res.json();
      setUsers((prev) => [...prev, createdUser]);
      setSuccessMessage("User created successfully.");

      console.log("Email to send:", createdUser.email);

      await sendEmail({
        to_name: createdUser.name,
        email: createdUser.email,
        user_username: credentials.username,
        user_password: credentials.tempPassword,
        onError: (msg: string) => {
          console.error("Email error callback:", msg);
          setErrorMessage(msg);
          setErrorModalOpen(true);
          setTimeout(() => setErrorModalOpen(false), 5000);
        },
      });

      return { success: true };

    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create user");
      setErrorModalOpen(true);
      return { success: false, message: err.message };
    }
  };



  // Reset password handlers
  const initiateResetPassword = (user: User) => setConfirmResetUser(user);
  const cancelResetPassword = () => setConfirmResetUser(null);

  const handleResetPasswordConfirmed = async () => {
    if (!confirmResetUser) return;

    try {
      setResettingUserId(confirmResetUser.userId);
      setResetPasswordLoading(true);
      
      const res = await authFetch(`${BASE_URL}/users/reset-password/${confirmResetUser.userId}`, { method: "POST" });
      if (!res.ok) throw new Error(s.t67);

      const { defaultPassword } = await res.json();
      
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID!,
        { to_name: confirmResetUser.name, to_email: confirmResetUser.email, temp_password: defaultPassword },
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_PUBLIC_KEY!
      );
      
      openSuccessModal(`Password successfully reset for ${confirmResetUser.name}. ${s.t51} has been sent via email.`);
    } catch (err) {
      console.error("Reset password/email error:", err);
      openErrorModal(s.t67);
    } finally {
      setResetPasswordLoading(false);
      setResettingUserId(null);
      setConfirmResetUser(null);
    }
  };

  // Toggle status handlers (Activate/Deactivate)
  const initiateToggleStatus = (user: User) => setConfirmToggleUser(user);
  const cancelToggleStatus = () => setConfirmToggleUser(null);

  const handleToggleStatusConfirmed = async () => {
    if (!confirmToggleUser) return;

    try {
      setTogglingUserId(confirmToggleUser.userId);
      const newStatus = confirmToggleUser.status === 'Active' ? 'Inactive' : 'Active';
      
      const res = await authFetch(`${BASE_URL}/users/${confirmToggleUser.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update user status');

      setActiveStaff(prev => prev.map(u => 
        u.userId === confirmToggleUser.userId ? { ...u, status: newStatus } : u
      ));
      
      openSuccessModal(`Successfully ${newStatus === 'Active' ? 'activated' : 'deactivated'} ${confirmToggleUser.name}`);
    } catch (err) {
      console.error("Toggle status error:", err);
      openErrorModal("Failed to update user status");
    } finally {
      setTogglingUserId(null);
      setConfirmToggleUser(null);
    }
  };

  // Edit user handlers
  const handleEditClick = (user: User) => {
    setEditingUserId(user.userId);
    setEditFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
    });
  };

  const handleEditChange = (field: keyof User, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    if (!editingUserId) return;

    try {
      const res = await authFetch(`${BASE_URL}/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setActiveStaff(prev => prev.map(u => 
        u.userId === editingUserId ? { ...u, ...editFormData } as User : u
      ));

      openSuccessModal("User updated successfully");
      setEditingUserId(null);
      setEditFormData({});
    } catch (err) {
      console.error("Edit user error:", err);
      openErrorModal("Failed to update user");
    }
  };

  // Delete user handlers
  const initiateDeleteUser = (user: User) => setDeletingUser(user);
  const cancelDeleteUser = () => setDeletingUser(null);

  const handleDeleteUserConfirmed = async () => {
    if (!deletingUser) return;

    try {
      const res = await authFetch(`${BASE_URL}/users/${deletingUser.userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(s.t67);

      setActiveStaff(prev => prev.filter(u => u.userId !== deletingUser.userId));
      openSuccessModal(`Successfully deleted ${deletingUser.name}`); 
    } catch (err) {
      console.error("Delete user error:", err);
      openErrorModal(s.t67);
    } finally {
      setDeletingUser(null);
    }
  };

  // Filter and search users
  const filteredUsers = activeStaff.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalCount = filteredUsers.length;
  const showingStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * pageSize);

  const toggleActions = (userId: string) => {
    setOpenActionId((prev) => (prev === userId ? null : userId));
  };

  const handleAction = (action: "activate" | "deactivate" | "reset" | "edit", user: User) => {
    setOpenActionId(null);
    if (action === "reset") {
      initiateResetPassword(user);
    } else if (action === "activate" || action === "deactivate") {
      initiateToggleStatus(user);
    } else if (action === "edit") {
      handleEditClick(user);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">{s.t69} {s.t3.toLowerCase()}...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 py-8">
        {errorMessage && <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />}
        {successMessage && <SuccessModal isOpen={!!successMessage} message={successMessage} onClose={closeSuccessModal} />}

        {confirmResetUser && (
          <ConfirmModal
            isOpen={!!confirmResetUser}
            title={s.t34}
            message={`Are you sure you want to reset the password for ${confirmResetUser.name}?`}
            onConfirm={handleResetPasswordConfirmed}
            onCancel={cancelResetPassword}
            loading={resetPasswordLoading}
          />
        )}

        {confirmToggleUser && (
          <ConfirmModal
            isOpen={!!confirmToggleUser}
            title={confirmToggleUser.status === 'Active' ? 'Deactivate User' : 'Activate User'}
            message={`Are you sure you want to ${confirmToggleUser.status === 'Active' ? 'deactivate' : 'activate'} ${confirmToggleUser.name}?`}
            onConfirm={handleToggleStatusConfirmed}
            onCancel={cancelToggleStatus}
          />
        )}

        {deletingUser && (
          <ConfirmModal
            isOpen={!!deletingUser}
            title={s.t76}
            message={`${s.t74} ${deletingUser.name}?`}
            onConfirm={handleDeleteUserConfirmed}
            onCancel={cancelDeleteUser}
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{s.t3}</h1>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-full max-w-full">
            {["All", "head", "manager", "loan officer", "collector"].map((roleOption) => (
              <button
                key={roleOption}
                onClick={() => { setRoleFilter(roleOption === "All" ? "" : roleOption); setCurrentPage(1); }}
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
              placeholder="Search users..."
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
            <span className="leading-none">{s.t31}</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col className="w-[120px]" />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">ID</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t41}</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t39}</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t38}</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">Role</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">Status</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">{s.t43}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedUsers.map((user, index) => (
                <tr key={user.userId || index} className="hover:bg-gray-50 transition-colors cursor-pointer">
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
                          <option value="sysad">Sysad</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <select className="border border-gray-300 rounded px-2 py-1 w-full" value={editFormData.status || 'Active'} onChange={(e) => handleEditChange("status", e.target.value)}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center w-[120px]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={handleSaveEdit}
                            className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-sm text-red-600 hover:text-red-700 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.status || 'Active'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center w-[120px]">
                        <div className="relative inline-flex items-center justify-center">
                          <button
                            ref={(el) => { actionButtonRefs.current[user.userId] = el; }}
                            onClick={() => toggleActions(user.userId)}
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-gray-600"
                            aria-haspopup="menu"
                            aria-expanded={openActionId === user.userId}
                            aria-label={s.t43}
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </button>
                          {openActionId === user.userId && actionButtonRefs.current[user.userId] && (() => {
                            const rect = actionButtonRefs.current[user.userId]!.getBoundingClientRect();
                            const menuWidth = 160;
                            const menuHeight = 192; // approximate height for four options
                            const paginationTop = paginationRef.current?.getBoundingClientRect().top ?? window.innerHeight;
                            let top: number;
                            if (rect.bottom + menuHeight + 8 > paginationTop) {
                              top = rect.top - menuHeight - 12;
                            } else {
                              top = rect.bottom + 8;
                            }
                            if (top < 8) {
                              top = 8;
                            }
                            let left = rect.right - menuWidth;
                            if (left + menuWidth > window.innerWidth - 8) {
                              left = window.innerWidth - menuWidth - 8;
                            }
                            const style: React.CSSProperties = {
                              position: "fixed",
                              top,
                              left,
                              width: menuWidth,
                              zIndex: 9999,
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
                                  Edit
                                </button>
                                {user.status === 'Active' ? (
                                  <button
                                    onClick={() => handleAction("deactivate", user)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                    role="menuitem"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAction("activate", user)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                    role="menuitem"
                                  >
                                    Activate
                                  </button>
                                )}
                                <button
                                  onClick={() => handleAction("reset", user)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  role="menuitem"
                                >
                                  {s.t34}
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 font-semibold">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 text-black" ref={paginationRef}>
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

        {/* Add User Modal */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateUser}
          language={language}
        />
      </div>
    </div>
  );
}