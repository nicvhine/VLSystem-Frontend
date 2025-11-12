"use client";

import { useState, useEffect } from "react";

import ConfirmModal from "@/app/commonComponents/modals/confirmModal";
import translations from "@/app/commonComponents/translation";

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
  ) => Promise<{ success: boolean; fieldErrors?: { email?: string; phoneNumber?: string; name?: string }; message?: string }> | void;
  language?: "en" | "ceb";
}


export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
  language: languageOverride,
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
  const [checking, setChecking] = useState<{ name?: boolean; email?: boolean; phoneNumber?: boolean }>({});

  // Modal state management
  const [showConfirm, setShowConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [language, setLanguage] = useState<"en" | "ceb">(languageOverride ?? "en");

  useEffect(() => {
    if (languageOverride) {
      setLanguage(languageOverride);
    }
  }, [languageOverride]);

  useEffect(() => {
    if (languageOverride) return;
    if (typeof window === "undefined") return;

    const storedRole = localStorage.getItem("role") || "";
    const keyMap: Record<string, string> = {
      head: "headLanguage",
      "loan officer": "loanOfficerLanguage",
      manager: "managerLanguage",
    };

    const primaryKey = keyMap[storedRole] || "language";
    const storedLanguage =
      (localStorage.getItem(primaryKey) as "en" | "ceb") ||
      (localStorage.getItem("language") as "en" | "ceb") ||
      "en";
    setLanguage(storedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      const lang = event.detail?.language;
      if (lang !== "en" && lang !== "ceb") return;
      const target = event.detail?.userType;
      if (!target) {
        setLanguage(lang);
        return;
      }
      const matchesRole =
        (storedRole === "head" && target === "head") ||
        (storedRole === "loan officer" && target === "loanOfficer") ||
        (storedRole === "manager" && target === "manager");
      if (matchesRole) setLanguage(lang);
    };

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, [languageOverride]);

  const m = translations.managementTranslation[language];
  const b = translations.buttonTranslation[language];

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

  // Async uniqueness checks
  const USER_URL = process.env.NEXT_PUBLIC_USER_URL as string | undefined;

  const checkFieldUniqueness = async (field: 'email' | 'phoneNumber' | 'name', value: string) => {
    if (!USER_URL) return; // fallback: skip
    if (!value?.trim()) return; // nothing to check
    try {
      setChecking((p) => ({ ...p, [field]: true }));
      const endpoint = field === 'email' ? 'check-email' : field === 'phoneNumber' ? 'check-phone' : 'check-name';
      const res = await fetch(`${USER_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value.trim() }),
      });
      if (res.status === 409) {
        const msg = field === 'email' ? 'Email already in use.' : field === 'phoneNumber' ? 'Phone number already in use.' : 'Name already in use.';
        setErrors((prev) => ({ ...prev, [field]: msg }));
      } else if (!res.ok) {
        // Non-409 errors: do not block, but show a soft hint
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      } else {
        // available
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } catch (e) {
      // network error: do not block form
    } finally {
      setChecking((p) => ({ ...p, [field]: false }));
    }
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{m.u1}</h2>
        <p className="text-sm text-gray-500 mb-4">{m.u2}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder={m.u3}
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.name}
              onChange={handleChange}
              onBlur={() => checkFieldUniqueness('name', newUser.name)}
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
              placeholder={m.u4}
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.email}
              onChange={handleChange}
              onBlur={() => checkFieldUniqueness('email', newUser.email)}
              required
              autoComplete="off"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="tel"
              name="phoneNumber"
              placeholder={m.u5}
              className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              value={newUser.phoneNumber}
              onChange={handleChange}
              onBlur={() => checkFieldUniqueness('phoneNumber', newUser.phoneNumber)}
              minLength={11}
              maxLength={11}
              pattern="\d{11}"
              required
              autoComplete="off"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{m.u6}</label>
            <select
              name="role"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              value={newUser.role}
              onChange={handleChange}
            >
              <option value="head">{b.b14}</option>
              <option value="manager">{b.b15}</option>
              <option value="loan officer">{b.b16}</option>
              <option value="collector">{b.b17}</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              {b.b5}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              disabled={
                !!errors.name || !!errors.email || !!errors.phoneNumber ||
                !newUser.name.trim() || !newUser.email.trim() || !newUser.phoneNumber.trim() ||
                checking.name || checking.email || checking.phoneNumber
              }
            >
              {m.u7}
            </button>
          </div>
          <ConfirmModal
            show={showConfirm}
            message={m.u8}
            onConfirm={handleConfirmCreate}
            onCancel={() => setShowConfirm(false)}
          />
        </form>
      </div>
    </div>
  );
}
