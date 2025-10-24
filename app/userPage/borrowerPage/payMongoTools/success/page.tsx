import Link from "next/link";

export default function PaymentSuccess() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>
      <p className="mb-6 text-gray-700">
        Your installment has been paid. Thank you!
      </p>
      <Link href="/borrower/upcoming-bills">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Back to Bills
        </button>
      </Link>
    </div>
  );
}
