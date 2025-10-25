"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";

export default function PaymentSuccess({ params }: { params: { referenceNumber: string } }) {
  const router = useRouter();
  const { referenceNumber } = params;

  const [phase, setPhase] = useState<"processing" | "success" | "error">("processing");
  const [msg, setMsg] = useState("Finalizing your payment... Please wait.");
  const [redirectIn, setRedirectIn] = useState(2); 

  const finalize = useCallback(async () => {
    setPhase("processing");
    setMsg("Finalizing your payment... Please wait.");
    try {
      const res = await fetch(`http://localhost:3001/payments/${referenceNumber}/paymongo/success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      await res.json().catch(() => undefined);
      if (!res.ok) throw new Error("Failed to finalize payment");
      setPhase("success");
      setMsg("Payment successful. Redirecting you back to your dashboard...");
    } catch (e) {
      console.error(e);
      setPhase("error");
      setMsg("We couldn't finalize your payment. You can retry or go back to your dashboard.");
    }
  }, [referenceNumber]);

  useEffect(() => {
    finalize();
  }, [finalize]);

  useEffect(() => {
    if (phase !== "success") return;
    setRedirectIn(2);
    const interval = setInterval(() => {
      setRedirectIn((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push("/userPage/borrowerPage/dashboard");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-8 text-center">
        {phase === "processing" && (
          <div className="flex flex-col items-center">
            <LoadingSpinner size={7} />
            <h1 className="mt-4 text-xl font-semibold text-gray-800">Processing Payment</h1>
            <p className="mt-2 text-gray-600">{msg}</p>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-green-700">Payment Successful</h1>
            <p className="mt-2 text-gray-700">{msg}</p>
            <button
              onClick={() => router.push("/userPage/borrowerPage/dashboard")}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white px-5 py-2.5"
            >
              Go to Dashboard now ({redirectIn})
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-red-700">Payment Not Finalized</h1>
            <p className="mt-2 text-gray-700">{msg}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={finalize}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/userPage/borrowerPage/dashboard")}
                className="inline-flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
