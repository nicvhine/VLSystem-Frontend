import { useEffect, useState } from "react";
import emailjs from "emailjs-com";

const API_URL = "http://localhost:3001/users";

export interface User {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "head" | "manager" | "loan officer" | "collector";
  status: "Active" | "Inactive";
  lastActive: string;
}

export function useUsersLogic() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"" | "name" | "role">("");
  const [roleFilter, setRoleFilter] = useState<"" | User["role"]>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionConfig, setDecisionConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    danger?: boolean;
    error?: string;
  } | null>(null);
  

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendEmail = async (
    {
      to_name,
      email,
      user_username,
      user_password,
    }: {
      to_name: string;
      email: string;
      user_username: string;
      user_password: string;
    },
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
      onError(
        "Failed to send email: " + (error?.text || error.message || "Unknown error")
      );
    }
  };

  const handleCreateUser = async (
    input: Omit<User, "userId" | "lastActive" | "status"> & {
      status?: User["status"];
    }
  ) => {
    try {
      const payload = {
        name: input.name,
        email: input.email,
        phoneNumber: input.phoneNumber,
        role: input.role,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text() || "Failed to create user");

      const { user: createdUser, credentials } = await res.json();
      setUsers((prev) => [...prev, createdUser]);

      if (!credentials?.password) {
        setErrorMessage("User created, but login credentials were not returned.");
        setErrorModalOpen(true);
        return;
      }

      await sendEmail(
        {
          to_name: createdUser.name,
          email: createdUser.email,
          user_username: createdUser.username,
          user_password: credentials.password,
        },
        (msg) => {
          setErrorMessage(msg);
          setErrorModalOpen(true);
        }
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create user.");
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
          const response = await fetch(`http://localhost:3001/users/${userId}`, {  
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete user");
          }
  
          setUsers((prev) => prev.filter((u) => u.userId !== userId));
          setDecisionModalOpen(false);
        } catch (err: any) {
          console.error("Error deleting user:", err);
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
      message: "Are you sure you want to save the changes to this user?",
      confirmText: "Save",
      onConfirm: async () => {
        try {
          const payload: Partial<User> = {
            name: editFormData.name,
            email: editFormData.email,
            phoneNumber: editFormData.phoneNumber,
            role: editFormData.role, 
            status: editFormData.status ?? "Active",
          };
  
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:3001/users/${editingUserId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            const errorMsg = data.message || "Failed to save user";
            setDecisionConfig(prev => prev ? { ...prev, error: errorMsg } : prev);
            return;
          }          
  
          const updatedUser = data.user;
  
          setUsers((prev) =>
            prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
          );
  
          setEditFormData({});
          setEditingUserId(null);
          setDecisionModalOpen(false);
        } catch (err: any) {
          console.error("Error saving user:", err);
          setErrorMessage(err.message || "Failed to save user");
          setErrorModalOpen(true);
          setDecisionModalOpen(false);
        }
      },
    });
  
    setDecisionModalOpen(true);
  };
  

  
 


  const filteredUsers = users
    .filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .filter((user) => !roleFilter || user.role === roleFilter);

  const sortedUsers = sortBy
    ? [...filteredUsers].sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
    : filteredUsers;

  return {
    users,
    setUsers, 
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
    handleCreateUser,
    handleDeleteUser,
    handleSaveEdit,
    fetchUsers,
    decisionModalOpen,
    setDecisionModalOpen,
    decisionConfig,
    setDecisionConfig,
    editingUserId,  
    setEditingUserId, 
    editFormData,   
    setEditFormData,
  };
}