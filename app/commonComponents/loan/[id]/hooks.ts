import { useState, useEffect } from "react";
import { LoanDetails } from "./types";

const API_URL = "http://localhost:3001/loans";

export const useLoanDetails = (id: string) => {
  const [loan, setLoan] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setLoan(data);
      } catch (error) {
        console.error("Failed to fetch loan details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoanDetails();
  }, [id]);

  return { loan, loading, role };
};
