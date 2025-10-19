'use client';

import { useState, useEffect } from "react";
import { FiX, FiFileText } from "react-icons/fi";
import emailjs from "emailjs-com";
import SubmitOverlayToast from "@/app/commonComponents/utils/submitOverlayToast";

// API endpoint for loan applications
const API_URL = "http://localhost:3001/loan-applications";

// Props interface for schedule modal component
interface SetScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  authFetch: (url: string, options?: RequestInit) => Promise<any>;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
}

/**
 * Modal component for setting interview schedule on a loan application
 * Handles date/time selection, email notifications, and application status updates
 * @param isOpen - Boolean to control modal visibility
 * @param onClose - Callback function to close the modal
 * @param application - Application data object
 * @param setApplications - Function to update applications state
 * @param authFetch - Authenticated fetch function
 * @param showError - Function to display error messages
 * @param showSuccess - Function to display success messages
 * @returns JSX element containing the schedule modal
 */
export default function SetScheduleModal({
  isOpen,
  onClose,
  application,
  setApplications,
  authFetch,
  showError,
  showSuccess,
}: SetScheduleModalProps) {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");

  // Date restrictions for scheduling window
  const today = new Date();
  const appliedDate = application?.appliedDate ? new Date(application.appliedDate) : today;
  const minDate = today.toISOString().split("T")[0];
  const maxDateObj = new Date(appliedDate);
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split("T")[0];
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Precompute office-hour time slots (09:00 to 18:00)
  // Format HH:mm to 12-hour clock for email text
  function formatTimeTo12Hour(time: string) {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr || "0", 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  // Show/hide with animation based on isOpen
  // Animate open/close transitions
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      const t = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(t);
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape key unless processing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, loading]);

  if (!showModal) return null;

  // Persist schedule + set status, update local state and send email
  const handleSaveSchedule = async () => {

    if (!interviewDate || !interviewTime) {
      showError("Please select both date and time.");
      return;
    }

    // Validate time is between 09:00 and 18:00
    const [hour, minute] = interviewTime.split(":").map(Number);
    if (hour < 9 || hour > 18 || (hour === 18 && minute > 0)) {
      showError("Interview time must be between 9:00 AM and 6:00 PM.");
      return;
    }

    setLoading(true);
    try {
      const id = application?.applicationId ?? application?._id;
      if (!id) throw new Error("Missing application id");

      // Save schedule (PUT)
      const scheduleRes = await authFetch(`${API_URL}/${id}/schedule-interview`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewDate, interviewTime }),
      });
      if (!scheduleRes.ok) {
        showError("Could not schedule interview. Try again.");
        setLoading(false);
        return;
      }

      // Update status to Pending
      await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Pending" }),
      });

      // update local state in parent
      setApplications(prev =>
        prev.map(app =>
          (app.applicationId === id || app._id === id)
            ? { ...app, interviewDate, interviewTime, status: "Pending" }
            : app
        )
      );

      // send email (best-effort)
      if (application?.appEmail) {
        try {
          const formattedTime = formatTimeTo12Hour(interviewTime);
          await emailjs.send(
            "service_xmh62vd",
            "template_u19oksn",
            {
              email: application.appEmail,
              to_name: application.appName,
              address: application.appAddress,
              interviewDate,
              interviewTime: formattedTime,
            },
            "oXk6jvK9nrgWsbn_o"
          );
        } catch (err) {
          console.error("EmailJS error:", err);
          // intentionally not failing the whole flow
        }
      }

      showSuccess("Interview scheduled.");
      onClose(); // <-- notify parent to close modal
    } catch (err) {
      console.error(err);
      showError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubmitOverlayToast open={loading} message="Saving schedule..." />
      <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"}`}
      onMouseDown={() => { if (!loading) onClose(); }}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out ${animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        onMouseDown={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <FiFileText className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule Interview</h2>
          </div>
          <button
            onClick={() => { if (!loading) onClose(); }}
            className={`text-gray-500 hover:text-gray-700 ${loading ? 'opacity-50 cursor-not-allowed hover:text-gray-500' : ''}`}
            disabled={loading}
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Interview Date</span>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </label>

                {/* ErrorModal is now rendered in parent page */}
          <label className="block">
            <span className="text-sm text-gray-700">Interview Time</span>
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => { if (!loading) onClose(); }}
            className={`px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-300'}`}
            type="button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSchedule}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            type="button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Schedule Interview"}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
