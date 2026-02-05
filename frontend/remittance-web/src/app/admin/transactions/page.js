"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function AdminTransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "admin") {
            router.push("/login");
            return;
        }
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3001/transactions");
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                ));
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
        setLoading(false);
    };

    const confirmFunds = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3001/admin/transactions/${id}/confirm-funds`,
                { method: "PATCH" }
            );
            if (response.ok) {
                fetchTransactions();
                alert("Funds confirmed!");
            }
        } catch (error) {
            alert("Error confirming funds");
        }
    };

    const completeTransaction = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3001/admin/transactions/${id}/complete`,
                { method: "PATCH" }
            );
            if (response.ok) {
                fetchTransactions();
                alert("Transaction completed!");
            }
        } catch (error) {
            alert("Error completing transaction");
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

    const filteredTransactions = transactions.filter((t) => {
        if (filter === "ALL") return true;
        return t.status === filter;
    });

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Remit Admin
                        </Link>
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/admin"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Analytics
                            </Link>
                            <Link
                                href="/admin/transactions"
                                className="font-semibold text-blue-600"
                            >
                                Transactions
                            </Link>
                            <button onClick={handleLogout} className="AdminLogoutBtn" type="button">
                                <div className="sign">
                                    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                                    </svg>
                                </div>
                                <div className="text">Logout</div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Manage Transactions
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Review and process pending transfers
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter("ALL")}
                        className={`rounded-lg px-4 py-2 font-semibold ${filter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        All ({transactions.length})
                    </button>
                    <button
                        onClick={() => setFilter("CREATED")}
                        className={`rounded-lg px-4 py-2 font-semibold ${filter === "CREATED"
                                ? "bg-yellow-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Awaiting Payment (
                        {transactions.filter((t) => t.status === "CREATED").length})
                    </button>
                    <button
                        onClick={() => setFilter("AWAITING_FUNDS_CHECK")}
                        className={`rounded-lg px-4 py-2 font-semibold ${filter === "AWAITING_FUNDS_CHECK"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Verifying (
                        {
                            transactions.filter((t) => t.status === "AWAITING_FUNDS_CHECK")
                                .length
                        }
                        )
                    </button>
                    <button
                        onClick={() => setFilter("PAID_IN")}
                        className={`rounded-lg px-4 py-2 font-semibold ${filter === "PAID_IN"
                                ? "bg-purple-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Processing (
                        {transactions.filter((t) => t.status === "PAID_IN").length})
                    </button>
                    <button
                        onClick={() => setFilter("COMPLETED")}
                        className={`rounded-lg px-4 py-2 font-semibold ${filter === "COMPLETED"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Completed (
                        {transactions.filter((t) => t.status === "COMPLETED").length})
                    </button>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="rounded-xl bg-white p-12 text-center shadow-lg">
                            <p className="text-gray-600">No transactions found</p>
                        </div>
                    ) : (
                        filteredTransactions.map((txn) => (
                            <div
                                key={txn.id}
                                className="rounded-xl bg-white p-6 shadow-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {txn.bankReference}
                                            </h3>
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                                                    txn.status
                                                )}`}
                                            >
                                                {txn.status.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                        <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                                            <div>
                                                <span className="text-gray-600">Recipient:</span>
                                                <span className="ml-2 font-semibold text-gray-500">
                                                    {txn.receiverName}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Country:</span>
                                                <span className="ml-2 font-semibold text-gray-500">
                                                    {txn.country}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Amount:</span>
                                                <span className="ml-2 font-semibold text-blue-600">
                                                    £{txn.amountInGbp.toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Phone:</span>
                                                <span className="ml-2 font-semibold text-gray-500">
                                                    {txn.receiverPhone}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Fee:</span>
                                                <span className="ml-2 font-semibold text-gray-500">
                                                    £{txn.feeGbp.toFixed(2)} ({txn.feePercentage}%)
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Payout:</span>
                                                <span className="ml-2 font-semibold text-green-600">
                                                    {txn.amountOut.toFixed(2)}{" "}
                                                    {txn.country === "Somalia" ? "SOS" : "ETB"}
                                                </span>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className="text-gray-600">Created:</span>
                                                <span className="ml-2 font-semibold text-gray-500">
                                                    {new Date(txn.createdAt).toLocaleString()}
                                                </span>
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