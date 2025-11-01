'use client';

import { useEffect, useState } from "react";
import { useLoanStats } from "@/app/commonComponents/statistics/hooks";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { formatCurrency } from "../utils/formatters";

const STAT_URL = process.env.NEXT_PUBLIC_STAT_URL

export default function LoanStatisticsTops() {
  const [role, setRole] = useState<"loanOfficer" | "manager">("loanOfficer");
  const [loanTypeStats, setLoanTypeStats] = useState<{ loanType: string; count: number }[]>([]);
  const [applicationStatusStats, setApplicationStatusStats] = useState<{ applied: number; approved: number; denied: number }>({ applied: 0, approved: 0, denied: 0 });

  const { loading, topBorrowers = [], topCollectors = [], topAgents = [], t } = useLoanStats(role);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role") as "loanOfficer" | "manager";
      setRole(storedRole || "loanOfficer");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCharts = async () => {
      try {
        const [loanTypeRes, appStatusRes] = await Promise.all([
          fetch(`${STAT_URL}/loan-type-stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${STAT_URL}/applicationStatus-stats`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const loanTypeData = await loanTypeRes.json();
        const appStatusData = await appStatusRes.json();

        setLoanTypeStats(loanTypeData || []);
        setApplicationStatusStats(appStatusData || { applied: 0, approved: 0, denied: 0 });
      } catch (err) {
        console.error("Failed to fetch chart stats:", err);
      }
    };

    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Top Borrowers */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="mb-4 flex items-center gap-2 text-m font-semibold text-red-600">
            {t.c12 || "Top 5 Borrowers"}
          </div>
          {topBorrowers.length === 0 ? (
            <p className="text-gray-500">{t.m1}</p>
          ) : (
            <ul className="list-decimal space-y-2">
              {topBorrowers.map((b: any) => (
                <li key={b.borrowersId} className="flex justify-between">
                  <span className="text-gray-700 text-sm">{b.name}</span>
                  <span className="font-semibold text-sm">₱{b.totalBorrowedAmount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Agents */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="mb-4 flex items-center gap-2 text-m font-semibold text-red-600">
            {t.c14 || "Top 5 Agents"}
          </div>
          {topAgents.length === 0 ? (
            <p className="text-gray-500">{t.m2}</p>
          ) : (
            <ul className="list-decimal space-y-2">
              {topAgents.map((a: any) => (
                <li key={a.agentId} className="flex justify-between">
                  <span className="text-gray-700 text-sm">{a.name}</span>
                  <span className="font-semibold text-sm">{formatCurrency(a.totalProcessedLoans)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom row: Top Collectors full width */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 w-full">
        <div className="mb-2 flex items-center gap-2 text-m font-semibold text-red-600">
        {t.c13 || "Top Collectors"}
        </div>
        {topCollectors.length === 0 ? (
          <p className="text-gray-500">{t.m3}</p>
        ) : (
          <div className="space-y-4">
            {topCollectors.map((c: any) => {
              const progressPercent = parseFloat(c.progressByCollector) || 0;
              return (
                <div key={c.collectorId}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{c.name}</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(c.collectedByCollector)} / {formatCurrency(c.totalAssigned)} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
