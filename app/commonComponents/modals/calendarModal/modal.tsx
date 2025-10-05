"use client";

import { useState, useEffect } from "react";

interface InterviewModalProps {
  show: boolean;
  onClose: () => void;
  applicationId: string;
  currentDate?: string;
  currentTime?: string;
  onSave: (date: string, time: string) => void;
  onView: (applicationId: string) => void;
}

export default function InterviewModal({
  show,
  onClose,
  applicationId,
  currentDate,
  currentTime,
  onSave,
  onView,
}: InterviewModalProps) {
  const [date, setDate] = useState(currentDate || "");
  const [time, setTime] = useState(currentTime || "");

  useEffect(() => {
    setDate(currentDate || "");
    setTime(currentTime || "");
  }, [currentDate, currentTime]);

  if (!show) return null;

  const handleSave = () => {
    if (!date || !time) {
      alert("Please set both date and time before saving.");
      return;
    }
    onSave(date, time);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-150 text-black">
        <h2 className="text-xl font-semibold mb-4">Edit Interview Schedule</h2>

        {/* Date Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            placeholder="Set scheduled"
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Time Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Time</label>
          <input
            type="time"
            value={time}
            placeholder="Set scheduled"
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => onView(applicationId)}
          >
            View Application
          </button>
        </div>
      </div>
    </div>
  );
}
