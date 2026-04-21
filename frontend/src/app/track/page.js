// frontend/src/app/track/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function TrackPage() {
    const router = useRouter();
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e) => {
        e.preventDefault();
        setError("");

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        if (!token) {
            router.push(
                `/login?redirect=${encodeURIComponent("/track")}`
            );
            return;
        }

        setLoading(true);
        try {
            const trimmed = reference.trim();
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (uuidRegex.test(trimmed)) {
                const txn = await apiFetch(`/transactions/${trimmed}`);
                router.push(`/transactions/${txn.id}`);
                return;
            }

            const transactions = await apiFetch("/transactions/mine");
            const found = transactions.find(
                (t) =>
                    t.bankReference.toLowerCase() ===
                    trimmed.toLowerCase()
            );

            if (found) {
                router.push(`/transactions/${found.id}`);
            } else {
                setError(
                    "Transaction not found. Please check your reference."
                );
            }
        } catch (err) {
            setError(
                err.message ||
                    "Transaction not found or you do not have access."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar activePage="track" />

            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900">
                        Track Your Transfer
                    </h1>
                    <p className="mt-2 text-stone-500">
                        Enter your transaction reference or ID to check
                        the status of your transfer.
                    </p>
                </div>

                <div className="rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                    <form onSubmit={handleTrack} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-stone-700">
                                Transaction Reference
                            </label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) =>
                                    setReference(e.target.value)
                                }
                                placeholder="e.g. TXN-ABC12345"
                                className="mt-2 block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <p className="mt-2 text-xs text-stone-400">
                                You can find this in your confirmation
                                email or on your transfer summary page.
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !reference.trim()}
                            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-[#c9d6c9]"
                        >
                            {loading ? "Searching..." : "Track Transfer"}
                        </button>
                    </form>
                </div>

                {/* Info cards */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            ),
                            title: "Real-time Status",
                            body: "See exactly where your money is at every stage.",
                        },
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            ),
                            title: "Payment Confirmation",
                            body: "Confirm when your payment has been received.",
                        },
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                />
                            ),
                            title: "Recipient Details",
                            body: "View full recipient and transfer information.",
                        },
                        {
                            icon: (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            ),
                            title: "Download Receipt",
                            body: "Get a copy of your completed transfer receipt.",
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl bg-[#eef2ee] p-4 shadow-sm ring-1 ring-[#c9d6c9]"
                        >
                            <svg
                                className="mb-2 h-5 w-5 text-green-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                {card.icon}
                            </svg>
                            <p className="text-sm font-semibold text-stone-800">
                                {card.title}
                            </p>
                            <p className="mt-0.5 text-xs text-stone-500">
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}