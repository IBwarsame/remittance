// src/app/transactions/[id]/receipt/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ReceiptPage() {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReceipt = async () => {
            try {
                const data = await apiFetch(`/transactions/${id}/receipt`);
                setReceipt(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        loadReceipt();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading receipt...</p>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">{error || "Receipt not found"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Remit
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-md px-4 py-12">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="text-center">
                        <div className="text-5xl">✅</div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Transfer Complete
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {receipt.reference}
                        </p>
                    </div>

                    <div className="mt-8 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Recipient</span>
                            <span className="font-semibold text-gray-900">
                                {receipt.recipient.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-semibold text-gray-900">
                                {receipt.recipient.phone}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Country</span>
                            <span className="font-semibold text-gray-900">
                                {receipt.recipient.country}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amount Sent</span>
                            <span className="font-semibold text-gray-900">
                                £{receipt.amount.sent.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fee</span>
                            <span className="font-semibold text-gray-900">
                                £{receipt.amount.fee.toFixed(2)} (
                                {receipt.amount.feePercentage}%)
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Exchange Rate</span>
                            <span className="font-semibold text-gray-900">
                                1 GBP = {receipt.amount.rate}{" "}
                                {receipt.amount.currency}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-bold text-gray-900">
                                Recipient Received
                            </span>
                            <span className="font-bold text-blue-600">
                                {receipt.amount.received.toFixed(2)}{" "}
                                {receipt.amount.currency}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Completed At</span>
                            <span className="font-semibold text-gray-900">
                                {new Date(
                                    receipt.paidOutAt
                                ).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Print Receipt
                        </button>
                        <Link
                            href="/send"
                            className="w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
                        >
                            Send Again
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}