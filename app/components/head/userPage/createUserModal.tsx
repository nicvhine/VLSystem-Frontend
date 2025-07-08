"use client";

import { useState } from "react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    user: {
      name: string;
      email: string;
      phoneNumber: string;
      role: "head" | "manager" | "loan officer" | "collector";
      status?: "Active" | "Inactive";
    }
  ) => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: CreateUserModalProps) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "head" as const,
    status: "Active" as const,
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
    if (!newUser.name.trim()) {
      alert("Please enter a name.");
      return;
    }
    if (!newUser.email.trim()) {
      alert("Please enter an email address.");
      return;
    }
    if (!newUser.name.trim().includes(" ")) {
      alert("Please enter a full name with first and last name.");
      return;
    }
    onCreate(newUser);
    onClose();
    setNewUser({ name: "", email: "", phoneNumber: "", role: "head", status: "Active" });
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
          <input
            type="text"
            name="email"
            placeholder="Enter Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            value={newUser.email}
            onChange={handleChange}
            required
          />
          <input
            type="contact"
            name="phoneNumber"
            placeholder="Enter Phone Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            value={newUser.phoneNumber}
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
