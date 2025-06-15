"use client";

import { useRouter } from 'next/navigation';
import Navbar from '../navbar';

export default function UpcomingBillPage() {
    const formatCurrency = (amount: number) =>
        Number(amount).toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        });

    const router = useRouter();

    const handleCardClick = (month: string, amount: number, dueDate: string) => {
        const query = new URLSearchParams({
            month,
            amount: amount.toString(),
            dueDate,
        }).toString();
        
        router.push(`/borrower/Paymongo?${query}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-xl font-bold text-gray-700 mb-4 text-center">Upcoming Payments</h1>
                <div className="flex flex-col space-y-4">
                    {/* Bill 1 */}
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCardClick('April', 10000, '04/22/2025')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg text-gray-600 font-semibold">April</span>
                            <span className="text-xl mt-6 font-bold text-green-600">
                                {formatCurrency(10000)}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Due: 04/22/2025</span>
                        </div>
                    </div>
                    {/* Bill 2 */}
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCardClick('May', 10000, '05/22/2025')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg text-gray-600 font-semibold">May</span>
                            <span className="text-xl mt-6 font-bold text-green-600">
                                {formatCurrency(10000)}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Due: 05/22/2025</span>
                        </div>
                    </div>

                    {/* Bill 3 */}
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCardClick('May', 10000, '05/22/2025')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg text-gray-600 font-semibold">May</span>
                            <span className="text-xl mt-6 font-bold text-green-600">
                                {formatCurrency(10000)}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Due: 05/22/2025</span>
                        </div>
                    </div>

                    {/* Bill 4 */}
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCardClick('May', 10000, '05/22/2025')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg text-gray-600 font-semibold">May</span>
                            <span className="text-xl mt-6 font-bold text-green-600">
                                {formatCurrency(10000)}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Due: 05/22/2025</span>
                        </div>
                    </div>

                    {/* Bill 5 */}
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg hover:cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCardClick('May', 10000, '05/22/2025')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg text-gray-600 font-semibold">May</span>
                            <span className="text-xl mt-6 font-bold text-green-600">
                                {formatCurrency(10000)}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-500">Due: 05/22/2025</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
