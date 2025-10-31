  'use client';

  import React, { useState, useEffect } from "react";
  import ErrorModal from "../../modals/errorModal";
  import Filter from "../../utils/sortAndSearch";
  import Pagination from "../../utils/pagination";
  import Manager from "@/app/userPage/managerPage/page";
  import { formatDate } from "../../utils/formatters";

  export default function ClosureEndorsement() {
    const [endorsements, setEndorsements] = useState<any[]>([]);
    const [loanBalances, setLoanBalances] = useState<Record<string, number>>({});
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");

    const t = {
      l13: "Date",
      l14: "Client Name",
      noData: "No endorsements found.",
    };

    const fetchEndorsements = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch("http://localhost:3001/closure", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch closure endorsements");

        const data = await res.json();
        setEndorsements(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message || "Something went wrong while fetching endorsements.");
        setShowError(true);
      }
    };

    useEffect(() => {
      fetchEndorsements();
    }, []);

    useEffect(() => {
      const fetchBalances = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const balances: Record<string, number> = {};
          await Promise.all(
            endorsements.map(async (e) => {
              const res = await fetch(`http://localhost:3001/loans/${e.loanId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) return;
              const loan = await res.json();
              balances[e.loanId] = loan.balance ?? 0;
            })
          );
          setLoanBalances(balances);
        } catch (err) {
          console.error("Failed to fetch loan balances", err);
        }
      };

      if (endorsements.length > 0) fetchBalances();
    }, [endorsements]);

    const handleAction = async (endorsementId: string, action: "approve" | "reject") => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`http://localhost:3001/closure/${endorsementId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action === "approve" ? "Approved" : "Rejected" }),
        });

        if (!res.ok) throw new Error("Failed to update status");

        setEndorsements((prev) =>
          prev.map((e) =>
            e.endorsementId === endorsementId ? { ...e, status: action === "approve" ? "Approved" : "Rejected" } : e
          )
        );
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to update status.");
        setShowError(true);
      }
    };

    const filtered = endorsements.filter((e) =>
      (e.clientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (e.reason?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "client") return a.clientName.localeCompare(b.clientName);
      return 0;
    });

    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = (currentPage - 1) * pageSize;
    const paginated = sorted.slice(start, start + pageSize);

    return (
      <Manager>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Closure Endorsements</h1>

            <ErrorModal
              isOpen={showError}
              message={errorMsg}
              onClose={() => setShowError(false)}
            />

            <Filter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOptions={[
                { value: "date", label: t.l13 },
                { value: "client", label: t.l14 },
              ]}
              t={t}
            />

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm mt-4">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endorsed Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.length > 0 ? (
                    paginated.map((e) => (
                      <tr key={e._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{e.endorsementId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{e.loanId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{e.clientName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₱{loanBalances[e.loanId]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(e.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{e.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 flex gap-2">
                          <button
                            onClick={() => handleAction(e.endorsementId, "approve")}
                            disabled={e.status !== "Pending"}
                            className={`px-2 py-1 rounded text-white ${
                              e.status === "Pending"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(e.endorsementId, "reject")}
                            disabled={e.status !== "Pending"}
                            className={`px-2 py-1 rounded text-white ${
                              e.status === "Pending"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Reject
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-6 text-sm">{t.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              language="en"
            />
          </div>
        </div>
      </Manager>
    );
  }
