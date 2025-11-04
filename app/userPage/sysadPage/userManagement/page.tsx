"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/app/commonComponents/loanApplication/function";
import Sysad from "../page";
import emailjs from "emailjs-com";
import ErrorModal from "@/app/commonComponents/modals/errorModal";
import ConfirmModal from "./confirmModal";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL;

interface User {
  userId: string;
  name: string;
  role: string;
  email: string;
  username: string;
}

export default function UserManagementPage({ currentUserRole }: { currentUserRole: string }) {
  const [activeStaff, setActiveStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Add user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "head" });

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

  // Create new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return openErrorModal("Please fill in all fields.");
    try {
      const res = await authFetch(`${USER_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to create user");

      const createdUser = await res.json();
      setActiveStaff(prev => [...prev, createdUser]);
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", role: "head" });
    } catch (err) {
      console.error(err);
      openErrorModal("Error creating user.");
    }
  };

  // Initiate reset password (opens confirmation modal)
  const initiateResetPassword = (user: User) => setConfirmUser(user);
  const cancelResetPassword = () => setConfirmUser(null);

  // Reset password confirmed
  const handleResetPasswordConfirmed = async () => {
    if (!confirmUser) return;

    try {
      setResettingUserId(confirmUser.userId);

      const res = await authFetch(`${USER_URL}/reset-password/${confirmUser.userId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset password");

      const { defaultPassword } = await res.json();

      // Send reset email
      const emailParams = { to_name: confirmUser.name, to_email: confirmUser.email, temp_password: defaultPassword };
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID!,
        emailParams,
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
        {/* Error Modal */}
        {errorMessage && <ErrorModal isOpen={!!errorMessage} message={errorMessage} onClose={closeErrorModal} />}

        {/* Confirm Reset Modal */}
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
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
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
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-lg font-semibold mb-4">Add Head User</h2>
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="text"
                value="head"
                disabled
                className="w-full p-2 border rounded mb-3 bg-gray-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sysad>
  );
}
