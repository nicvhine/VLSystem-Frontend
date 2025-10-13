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
  const [successMessage, setSuccessMessage] = useState("");
  
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
    input: Omit<User, "userId" | "lastActive" | "status"> & { status?: User["status"] }
  ): Promise<{ success: boolean; fieldErrors?: { email?: string; phoneNumber?: string; name?: string }; message?: string }> => {
    try {
      // Client-side duplicate checks for better UX
      const normalizedEmail = input.email.trim().toLowerCase();
      const normalizedName = input.name.trim().toLowerCase().replace(/\s+/g, " ");
      const existingEmail = users.some(u => u.email?.toLowerCase() === normalizedEmail);
      const existingPhone = users.some(u => u.phoneNumber === input.phoneNumber);
      const existingName = users.some(u => (u.name || "").trim().toLowerCase().replace(/\s+/g, " ") === normalizedName);

      if (existingEmail || existingPhone || existingName) {
        return {
          success: false,
          fieldErrors: {
            ...(existingEmail ? { email: "Email is already taken." } : {}),
            ...(existingPhone ? { phoneNumber: "Phone number is already in use." } : {}),
            ...(existingName ? { name: "A user with this name already exists." } : {}),
          },
          message: "Duplicate fields detected.",
        };
      }

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

      if (!res.ok) {
        // Try to parse message and status for more specific handling
        let rawText = "";
        try { rawText = await res.text(); } catch {}
        const msg = rawText || "Failed to create user";
        // If duplicate email (commonly 409), surface as field error and do not open global modal
        const emailDup = res.status === 409 || /email/i.test(msg) && /(exists|taken|duplicate|already)/i.test(msg);
        const phoneDup = /phone|number/i.test(msg) && /(exists|taken|duplicate|already|in use)/i.test(msg);
        const nameDup = /name/i.test(msg) && /(exists|duplicate|already)/i.test(msg);
        if (emailDup || phoneDup || nameDup) {
          return {
            success: false,
            fieldErrors: {
              ...(emailDup ? { email: "Email is already taken." } : {}),
              ...(phoneDup ? { phoneNumber: "Phone number is already in use." } : {}),
              ...(nameDup ? { name: "A user with this name already exists." } : {}),
            },
            message: msg,
          };
        }
        // Other errors: open global error modal and return failure
        setErrorMessage(msg);
        setErrorModalOpen(true);
        return { success: false, message: msg };
      }

      const { user: createdUser, credentials } = await res.json();
      setUsers((prev) => [...prev, createdUser]);
      // Show success immediately upon user creation
  setSuccessMessage("User created successfully.");

      if (!credentials?.password) {
        setErrorMessage("User created, but login credentials were not returned.");
        setErrorModalOpen(true);
        return { success: true }; // Skip email sending when no credentials
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
      // Optionally we could update success message to include email notification; keeping it simple for now.
      return { success: true };
    } catch (error: any) {
      const msg = error?.message || "Failed to create user.";
      setErrorMessage(msg);
      setErrorModalOpen(true);
      return { success: false, message: msg };
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
          setSuccessMessage("User deleted successfully.");
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
          setSuccessMessage("User updated successfully.");
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
    successMessage,
    setSuccessMessage,
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