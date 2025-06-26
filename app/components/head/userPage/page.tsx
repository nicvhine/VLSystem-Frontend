"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar";
import {
  FiSearch,
  FiChevronDown,
  FiLoader,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";

const API_URL = "http://localhost:3001/users";

interface User {
  userId: string;
  name: string;
  role: "head" | "manager" | "loan officer" | "collector";
  status: "Active" | "Inactive";
  lastActive: string;
}

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
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onEdit}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <FiEdit2 className="mr-3 h-4 w-4" />
          Edit User
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <FiTrash2 className="mr-3 h-4 w-4" />
          Delete User
        </button>
      </div>
    </div>
  );
}

function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: Omit<User, "id" | "lastActive" | "status"> & { status?: User["status"] }) => void;
}) {
    const [newUser, setNewUser] = useState<Omit<User, "userId" | "lastActive">>({
    name: "",
    role: "head",
    status: "Active",
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name) return;
    onCreate(newUser);
    onClose();
    setNewUser({ name: "", role: "head", status: "Active" });
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 text-black rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            value={newUser.name}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            value={newUser.role}
            onChange={handleChange}
          >
            <option value="head">Head</option>
            <option value="manager">Manager</option>
            <option value="loan officer">Loan Officer</option>
            <option value="collector">Collector</option>
          </select>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"" | "name" | "role">("");
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );


 const sortedUsers = sortBy
    ? [...filteredUsers].sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy])
      )
    : filteredUsers;
    
  const getRoleColor = (role: string) => {
    switch (role) {
      case "head":
        return "text-blue-700";
      case "manager":
        return "text-green-700";
      case "loan officer":
        return "text-yellow-700";
      case "collector":
        return "text-yellow-700";
      default:
        return "text-gray-700";
    }
  };

  const handleEditUser = (userId: string) => {
    alert(`Edit user with ID: ${userId}`);
    setShowActions(null);
  };

  const handleDeleteUser = async (userId: string) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
    setShowActions(null);
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again.");
  }
};


 const handleCreateUser = async (
  input: Omit<User, "id" | "lastActive" | "status"> & { status?: User["status"] }
) => {
  try {
    const payload = {
      name: input.name,
      role: input.role,
    };

    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to create user");
    }

    const { user: createdUser } = await res.json();
    setUsers((prev) => [...prev, createdUser]);

  } catch (error) {
    console.error("Error creating user:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">

        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 rounded-lg bg-white border border-gray-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "role" | "")}
          >
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="role">Role</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <FiUserPlus />
            Create User
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 relative">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
              <tr
                key={user.userId}
                className="border-b border-gray-200 hover:bg-gray-100 relative"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {user.userId}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button
                      onClick={() =>
                        setShowActions(showActions === user.userId ? null : user.userId)
                      }
                      className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600"
                      aria-label="User actions"
                    >
                      <FiMoreVertical />
                    </button>
                    {showActions === user.userId && (
                      <UserActions
                        onEdit={() => handleEditUser(user.userId)}
                        onDelete={() => handleDeleteUser(user.userId)}
                      />
                    )}
                  </td>
                </tr>
              ))}

              {sortedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500 font-semibold"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}
