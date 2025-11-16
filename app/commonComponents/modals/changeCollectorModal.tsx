'use client';

import { useState, useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Collector {
  userId: string;
  name: string;
}

interface Props {
  currentCollector: string; 
  isOpen: boolean;
  onClose: () => void;
  borrowerId: string;
  onUpdated: (newCollectorId: string, newCollectorName: string) => void;
}

export default function ChangeCollectorModal({
  currentCollector,
  isOpen,
  onClose,
  borrowerId,
  onUpdated,
}: Props) {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState(currentCollector || "");
  const [loading, setLoading] = useState(false);

  // Sync selected collector when prop changes
  useEffect(() => {
    setSelectedCollectorId(currentCollector || "");
  }, [currentCollector]);

  // Fetch collectors from API with token
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) throw new Error("No token found");

        const res = await fetch(`${BASE_URL}/users/collectors`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch collectors");

        const data: Collector[] = await res.json();
        console.log("Collectors:", data);
        setCollectors(data);

        // If no collector is selected yet, default to first one
        if (!selectedCollectorId && data.length > 0) {
          setSelectedCollectorId(data[0].userId);
          console.log("Default selectedCollectorId set to:", data[0].userId);
        }
      } catch (err) {
        console.error("Error fetching collectors:", err);
      }
    };

    fetchCollectors();
  }, []);

  const handleSave = async () => {
    console.log("handleSave called");
    console.log("Selected Collector ID:", selectedCollectorId);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Match using userId
      const selectedCollector = collectors.find(c => c.userId === selectedCollectorId);
      console.log("Selected Collector object:", selectedCollector);

      if (!selectedCollector) throw new Error("Selected collector not found");

      const res = await fetch(`${BASE_URL}/borrowers/${borrowerId}/assign-collector`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignedCollector: selectedCollector.userId,
          assignedCollectorName: selectedCollector.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to update collector");

      console.log("Collector updated successfully:", selectedCollector);
      onUpdated(selectedCollector.userId, selectedCollector.name);
      onClose();
    } catch (err) {
      console.error("Error in handleSave:", err);
      alert("Failed to update collector");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Change Assigned Collector</h2>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedCollectorId}
          onChange={(e) => setSelectedCollectorId(e.target.value)}
        >
          {collectors.map(c => (
            <option key={c.userId} value={c.userId}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
