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
  const [sortBy, setSortBy] = useState<string>('');

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
        let msg = s.t95;
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
      setSuccessMessage(s.t93);

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
      setErrorMessage(err.message || s.t95);
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
      
      openSuccessModal(`${s.t87} ${confirmResetUser.name}. ${s.t51} ${s.t88}`);
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
      
      if (!res.ok) throw new Error(s.t97);

      setActiveStaff(prev => prev.map(u => 
        u.userId === confirmToggleUser.userId ? { ...u, status: newStatus } : u
      ));
      
      openSuccessModal(`${s.t89} ${newStatus === 'Active' ? s.t90 : s.t91} ${confirmToggleUser.name}`);
    } catch (err) {
      console.error("Toggle status error:", err);
      openErrorModal(s.t97);
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
      // Don't include status - it should only be changed via Activate/Deactivate
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
      // Explicitly exclude status from edit payload - status can only be changed via Activate/Deactivate
      const { status, ...editPayload } = editFormData;
      
      const res = await authFetch(`${BASE_URL}/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPayload),
      });

      if (!res.ok) throw new Error(s.t96);

      setActiveStaff(prev => prev.map(u => 
        u.userId === editingUserId ? { ...u, ...editPayload } as User : u
      ));

      openSuccessModal(s.t94);
      setEditingUserId(null);
      setEditFormData({});
    } catch (err) {
      console.error("Edit user error:", err);
      openErrorModal(s.t96);
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
      openSuccessModal(`${s.t89} ${s.t92} ${deletingUser.name}`); 
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
      user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'role') {
      return a.role.localeCompare(b.role);
    }
    if (sortBy === 'date') {
      // Sort by userId as a proxy for creation date (assuming sequential IDs)
      return (a.userId || '').localeCompare(b.userId || '');
    }
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalCount = sortedUsers.length;
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
            message={`${s.t74.replace('proceed', `reset the password for ${confirmResetUser.name}`)}`}
            onConfirm={handleResetPasswordConfirmed}
            onCancel={cancelResetPassword}
            loading={resetPasswordLoading}
          />
        )}

        {confirmToggleUser && (
          <ConfirmModal
            isOpen={!!confirmToggleUser}
            title={confirmToggleUser.status === 'Active' ? s.t36 : s.t35}
            message={confirmToggleUser.status === 'Active' ? `${s.t49.replace('this user', confirmToggleUser.name)}` : `${s.t50.replace('this user', confirmToggleUser.name)}`}
            onConfirm={handleToggleStatusConfirmed}
            onCancel={cancelToggleStatus}
          />
        )}

        {deletingUser && (
          <ConfirmModal
            isOpen={!!deletingUser}
            title={s.t73}
            message={`${s.t48.replace('this user', deletingUser.name)}`}
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
          {/* Mobile Dropdown */}
          <div className="block sm:hidden relative max-w-full">
            <select
              value={roleFilter || "All"}
              onChange={(e) => { setRoleFilter(e.target.value === "All" ? "" : e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
            >
              {["All", "head", "manager", "loan officer", "collector", "sysad"].map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption === "All" ? s.t82 : roleOption === "sysad" ? s.t98 : roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {/* Desktop buttons */}
          <div className="hidden sm:flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm w-full max-w-full">
            {["All", "head", "manager", "loan officer", "collector", "sysad"].map((roleOption) => (
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
                {roleOption === "All" ? s.t82 : roleOption === "sysad" ? s.t98 : roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search, Sort and Create User */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 w-full max-w-full">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder={s.t46}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative w-full sm:w-[200px]">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all"
            >
              <option value="">{s.t99}</option>
              <option value="name">{s.t37}</option>
              <option value="role">{s.t41}</option>
              <option value="date">{s.t100}</option>
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t41}</th>
                <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t42}</th>
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
                          <option value="sysad">{s.t98}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.status || 'Active'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center w-[120px]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={handleSaveEdit}
                            className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
                          >
                            {s.t5}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-sm text-red-600 hover:text-red-700 hover:underline"
                          >
                            {s.t6}
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{user.role === 'sysad' ? s.t98 : user.role}</td>
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
                            const menuHeight = 144; // approximate height for three options
                            const viewportHeight = window.innerHeight;
                            const viewportWidth = window.innerWidth;
                            
                            // Get pagination position to avoid overlap
                            const paginationRect = paginationRef.current?.getBoundingClientRect();
                            const paginationTop = paginationRect ? paginationRect.top : viewportHeight;
                            
                            // Calculate position relative to viewport (getBoundingClientRect gives viewport coordinates)
                            let top: number;
                            const spaceBelow = paginationTop - rect.bottom; // Space until pagination
                            const spaceAbove = rect.top;
                            const wouldOverlapPagination = rect.bottom + menuHeight + 8 > paginationTop;
                            
                            // Check if positioning below would overlap with pagination
                            if (wouldOverlapPagination && spaceAbove >= menuHeight + 8) {
                              // Position above to avoid pagination
                              top = rect.top - menuHeight - 8;
                            } else if (spaceBelow >= menuHeight + 8 && !wouldOverlapPagination) {
                              // Position below (enough space and won't overlap)
                              top = rect.bottom + 8;
                            } else if (spaceAbove >= menuHeight + 8) {
                              // Position above (preferred when space below is limited)
                              top = rect.top - menuHeight - 8;
                            } else {
                              // Not enough space, position where there's more room
                              if (spaceBelow > spaceAbove && !wouldOverlapPagination) {
                                top = rect.bottom + 8;
                              } else {
                                top = rect.top - menuHeight - 8;
                              }
                            }
                            
                            // Ensure menu stays within viewport
                            top = Math.max(8, Math.min(top, viewportHeight - menuHeight - 8));
                            
                            let left = rect.right - menuWidth;
                            // Ensure menu stays within viewport horizontally
                            if (left < 8) {
                              left = 8;
                            } else if (left + menuWidth > viewportWidth - 8) {
                              left = viewportWidth - menuWidth - 8;
                            }
                            
                            const style: React.CSSProperties = {
                              position: "fixed",
                              top: `${top}px`,
                              left: `${left}px`,
                              width: `${menuWidth}px`,
                              zIndex: 9999,
                            };
                            return (
                              <div
                                ref={actionPopoverRef}
                                style={style}
                                className="rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none fixed"
                                role="menu"
                              >
                                <button
                                  onClick={() => handleAction("edit", user)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  role="menuitem"
                                >
                                  {s.t32}
                                </button>
                                {user.status === 'Active' ? (
                                  <button
                                    onClick={() => handleAction("deactivate", user)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                    role="menuitem"
                                  >
                                    {s.t36}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAction("activate", user)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                    role="menuitem"
                                  >
                                    {s.t35}
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
              {sortedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 font-semibold">
                    {s.t47}
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
              <>{s.t86} 0 {s.t71} 0</>
            ) : (
              <>{s.t86} <span className="font-medium">{showingStart}</span>–<span className="font-medium">{showingEnd}</span> {s.t71} <span className="font-medium">{totalCount}</span></>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{s.t85}:</span>
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
                {s.t83}
              </button>
              <span className="px-1 py-1 text-gray-700">
                {s.t70} <span className="font-medium">{currentPage}</span> {s.t71} <span className="font-medium">{totalPages}</span>
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                {s.t84}
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