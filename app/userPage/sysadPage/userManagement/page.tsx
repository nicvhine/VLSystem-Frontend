"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import Sysad from "../page";
import emailjs from "emailjs-com";
import ErrorModal from "@/app/commonComponents/modals/errorModal";
import ConfirmModal from "./confirmModal";
import CreateUserModal from "../../headPage/userPage/createUserModal";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL;

interface User {
  userId: string;
  name: string;
  role: string;
  email: string;
  username: string;
  phoneNumber: string;
  status?: "Active" | "Inactive";
}

export default function UserManagementPage({ currentUserRole }: { currentUserRole: string }) {
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Add user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Reset password state
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);

  // Error modal state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openErrorModal = (msg: string) => setErrorMessage(msg);
  const closeErrorModal = () => setErrorMessage(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authFetch(`${USER_URL}`);
        const data = await res.json();
        setActiveStaff(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        openErrorModal("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Create new user function for CreateUserModal
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
    // Validation
    const errors: { name?: string; email?: string; phoneNumber?: string } = {};
    if (!user.name) errors.name = "Name is required";
    if (!user.email) errors.email = "Email is required";
    if (!user.phoneNumber) errors.phoneNumber = "Phone number is required";

    if (Object.keys(errors).length > 0) {
      return { success: false, fieldErrors: errors, message: "Please fill all fields." };
    }

    try {
      const res = await authFetch(`${USER_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, message: data?.error || "Failed to create user" };
      }

      const createdUser = await res.json();
      setActiveStaff(prev => [...prev, createdUser]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error creating user." };
    }
  };

  // Reset password handlers
  const initiateResetPassword = (user: User) => setConfirmUser(user);
  const cancelResetPassword = () => setConfirmUser(null);

  const handleResetPasswordConfirmed = async () => {
    if (!confirmUser) return;

    try {
      setResettingUserId(confirmUser.userId);
      const res = await authFetch(`${USER_URL}/reset-password/${confirmUser.userId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset password");

      const { defaultPassword } = await res.json();

      // Send reset email
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID!,
        { to_name: confirmUser.name, to_email: confirmUser.email, temp_password: defaultPassword },
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_PUBLIC_KEY!
      );

      console.log(`Password reset successfully. New password: ${defaultPassword}`);
    } catch (err) {
      console.error("Reset password/email error:", err);
      openErrorModal("Error resetting password.");
    } finally {
      setResettingUserId(null);
      setConfirmUser(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading users...</p>;

  return (
    <Sysad>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        {errorMessage && <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />}

        {confirmUser && (
          <ConfirmModal
            isOpen={!!confirmUser}
            title="Reset Password"
            message={`Are you sure you want to reset password for ${confirmUser.name}?`}
            onConfirm={handleResetPasswordConfirmed}
            onCancel={cancelResetPassword}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Add Head User
          </button>
        </div>

        {/* Active Staff Table */}
        <div className="bg-white rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeStaff.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex gap-2">
                    <button
                      onClick={() => initiateResetPassword(user)}
                      disabled={resettingUserId === user.userId}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    >
                      {resettingUserId === user.userId ? "Resetting..." : "Reset Password"}
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
    </Sysad>
  );
}
