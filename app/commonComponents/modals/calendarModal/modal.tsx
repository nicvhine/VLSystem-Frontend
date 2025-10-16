"use client";

import { useState, useEffect, useRef } from "react";
import ErrorModal from "../errorModal/modal";
import ConfirmModal from "../confirmModal/ConfirmModal";

// Props interface for interview calendar modal component
interface InterviewModalProps {
  show: boolean;
  onClose: () => void;
  applicationId: string;
  currentDate?: string;
  currentTime?: string;
  onSave: (date: string, time: string) => void;
  onView: (applicationId: string) => void;
  appliedDate?: string;
}

/**
 * Interview calendar modal component for scheduling loan interviews
 * Handles date/time selection with validation and confirmation
 * @param show - Boolean to control modal visibility
 * @param onClose - Callback function to close the modal
 * @param applicationId - ID of the application being scheduled
 * @param currentDate - Currently selected date
 * @param currentTime - Currently selected time
 * @param onSave - Callback function to save the schedule
 * @param onView - Callback function to view application details
 * @returns JSX element containing the interview calendar modal
 */
export default function InterviewModal({
  show,
  onClose,
  applicationId,
  currentDate,
  currentTime,
  onSave,
  onView,
  appliedDate,
}: InterviewModalProps) {
  // Form state management
  const [date, setDate] = useState(currentDate || "");
  const [time, setTime] = useState(currentTime || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scheduling window: today through seven days after application date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appliedDateObj = appliedDate ? new Date(appliedDate) : new Date(today);
  appliedDateObj.setHours(0, 0, 0, 0);
  const minDateObj = new Date(today);
  const maxDateObj = new Date(appliedDateObj);
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const minDate = minDateObj.toISOString().split("T")[0];
  const maxDate = maxDateObj.toISOString().split("T")[0];

  // Update form fields when props change
  useEffect(() => {
    setDate(currentDate || "");
    setTime(currentTime || "");
  }, [currentDate, currentTime]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    }

    setIsAnimating(false);
    const timer = setTimeout(() => setIsVisible(false), 150);
    return () => clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);
  if (!isVisible) return null;

  const handleModalClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setShowConfirm(false);
    }, 150);
  };

  // Validate and show confirmation before saving
  const handleSave = () => {
    const showError = (message: string) => {
      setErrorMessage(message);
      setErrorOpen(true);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(() => setErrorOpen(false), 2000);
    };

    if (!date || !time) {
      showError("Please set both date and time before saving.");
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    if (selectedDate < minDateObj || selectedDate > maxDateObj) {
      showError("Interview date must be within seven days of the application and not in the past.");
      return;
    }

    const [hour, minute] = time.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      showError("Please provide a valid interview time.");
      return;
    }

    if (hour < 9 || hour > 18 || (hour === 18 && minute > 0)) {
      showError("Interview time must be between 9:00 AM and 6:00 PM.");
      return;
    }
    setShowConfirm(true);
  };

  // Confirm and save schedule changes
  const handleConfirm = () => {
    setShowConfirm(false);
    onSave(date, time);
  };

  // Cancel saving changes
  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleModalClose}
      >
        <div
          className={`bg-white p-6 text-black rounded-lg shadow-lg w-full max-w-md transition-all duration-150 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Interview Schedule</h2>
            <p className="text-sm text-gray-500">Update the borrower’s interview date and time.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Interview Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Interview Time
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-6">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => onView(applicationId)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              View Application
            </button>
          </div>
        </div>
      </div>
      <ErrorModal isOpen={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
      <ConfirmModal
        show={showConfirm}
        message="Do you want to save these changes?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
