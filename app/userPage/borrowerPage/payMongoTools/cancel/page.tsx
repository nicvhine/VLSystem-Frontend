"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-red-700">Payment Not Completed</h1>
        <p className="mt-2 text-gray-700">
          Your payment was cancelled or failed. You can return to your dashboard and try again.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => router.push("/userPage/borrowerPage/dashboard")}
            className="inline-flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5"
          >
            Back to Dashboard
          </button>
          <Link href="/userPage/borrowerPage/dashboard" className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
