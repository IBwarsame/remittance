"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminCharts({ byCountry, byStatus, demoMode }) {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        apiFetch(`/admin/analytics/chart-data?demoMode=${demoMode}`)
            .then((data) => {
                const formatted = data.map((row) => ({
                    date: row.date.slice(5),
                    volume: row.volume,
                    count: row.count,
                }));
                setChartData(formatted);
            })
            .catch((err) => console.error("Chart data fetch failed:", err));
    }, [demoMode]);

    const pieData = [
        { name: "Somalia", value: byCountry?.Somalia?.count || 0 },
        { name: "Ethiopia", value: byCountry?.Ethiopia?.count || 0 },
    ];

    const statusData = [
        { name: "Awaiting", value: byStatus?.CREATED || 0 },
        { name: "Verifying", value: byStatus?.AWAITING_FUNDS_CHECK || 0 },
        { name: "Processing", value: byStatus?.PAID_IN || 0 },
        { name: "Completed", value: byStatus?.COMPLETED || 0 },
    ];

    const PIE_COLORS = ["#2563eb", "#16a34a"];
    const STATUS_COLORS = ["#ca8a04", "#2563eb", "#9333ea", "#16a34a"];

    return (
        <div className="mt-8 space-y-8">
            {/* Volume Over Time */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900">
                    Completed Volume – Last 30 Days (£)
                </h3>
                {chartData.length === 0 ? (
                    <p className="mt-4 text-gray-500">
                        No completed transactions yet. Generate demo data to see charts.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={300} className="mt-4">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v) => `£${v.toFixed(2)}`} />
                            <Bar dataKey="volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Pie Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900">
                        Transactions by Country
                    </h3>
                    <ResponsiveContainer width="100%" height={250} className="mt-4">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900">
                        Transactions by Status
                    </h3>
                    <ResponsiveContainer width="100%" height={250} className="mt-4">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {statusData.map((_, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[i]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}