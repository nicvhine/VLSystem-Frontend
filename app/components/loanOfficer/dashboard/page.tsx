'use client';

import LoanStatsDashboard from "./loanStats";
import LoanOfficer from "../page";
import { useState } from "react";
import InterviewCalendar from "./interviewCalendar";

export default function LoanOfficerDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  return (
    <LoanOfficer>
      <div className="min-h-screen bg-white relative z-10">
        <div className="bg-white px-6">
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 min-h-[calc(100vh-140px)]">
            <LoanStatsDashboard />

            <InterviewCalendar 
            />
          </div>
        </div>
      </div>
    </LoanOfficer>
  );
}
