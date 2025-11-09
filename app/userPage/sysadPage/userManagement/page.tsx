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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface User {
  userId: string;
  name: string;
  role: string;
  email: string;
  username: string;
  phoneNumber: string;
  status?: "Active" | "Inactive";
}

export default function UserManagementPage() {
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
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

  // Create new user
  const handleCreateUser = async (user: {
    name: string;
    email: string;
    phoneNumber: string;
    role: "head" | "manager" | "loan officer" | "collector";
    status?: "Active" | "Inactive";
  }): Promise<{
    success: boolean;
    fieldErrors?: { name?: string; email?: string; phoneNumber?: string };
    message?: string;
  }> => {
    const errors: { name?: string; email?: string; phoneNumber?: string } = {};
    if (!user.name) errors.name = "Name is required";
    if (!user.email) errors.email = "Email is required";
    if (!user.phoneNumber) errors.phoneNumber = "Phone number is required";

    if (Object.keys(errors).length > 0) {
      return { success: false, fieldErrors: errors, message: s.t67 };
    }

    try {
      const res = await authFetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, message: data?.error || s.t67 };
      }

      const createdUser = await res.json();
      setActiveStaff(prev => [...prev, createdUser]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: s.t67 };
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
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {s.t31}
        </button>
      </div>

      {/* Active Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t37}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t41}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t39}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t38}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{s.t43}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeStaff.map((user, index) => (
              <tr key={user.userId || index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex gap-2">
                  {/* Reset Password Button */}
                  <button
                    onClick={() => initiateResetPassword(user)}
                    disabled={resettingUserId === user.userId}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    {resettingUserId === user.userId ? `${s.t34}...` : s.t34}
                  </button>

                  {/* Delete User Button */}
                  <button
                  onClick={() => initiateDeleteUser(user)}
                  disabled={deletingUser?.userId === user.userId}
                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                >
                  {deletingUser?.userId === user.userId ? `Deleting...` : `Delete User`}
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <CreateUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onCreate={handleCreateUser}
        />
      )}
    </div>
  );
}
