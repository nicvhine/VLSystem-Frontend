'use client';

import LoanStatistics from "@/app/commonComponents/statistics/loanStatistics";
import LoanOfficer from "../page";
import { useState } from "react";
import InterviewCalendar from "./interviewCalendar";

export default function LoanOfficerDashboard() {
  const [isNavbarBlurred, setIsNavbarBlurred] = useState(false);

  return (
    <LoanOfficer isNavbarBlurred={isNavbarBlurred}>
      <div className="min-h-screen bg-white relative z-10">
        <div className="bg-white px-6">
        </div>

        <div className="p-4">
          <div className="flex gap-4 h-[calc(100vh-100px)]">
            <div className="flex flex-col gap-4 w-72 flex-shrink-0">
              <LoanStatistics />
            </div>
            <div className="flex-1 min-w-0">
              <InterviewCalendar onModalToggle={setIsNavbarBlurred} />
            </div>
          </div>
        </div>
      </div>
    </LoanOfficer>
  );
}
