"use client";

import { useState } from "react";

export default function PayPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: params.id }), // dynamic from URL
    });

    const data = await res.json();

    if (data.data?.attributes?.checkout_url) {
      window.location.href = data.data.attributes.checkout_url;
    } else {
      alert("Failed to create checkout session");
    }

    setLoading(false);
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
    </div>
  );
}
