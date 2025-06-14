'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '../navbar';
import Image from 'next/image';
import { useState } from 'react';

export default function PayMongoMockPage() {
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount');
    const month = searchParams.get('month');
    const dueDate = searchParams.get('dueDate');

    const [message, setMessage] = useState('');

    const formattedAmount = Number(amount).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    });

    const handleConfirm = () => {
        setMessage('✅ Your payment has been forwarded. Please wait for confirmation.');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto px-6 mt-5 py-10 bg-white shadow-xl rounded-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Payment for {month}
                </h1>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Due Date: <span className="font-medium">{dueDate}</span>
                </p>

                <div className="bg-gray-100 p-6 rounded-md text-center mb-6">
                    <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                    <p className="text-3xl font-bold text-green-600">{formattedAmount}</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2">Scan QR to pay</p>
                    <div className="w-52 h-52 bg-white p-2 border rounded-md shadow-md mb-4">
                        <Image
                            src="/qr.png"
                            alt="QR Code"
                            width={200}
                            height={200}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mb-6 px-4 text-center">
                        Use your preferred e-wallet app (e.g., GCash, Maya) to scan the QR code and complete the payment.
                    </p>

                    <button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        I've Paid — Confirm Payment
                    </button>

                    {message && (
                        <div className="mt-6 text-sm text-green-700 bg-green-100 border border-green-200 px-4 py-3 rounded-md">
                            {message}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
