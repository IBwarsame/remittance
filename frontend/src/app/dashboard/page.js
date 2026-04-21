"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const STATUS_LABEL = {
    CREATED: "Awaiting Payment",
    AWAITING_FUNDS_CHECK: "Verifying Payment",
    PAID_IN: "Processing Transfer",
    COMPLETED: "Completed",
};

const STATUS_COLOR = {
    CREATED: "bg-amber-100 text-amber-800",
    AWAITING_FUNDS_CHECK: "bg-sky-100 text-sky-800",
    PAID_IN: "bg-violet-100 text-violet-800",
    COMPLETED: "bg-green-100 text-green-800",
};

export default function DashboardPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (!role) {
            router.push("/login");
            return;
        }
        if (role === "admin" || role === "developer") {
            router.push("/admin");
            return;
        }
        setUserName(localStorage.getItem("userName") || "");
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await apiFetch("/transactions/mine");
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]">
                <p className="text-stone-400">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar activePage="dashboard" />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900">
                        Welcome back
                        {userName ? `, ${userName.split(" ")[0]}` : ""}
                    </h1>
                    <p className="mt-1 text-stone-500">
                        Here are all your transfers
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <Link
                        href="/send"
                        className="rounded-xl bg-green-700 p-6 text-white shadow transition hover:bg-green-800"
                    >
                        <div className="text-xl font-bold">Send Money</div>
                        <div className="mt-1 text-sm text-green-100">
                            New transfer to East Africa
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/beneficiaries"
                        className="rounded-xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9] transition hover:shadow-md"
                    >
                        <div className="text-xl font-bold text-stone-900">
                            Beneficiaries
                        </div>
                        <div className="mt-1 text-sm text-stone-500">
                            Manage saved recipients
                        </div>
                    </Link>
                    <Link
                        href="/track"
                        className="rounded-xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9] transition hover:shadow-md"
                    >
                        <div className="text-xl font-bold text-stone-900">
                            Track Transfer
                        </div>
                        <div className="mt-1 text-sm text-stone-500">
                            Look up by reference
                        </div>
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Transaction List */}
                <div className="rounded-xl bg-[#eef2ee] shadow-sm ring-1 ring-[#c9d6c9]">
                    <div className="border-b border-[#c9d6c9] px-6 py-4">
                        <h2 className="text-lg font-bold text-stone-900">
                            Your Transfers ({transactions.length})
                        </h2>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-stone-400">
                                No transfers yet.{" "}
                                <Link
                                    href="/send"
                                    className="text-green-700 hover:underline"
                                >
                                    Send your first one
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#c9d6c9]">
                            {transactions.map((txn) => (
                                <Link
                                    key={txn.id}
                                    href={`/transactions/${txn.id}`}
                                    className="flex items-center justify-between px-6 py-4 transition hover:bg-[#dde7dd]"
                                >
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-stone-900">
                                                {txn.bankReference}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[txn.status]}`}
                                            >
                                                {STATUS_LABEL[txn.status] ||
                                                    txn.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-stone-400">
                                            {txn.receiverName} · {txn.country}{" "}
                                            ·{" "}
                                            {new Date(
                                                txn.createdAt,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-700">
                                            £{txn.amountInGbp.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-stone-500">
                                            {txn.amountOut.toFixed(2)}{" "}
                                            {txn.country === "Somalia"
                                                ? "SOS"
                                                : "ETB"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}