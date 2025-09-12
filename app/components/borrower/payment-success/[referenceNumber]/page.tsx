"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess({ params }: { params: { referenceNumber: string } }) {
  const router = useRouter();
  const { referenceNumber } = params;

  useEffect(() => {
    async function markPaid() {
      try {
        const res = await fetch(`http://localhost:3001/payments/${referenceNumber}/paymongo/success`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        alert("✅ Payment successful!");
        router.push("/borrower/upcoming-bills");
      } catch (err) {
        console.error(err);
        alert("Error marking payment as paid.");
      }
    }
  
    markPaid();
  }, [referenceNumber, router]);
  

  return <p className="text-center mt-8">Processing your payment...</p>;
}
