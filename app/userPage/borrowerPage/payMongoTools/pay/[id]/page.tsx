"use client";

import { useState } from "react";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";

export default function PayPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: params.id }), // dynamic from URL
      });

      // Try to parse JSON but tolerate non-JSON error responses
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const checkoutUrl = data?.data?.attributes?.checkout_url;
      if (res.ok && checkoutUrl) {
        window.location.href = checkoutUrl as string;
      } else {
        setErrorMsg("Failed to create checkout session");
        setShowErrorModal(true);
      }
    } catch (e) {
      setErrorMsg("Network error. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Pay ₱{params.id}</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Redirecting..." : "Checkout with PayMongo"}
      </button>

      {showErrorModal && (
        <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
}
