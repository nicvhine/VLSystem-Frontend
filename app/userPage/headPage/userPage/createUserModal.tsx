"use client";

import { useState, useEffect } from "react";

import ConfirmModal from "@/app/commonComponents/modals/confirmModal/ConfirmModal";

// Props interface for CreateUserModal component
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
  ) => Promise<{ success: boolean; fieldErrors?: { email?: string }; message?: string }> | void;
}

/**
 * Modal component for creating new users
 * Handles form validation, user input, and confirmation before creation
 * @param isOpen - Boolean to control modal visibility
 * @param onClose - Callback function to close the modal
 * @param onCreate - Callback function to create the user with provided data
 * @returns JSX element containing the create user modal
 */
export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: CreateUserModalProps) {
  // Form state for new user data
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "head" as const,
    status: "Active" as const,
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<{ name?: string; email?: string; phoneNumber?: string }>({});

  // Modal state management
  const [showConfirm, setShowConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger entrance animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for exit animation to complete before hiding
      setTimeout(() => setIsVisible(false), 150);
    }
  }, [isOpen]);

  const handleModalClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setShowConfirm(false);
    }, 150);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) error = "Name must contain only letters and spaces.";
      else if (value.length < 2) error = "Name must be at least 2 characters.";
      else if (value.length > 50) error = "Name must be at most 50 characters.";
      else if (value && !value.includes(" ")) error = "Please enter a full name (first and last).";
    }
    if (name === "email") {
      if (!/^\S+@\S+\.\S+$/.test(value)) error = "Please enter a valid email address.";
    }
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) error = "Phone number must contain only digits.";
      else if (value.length !== 11 && value.length > 0) error = "Phone number must be exactly 11 digits.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!newUser.name.trim()) newErrors.name = "Please enter a name.";
    else if (!/^[A-Za-z ]{2,50}$/.test(newUser.name.trim())) newErrors.name = "Name must be 2-50 letters and spaces only.";
    else if (!newUser.name.trim().includes(" ")) newErrors.name = "Please enter a full name (first and last).";
    if (!newUser.email.trim()) newErrors.email = "Please enter an email address.";
    else if (!/^\S+@\S+\.\S+$/.test(newUser.email.trim())) newErrors.email = "Please enter a valid email address.";
    if (!newUser.phoneNumber.trim()) newErrors.phoneNumber = "Please enter a phone number.";
    else if (!/^\d{11}$/.test(newUser.phoneNumber.trim())) newErrors.phoneNumber = "Phone number must be exactly 11 digits.";
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setShowConfirm(true);
  };

  const handleConfirmCreate = async () => {
    // Clear previous errors
    setErrors((prev) => ({ ...prev, email: undefined }));
    const result = await Promise.resolve(onCreate(newUser) as any);
    if (result && typeof result === 'object' && result.success === false) {
      // Show inline field errors and keep modal open
      if (result.fieldErrors) {
        setErrors((prev) => ({
          ...prev,
          ...(result.fieldErrors.email ? { email: result.fieldErrors.email } : {}),
          ...(result.fieldErrors.phoneNumber ? { phoneNumber: result.fieldErrors.phoneNumber } : {}),
          ...(result.fieldErrors.name ? { name: result.fieldErrors.name } : {}),
        }));
      }
      setShowConfirm(false);
      return;
    }
    // Success path: close and reset form
    handleModalClose();
    setNewUser({ name: "", email: "", phoneNumber: "", role: "head", status: "Active" });
    setShowConfirm(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleModalClose}
    >
      <div
        className={`bg-white p-6 text-black rounded-lg shadow-lg w-full max-w-md transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New User</h2>
        <p className="text-sm text-gray-500 mb-4">Fill out the details below to add a new team member.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.name}
              onChange={handleChange}
              minLength={2}
              maxLength={50}
              pattern="[A-Za-z ]+"
              required
              autoComplete="off"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.phoneNumber}
              onChange={handleChange}
              minLength={11}
              maxLength={11}
              pattern="\d{11}"
              required
              autoComplete="off"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <select
            name="role"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
            value={newUser.role}
            onChange={handleChange}
          >
            <option value="head">Head</option>
            <option value="manager">Manager</option>
            <option value="loan officer">Loan Officer</option>
            <option value="collector">Collector</option>
          </select>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleModalClose}
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
          <ConfirmModal
            show={showConfirm}
            message="Are you sure you want to create this user?"
            onConfirm={handleConfirmCreate}
            onCancel={() => setShowConfirm(false)}
          />
        </form>
      </div>
    </div>
  );
}
