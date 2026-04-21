"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import "../admin.css";

export default function AdminTransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [demoMode, setDemoMode] = useState(false);
    const [fetchError, setFetchError] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");
        if (!token || userRole !== "admin") {
            router.push("/login");
            return;
        }
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoMode]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await apiFetch(`/transactions?demoMode=${demoMode}`);
            setTransactions(
                data.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
            );
        } catch (error) {
            setFetchError(error.message);
        }
        setLoading(false);
    };

    const confirmFunds = async (id) => {
        try {
            await apiFetch(`/admin/transactions/${id}/confirm-funds`, {
                method: "PATCH",
            });
            fetchTransactions();
            alert("Funds confirmed!");
        } catch (err) {
            alert(err.message || "Error confirming funds");
        }
    };

    const completeTransaction = async (id) => {
        try {
            await apiFetch(`/admin/transactions/${id}/complete`, {
                method: "PATCH",
            });
            fetchTransactions();
            alert("Transaction completed!");
        } catch (err) {
            alert(err.message || "Error completing transaction");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CREATED":
                return "bg-yellow-100 text-yellow-800";
            case "AWAITING_FUNDS_CHECK":
                return "bg-blue-100 text-blue-800";
            case "PAID_IN":
                return "bg-purple-100 text-purple-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredTransactions = transactions.filter(
        (t) => filter === "ALL" || t.status === filter
    );

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const countByStatus = (status) =>
        transactions.filter((t) => t.status === status).length;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading transactions...</div>
            </div>
        );
    }

    const filterOptions = [
        { key: "ALL", label: "All", count: transactions.length },
        { key: "CREATED", label: "Awaiting Payment", count: countByStatus("CREATED") },
        { key: "AWAITING_FUNDS_CHECK", label: "Verifying", count: countByStatus("AWAITING_FUNDS_CHECK") },
        { key: "PAID_IN", label: "Processing", count: countByStatus("PAID_IN") },
        { key: "COMPLETED", label: "Completed", count: countByStatus("COMPLETED") },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Remit Admin
                        </Link>
                        <div className="flex items-center space-x-8">
                            <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                                Analytics
                            </Link>
                            <Link href="/admin/transactions" className="font-semibold text-blue-600">
                                Transactions
                            </Link>
                            <button onClick={handleLogout} className="AdminLogoutBtn" type="button">
                                <div className="sign">
                                    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                    </svg>
                                </div>
                                <div className="text">Logout</div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Transactions</h1>
                        <p className="mt-2 text-gray-600">Review and process pending transfers</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1">
                        <button
                            onClick={() => setDemoMode(false)}
                            className={`rounded-md px-4 py-2 text-sm font-semibold ${!demoMode ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Real Data
                        </button>
                        <button
                            onClick={() => setDemoMode(true)}
                            className={`rounded-md px-4 py-2 text-sm font-semibold ${demoMode ? "bg-white text-purple-600 shadow" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Demo Mode
                        </button>
                    </div>
                </div>
                {fetchError && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {fetchError}
                    </div>
                )}

                <div className="mb-6 flex flex-wrap gap-2">
                    {filterOptions.map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`rounded-lg px-4 py-2 font-semibold ${filter === key
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {label} ({count})
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="rounded-xl bg-white p-12 text-center shadow-lg">
                            <p className="text-gray-600">No transactions found</p>
                        </div>
                    ) : (
                        filteredTransactions.map((txn) => (
                            <div key={txn.id} className="rounded-xl bg-white p-6 shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-gray-900">{txn.bankReference}</h3>
                                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(txn.status)}`}>
                                                {txn.status.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                        <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                                            <div>
                                                <span className="text-gray-600">Recipient:</span>
                                                <span className="ml-2 font-semibold text-gray-500">{txn.receiverName}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Country:</span>
                                                <span className="ml-2 font-semibold text-gray-500">{txn.country}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Amount:</span>
                                                <span className="ml-2 font-semibold text-blue-600">£{txn.amountInGbp.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Phone:</span>
                                                <span className="ml-2 font-semibold text-gray-500">{txn.receiverPhone}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Fee:</span>
                                                <span className="ml-2 font-semibold text-gray-500">£{txn.feeGbp.toFixed(2)} ({txn.feePercentage}%)</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Payout:</span>
                                                <span className="ml-2 font-semibold text-green-600">{txn.amountOut.toFixed(2)} {txn.country === "Somalia" ? "SOS" : "ETB"}</span>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="text-gray-600">Created:</span>
                                                <span className="ml-2 font-semibold text-gray-500">{new Date(txn.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2">
                                        <Link
                                            href={`/transactions/${txn.id}`}
                                            className="rounded-lg border-2 border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                        >
                                            View Details
                                        </Link>
                                        {txn.status === "AWAITING_FUNDS_CHECK" && (
                                            <button
                                                onClick={() => confirmFunds(txn.id)}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                            >
                                                Confirm Funds
                                            </button>
                                        )}
                                        {txn.status === "PAID_IN" && (
                                            <button
                                                onClick={() => completeTransaction(txn.id)}
                                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}