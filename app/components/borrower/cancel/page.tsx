import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Cancelled ❌</h1>
      <p className="mb-6 text-gray-700">
        Your payment was not completed. You can try again from your bills page.
      </p>
      <Link href="/borrower/upcoming-bills">
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Back to Bills
        </button>
      </Link>
    </div>
  );
}
