"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./admin.css";

export default function AdminDashboard() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        // Check if user is admin
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "admin") {
            router.push("/login");
            return;
        }
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3001/admin/analytics");
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
        setLoading(false);
    };

    const generateDemoData = async () => {
        if (
            !confirm(
                "This will generate 50 random demo transactions. Continue?"
            )
        ) {
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch(
                "http://localhost:3001/admin/demo/generate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ count: 50 }),
                }
            );

            if (response.ok) {
                alert("Demo data generated successfully!");
                fetchAnalytics();
            }
        } catch (error) {
            alert("Error generating demo data");
        }
        setGenerating(false);
    };

    const downloadCSV = () => {
        window.open("http://localhost:3001/admin/reports/transactions.csv");
    };

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading analytics...</div>
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
                                className="font-semibold text-blue-600"
                            >
                                Analytics
                            </Link>
                            <Link
                                href="/admin/transactions"
                                className="text-gray-700 hover:text-blue-600"
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Analytics Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Overview of all transactions and revenue
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={generateDemoData}
                            disabled={generating}
                            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:bg-gray-400"
                        >
                            {generating ? "Generating..." : "Generate Demo Data"}
                        </button>
                        <button
                            onClick={downloadCSV}
                            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                        >
                             Download CSV
                        </button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="mb-8 grid gap-6 md:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Transactions</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {analytics?.overview.totalTransactions || 0}
                                </p>
                            </div>
                            <div className="text-4xl"></div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Volume</p>
                                <p className="mt-2 text-3xl font-bold text-blue-600">
                                    £{analytics?.overview.totalVolume.toFixed(2) || "0.00"}
                                </p>
                            </div>
                            <div className="text-4xl"></div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Fees Earned</p>
                                <p className="mt-2 text-3xl font-bold text-green-600">
                                    £{analytics?.overview.totalFees.toFixed(2) || "0.00"}
                                </p>
                            </div>
                            <div className="text-4xl"></div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Transaction</p>
                                <p className="mt-2 text-3xl font-bold text-purple-600">
                                    £
                                    {analytics?.overview.averageTransaction.toFixed(2) ||
                                        "0.00"}
                                </p>
                            </div>
                            <div className="text-4xl"></div>
                        </div>
                    </div>
                </div>

                {/* Time-based Stats */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900">Today</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transactions</span>
                                <span className="font-semibold text-gray-500">
                                    {analytics?.today.transactions || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Volume</span>
                                <span className="font-semibold text-blue-600 ">
                                    £{analytics?.today.volume.toFixed(2) || "0.00"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900">This Month</h3>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transactions</span>
                                <span className="font-semibold text-gray-500">
                                    {analytics?.thisMonth.transactions || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Volume</span>
                                <span className="font-semibold text-blue-600">
                                    £{analytics?.thisMonth.volume.toFixed(2) || "0.00"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* By Country */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900">By Country</h3>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    🇸🇴 Somalia
                                </h4>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transactions</span>
                                    <span className="font-semibold text-gray-500">
                                        {analytics?.byCountry.Somalia.count || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Volume</span>
                                    <span className="font-semibold text-blue-600">
                                        £
                                        {analytics?.byCountry.Somalia.volume.toFixed(2) ||
                                            "0.00"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border-2 border-green-600 bg-green-50 p-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    🇪🇹 Ethiopia
                                </h4>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transactions</span>
                                    <span className="font-semibold text-gray-500">
                                        {analytics?.byCountry.Ethiopia.count || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Volume</span>
                                    <span className="font-semibold text-green-600">
                                        £
                                        {analytics?.byCountry.Ethiopia.volume.toFixed(2) ||
                                            "0.00"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* By Status */}
                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900">
                        Transactions by Status
                    </h3>
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-yellow-50 p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-600">
                                {analytics?.byStatus.CREATED || 0}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Awaiting Payment
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {analytics?.byStatus.AWAITING_FUNDS_CHECK || 0}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Verifying Payment
                            </div>
                        </div>

                        <div className="rounded-lg bg-purple-50 p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {analytics?.byStatus.PAID_IN || 0}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Processing Transfer
                            </div>
                        </div>

                        <div className="rounded-lg bg-green-50 p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {analytics?.byStatus.COMPLETED || 0}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">Completed</div>
                        </div>
                    </div>
                </div>

                {/* Demo Data Info */}
                <div className="mt-8 rounded-xl border-2 border-purple-600 bg-purple-50 p-6">
                    <h3 className="font-semibold text-gray-900">
                        Demo Data Generator
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">
                        Click "Generate Demo Data" to create 50 random transactions for
                        testing and demonstration purposes. This will help you see how the
                        analytics dashboard looks with real data.
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-gray-600">
                        <li>• Random amounts between £50-£550</li>
                        <li>• Mixed countries (Somalia & Ethiopia)</li>
                        <li>• Various statuses (Created, Pending, Completed)</li>
                        <li>• Dates spread across last 30 days</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}