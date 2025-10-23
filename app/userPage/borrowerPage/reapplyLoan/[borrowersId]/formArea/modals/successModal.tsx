"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SuccessModalWithAnimationProps {
    language: string;
    loanId: string | null;
    onClose: () => void;
}

export default function SuccessModalWithAnimation({
    language,
    loanId,
    onClose,
}: SuccessModalWithAnimationProps) {
    const [animateIn, setAnimateIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAnimateIn(true);
        return () => setAnimateIn(false);
    }, []);

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(() => {
            onClose();
            router.push("/");
        }, 150);
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-150 ${
                animateIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-md rounded-lg bg-white p-6 text-black shadow-lg transition-all duration-150 ${
                    animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === "en" ? "Application Submitted" : "Napasa ang Aplikasyon"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {language === "en"
                        ? "Your loan application has been received and is now being processed."
                        : "Nadawat na ang imong aplikasyon ug gi-proseso na karon."}
                </p>
                {loanId && (
                    <div className="mb-4 rounded-md border border-gray-100 bg-gray-50 p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            {language === "en" ? "Application ID" : "Application ID"}
                        </p>
                        <p className="text-lg font-semibold text-red-600">{loanId}</p>
                    </div>
                )}
                <p className="text-xs text-gray-500 mb-6">
                    {language === "en"
                        ? "We will contact you using your provided details for the next steps. Please keep your lines open."
                        : "Amo kang kontakon pinaagi sa imong contact details para sa sunod nga lakang. Palihug hulat sa among mensahe."}
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        {language === "en" ? "Close" : "Sirado"}
                    </button>
                </div>
            </div>
        </div>
    );
}
