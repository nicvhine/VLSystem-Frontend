"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import emailjs from "emailjs-com";
import ErrorModal from "@/app/commonComponents/modals/errorModal";
import SuccessModal from "@/app/commonComponents/modals/successModal";
import ConfirmModal from "./confirmModal";
import CreateUserModal from "../../headPage/userPage/createUserModal";
import { useTranslation } from "../translationHook";
import { User } from "@/app/commonComponents/utils/Types/userPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function UserManagementPage() {
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  // Add user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Reset password state
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Confirm modal state
  const [confirmResetUser, setConfirmResetUser] = useState<User | null>(null);

  // Error modal state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openErrorModal = (msg: string) => setErrorMessage(msg);
  const closeErrorModal = () => setErrorMessage(null);

  // Success modal state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const openSuccessModal = (msg: string) => setSuccessMessage(msg);
  const closeSuccessModal = () => setSuccessMessage(null);

  // Translation hook
  const { s } = useTranslation();

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
      const res = await authFetch(`${BASE_URL}/users/reset-password/${confirmResetUser.userId}`, { method: "POST" });
      if (!res.ok) throw new Error(s.t67);

      const { defaultPassword } = await res.json();

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID!,
        { to_name: confirmResetUser.name, to_email: confirmResetUser.email, temp_password: defaultPassword },
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_PUBLIC_KEY!
      );

      openSuccessModal(`${s.t34} ${confirmResetUser.name}. ${s.t51}.`);
    } catch (err) {
      console.error("Reset password/email error:", err);
      openErrorModal(s.t67);
    } finally {
      setResettingUserId(null);
      setConfirmResetUser(null);
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
  };{activeStaff.map((user, index) => (
    <tr key={user.userId || index} className="hover:bg-gray-50 transition">
      ...
    </tr>
  ))}
  

  if (loading) return <p className="p-6 text-gray-500">{s.t69} {s.t3.toLowerCase()}...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {errorMessage && <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />}
      {successMessage && <SuccessModal isOpen={!!successMessage} message={successMessage} onClose={closeSuccessModal} />}

      {confirmResetUser && (
        <ConfirmModal
          isOpen={!!confirmResetUser}
          title={s.t34}
          message={`${s.t73} ${confirmResetUser.name}?`}
          onConfirm={handleResetPasswordConfirmed}
          onCancel={cancelResetPassword}
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-800">{s.t3}</h1>
        <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {s.t31}
        </button>
      </div>

      {/* Active Staff Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full table-fixed">
          <thead>
            <tr>
              <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t37}</th>
              <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t41}</th>
              <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t39}</th>
              <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t38}</th>
              <th className="bg-gray-50 px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{s.t43}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {activeStaff.map((user, index) => (
              <tr key={user.userId || index} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    {/* Reset Password Button */}
                    <button
                      onClick={() => initiateResetPassword(user)}
                      disabled={resettingUserId === user.userId}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resettingUserId === user.userId ? `${s.t34}...` : s.t34}
                    </button>

                    {/* Delete User Button */}
                    <button
                      onClick={() => initiateDeleteUser(user)}
                      disabled={deletingUser?.userId === user.userId}
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingUser?.userId === user.userId ? `Deleting...` : `Delete User`}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeStaff.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 font-semibold">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateUser} />
    </div>
  );
}