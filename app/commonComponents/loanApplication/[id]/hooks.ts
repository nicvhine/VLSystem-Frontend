'use client';

import { useState, useEffect } from "react";
import { CharacterReference, Application } from "./types";

// Fetch applications with auth and normalize nested references
export function useApplications(apiUrl: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to add auth header from localStorage
  async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in localStorage");

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  }

  // Load applications on mount or when apiUrl changes
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token in localStorage");

        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        const mappedData = data.map((app: any) => ({
          ...app,
          appReferences: app.appReferences?.map((ref: any) => ({
            name: ref.name,
            contact: ref.contact,
            relation: ref.relation,
          })) || [],
        }));
        setApplications(mappedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [apiUrl]);

  return { applications, setApplications, loading };
}