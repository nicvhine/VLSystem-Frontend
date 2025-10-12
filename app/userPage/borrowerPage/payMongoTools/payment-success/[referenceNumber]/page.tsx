"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";

export default function PaymentSuccess({ params }: { params: { referenceNumber: string } }) {
  const router = useRouter();
  const { referenceNumber } = params;

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function markPaid() {
      try {
        const res = await fetch(`http://localhost:3001/payments/${referenceNumber}/paymongo/success`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setModalMessage("✅ Payment successful!");
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
          router.push("/userPage/borrowerPage/dashboard");
        }, 2000);
      } catch (err) {
        console.error(err);
        setModalMessage("Error marking payment as paid.");
        setErrorOpen(true);
        setTimeout(() => {
          setErrorOpen(false);
        }, 2000);
      }
    }
    markPaid();
  }, [referenceNumber, router]);

  return (
    <>
      <p className="text-center mt-8">Processing your payment...</p>
      <SuccessModal isOpen={successOpen} message={modalMessage} onClose={() => setSuccessOpen(false)} />
      <ErrorModal isOpen={errorOpen} message={modalMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}
