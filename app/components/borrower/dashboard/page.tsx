"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useInactivityLogout from "../../inactivity/logic";
import ChangePasswordModal from "../components/forceChange";
import AreYouStillThereModal from "../../inactivity/modal";
import BorrowerNavbar from "../borrowerNavbar/page";
import PaymentModal from '../PaymentModal';
import paymentService from '../paymentService';

export default function BorrowerDashboard() {
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    const {showModal, countdown, stayLoggedIn, logout} = useInactivityLogout();

    // PayMongo Integration States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [nextPaymentAmount, setNextPaymentAmount] = useState(25000);
    const [loanId, setLoanId] = useState('L00005');
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch payment details and history
    const fetchPaymentData = async () => {
        try {
            setLoading(true);
            const paymentDetails = await paymentService.getLoanPaymentDetails(loanId);
            setNextPaymentAmount(paymentDetails.nextPaymentAmount || 25000);
            setPaymentHistory(paymentDetails.payments || []);
        } catch (error) {
            console.error('Error fetching payment data:', error);
            setPaymentHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentData();
    }, [loanId]);

    const handlePaymentSuccess = () => {
        fetchPaymentData();
    };

    const handlePayNowClick = async () => {
        try {
          const response = await fetch("http://localhost:3001/payments/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 10000, 
              currency: "PHP",
              description: "Loan Payment"
            }),
          });
      
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
          }
      
          const data = await response.json();
          console.log("Checkout Session Response:", data);
      
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl; 
          } else {
            console.error("Checkout URL missing:", data);
          }
        } catch (err) {
          console.error("Error initiating payment:", err);
        }
      };
      
      
      

    useEffect(() => {
        const token = localStorage.getItem('token');
        const mustChange = localStorage.getItem('forcePasswordChange');

        if (!token) {
            router.push('/');
            return;
        }

        if (mustChange === 'true') {
            setShowChangePasswordModal(true);
        }

        setIsCheckingAuth(false);
    }, [router]);

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-white"></div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <BorrowerNavbar />
            
            {showChangePasswordModal && (
                <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />
            )}

            {/* Dashboard Content */}
            <div className="p-6">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, <span className="text-red-600">Raynor Buhian!</span>
                    </h1>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Credit Score */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Credit Score</h3>
                            <p className="text-sm text-gray-600 mb-4">Based on your repayment history</p>
                            
                            <div className="w-32 h-32 mx-auto mb-4 relative">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="251.2" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">Poor</div>
                                        <div className="text-sm text-gray-600">Standing</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Loan Details</h3>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                                Loan History
                            </button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Release Date:</span>
                                <span>August 3, 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Principal Amount:</span>
                                <span>₱131,875</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Released Amount:</span>
                                <span>₱131,875</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loan Period:</span>
                                <span>5 Months</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate:</span>
                                <span>10%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Payable:</span>
                                <span>₱197,812.5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Payments:</span>
                                <span>₱0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Remaining Balance:</span>
                                <span className="text-red-600 font-semibold">₱197,812.5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loan Status:</span>
                                <span className="text-green-600 font-semibold">Active</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-right">
                            <span className="text-sm text-gray-600">Loan ID: </span>
                            <span className="font-bold text-red-600">L00005</span>
                        </div>
                    </div>

                    {/* Payment Progress */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Progress</h3>
                        
                        <div className="text-center mb-6">
                            <div className="w-32 h-32 mx-auto mb-4 relative">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="#6b7280" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="251.2" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">0%</div>
                                        <div className="text-sm text-gray-600">Paid</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* PayMongo Pay Now Button */}
                            <button
                                onClick={handlePayNowClick}
                                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Pay Now'}
                            </button>
                            
                            <div>
                                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                    Re-Loan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Reference #</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Period Amount</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Paid Amount</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Mode</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">E-Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory && paymentHistory.length > 0 ? (
                                        paymentHistory.map((payment: any, index: number) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">{payment.referenceNumber || `REF-${index + 1}`}</td>
                                                <td className="py-3 px-4">
                                                    {payment.datePaid 
                                                      ? new Date(payment.datePaid).toLocaleDateString('en-PH')
                                                      : payment.createdDate ? new Date(payment.createdDate).toLocaleDateString('en-PH') : 'N/A'
                                                    }
                                                </td>
                                                <td className="py-3 px-4">₱{payment.amount?.toLocaleString('en-PH') || '0.00'}</td>
                                                <td className="py-3 px-4">₱{payment.amount?.toLocaleString('en-PH') || '0.00'}</td>
                                                <td className="py-3 px-4 capitalize">{payment.paymentMethod || 'Bank Transfer'}</td>
                                                <td className="py-3 px-4">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                      Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                                                No payment history available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* PayMongo Payment Modal */}
            {isPaymentModalOpen && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    loanId={loanId}
                    paymentAmount={nextPaymentAmount}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {showModal && (
                <AreYouStillThereModal
                    countdown={countdown}
                    onStay={stayLoggedIn}
                    onLogout={logout}
                />
            )}
        </div>
    );
}