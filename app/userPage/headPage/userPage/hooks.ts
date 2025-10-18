import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import type { User, DecisionConfig } from "./types";

const API_URL = "http://localhost:3001/users";

export function useUsersLogic() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"" | "name" | "role">("");
  const [roleFilter, setRoleFilter] = useState<"" | User["role"]>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionConfig, setDecisionConfig] = useState<DecisionConfig | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch users.");
      const data = await res.json();
      setUsers(data);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to load users.");
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const sendEmail = async (
    { to_name, email, user_username, user_password }: { to_name: string; email: string; user_username: string; user_password: string },
    onError: (msg: string) => void
  ) => {
    try {
      await emailjs.send(
        "service_eph6uoe",
        "template_knwr0fa",
        { to_name, email, user_username, user_password },
        "-PgL14MSf1VScXI94"
      );
    } catch (error: any) {
      onError("Failed to send email: " + (error?.text || error.message || "Unknown error"));
    }
  };

  const handleCreateUser = async (input: Omit<User, "userId" | "lastActive" | "status">) => {
    try {
      const payload = { ...input };
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setErrorMessage(text || "Failed to create user");
        setErrorModalOpen(true);
        return;
      }

      const { user: createdUser, credentials } = await res.json();
      setUsers((prev) => [...prev, createdUser]);
      setSuccessMessage("User created successfully.");

      if (credentials?.password) {
        await sendEmail({
          to_name: createdUser.name,
          email: createdUser.email,
          user_username: createdUser.username,
          user_password: credentials.password,
        }, (msg) => { setErrorMessage(msg); setErrorModalOpen(true); });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create user");
      setErrorModalOpen(true);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setDecisionConfig({
      title: "Delete User?",
      message: "This action cannot be undone. Do you want to continue?",
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/${userId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) throw new Error(await res.text() || "Failed to delete user");
          setUsers((prev) => prev.filter(u => u.userId !== userId));
          setDecisionModalOpen(false);
          setSuccessMessage("User deleted successfully.");
        } catch (err: any) {
          setErrorMessage(err.message || "Failed to delete user");
          setErrorModalOpen(true);
        }
      },
    });
    setDecisionModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingUserId) return;
    setDecisionConfig({
      title: "Save Changes?",
      message: "Are you sure you want to save changes to this user?",
      confirmText: "Save",
      onConfirm: async () => {
        try {
          const payload: Partial<User> = { ...editFormData, status: editFormData.status ?? "Active" };
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/${editingUserId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
          const data = await res.json();
          if (!res.ok) { setDecisionConfig(prev => prev ? { ...prev, error: data.message } : prev); return; }
          setUsers(prev => prev.map(u => u.userId === data.user.userId ? data.user : u));
          setEditFormData({});
          setEditingUserId(null);
          setDecisionModalOpen(false);
          setSuccessMessage("User updated successfully.");
        } catch (err: any) {
          setErrorMessage(err.message || "Failed to save user");
          setErrorModalOpen(true);
          setDecisionModalOpen(false);
        }
      },
    });
    setDecisionModalOpen(true);
  };

  const filteredUsers = users
    .filter(u => Object.values(u).some(v => v?.toString().toLowerCase().includes(searchQuery.toLowerCase())))
    .filter(u => !roleFilter || u.role === roleFilter);

  const sortedUsers = sortBy ? [...filteredUsers].sort((a, b) => a[sortBy].localeCompare(b[sortBy])) : filteredUsers;

  return {
    users,
    setUsers,
    loading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortedUsers,
    handleCreateUser,
    handleDeleteUser,
    handleSaveEdit,
    successMessage,
    setSuccessMessage,
    decisionModalOpen,
    setDecisionModalOpen,
    decisionConfig,
    setDecisionConfig,
    editingUserId,
    setEditingUserId,
    editFormData,
    setEditFormData,
    errorMessage,
    setErrorMessage,
    errorModalOpen,
    setErrorModalOpen,
  };
}
