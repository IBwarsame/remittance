// frontend/src/app/admin/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const STATUS_COLOURS = {
    CREATED: "bg-yellow-100 text-yellow-800",
    AWAITING_FUNDS_CHECK: "bg-blue-100 text-blue-800",
    PAID_IN: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
};

const STATUS_LABELS = {
    CREATED: "Created",
    AWAITING_FUNDS_CHECK: "Awaiting Funds",
    PAID_IN: "Funds Confirmed",
    COMPLETED: "Completed",
};

export default function AdminPage() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [demoLoading, setDemoLoading] = useState(false);
    const [demoCount, setDemoCount] = useState(50);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [countryFilter, setCountryFilter] = useState("all");
    const [demoMode, setDemoMode] = useState(false);

    // Bank details state
    const [bankDetails, setBankDetails] = useState(null);
    const [bankForm, setBankForm] = useState(null);
    const [bankSaving, setBankSaving] = useState(false);
    const [bankError, setBankError] = useState("");
    const [bankSuccess, setBankSuccess] = useState(false);

    // Confirm complete modal state
    const [confirmCompleteId, setConfirmCompleteId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");
        if (
            !token ||
            (storedRole !== "admin" && storedRole !== "developer")
        ) {
            router.push("/login");
            return;
        }
        setRole(storedRole);
    }, [router]);

    const fetchData = useCallback(async () => {
        if (!role) return;
        setLoading(true);
        try {
            const qs = demoMode ? "?demoMode=true" : "";
            const [analyticsData, chart, txns, bd] = await Promise.all([
                apiFetch(`/admin/analytics${qs}`),
                apiFetch(`/admin/analytics/chart-data${qs}`),
                apiFetch(`/transactions${qs}`),
                apiFetch("/bank-details"),
            ]);
            setAnalytics(analyticsData);
            setChartData(chart);
            setTransactions(txns);
            setBankDetails(bd);
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    }, [role, demoMode]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const confirmFunds = async (id) => {
        setActionLoading(id + "-confirm");
        try {
            await apiFetch(`/admin/transactions/${id}/confirm-funds`, {
                method: "PATCH",
            });
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
        setActionLoading(null);
    };

    const completeTransfer = async (id) => {
        setActionLoading(id + "-complete");
        try {
            await apiFetch(`/admin/transactions/${id}/complete`, {
                method: "PATCH",
            });
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
        setActionLoading(null);
        setConfirmCompleteId(null);
    };

    const saveBankDetails = async () => {
        setBankSaving(true);
        setBankError("");
        setBankSuccess(false);
        try {
            const updated = await apiFetch("/bank-details", {
                method: "PUT",
                body: JSON.stringify(bankForm),
            });
            setBankDetails(updated);
            setBankForm(null);
            setBankSuccess(true);
            setTimeout(() => setBankSuccess(false), 3000);
        } catch (err) {
            setBankError(err.message);
        }
        setBankSaving(false);
    };

    const generateDemo = async () => {
        setDemoLoading(true);
        try {
            await apiFetch("/admin/demo/generate", {
                method: "POST",
                body: JSON.stringify({ count: demoCount }),
            });
            setDemoMode(true);
            await fetchData();
        } catch (err) {
            alert(err.message);
        }
        setDemoLoading(false);
    };

    const downloadCsv = () => {
        const qs = demoMode ? "?demoMode=true" : "";
        window.open(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/reports/transactions.csv${qs}`,
            "_blank"
        );
    };

    const filtered = transactions.filter((t) => {
        const matchesSearch =
            search === "" ||
            t.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
            t.receiverPhone?.includes(search);
        const matchesStatus =
            statusFilter === "all" || t.status === statusFilter;
        const matchesCountry =
            countryFilter === "all" || t.country === countryFilter;
        return matchesSearch && matchesStatus && matchesCountry;
    });

    const maxVolume = chartData?.daily
        ? Math.max(
              ...chartData.daily.map((d) => d.volume ?? d.count ?? 0)
          )
        : 0;

    if (loading && !analytics) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Navbar activePage="dashboard" />
                <div className="flex h-96 items-center justify-center">
                    <div className="text-stone-500">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar activePage="dashboard" />

            {/* Confirm complete modal */}
            {confirmCompleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-stone-900">
                            Confirm Transfer Complete
                        </h3>
                        <p className="mt-2 text-sm text-stone-600">
                            Are you sure the funds have reached the
                            recipient? This will mark the transfer as{" "}
                            <span className="font-semibold text-green-700">
                                Completed
                            </span>{" "}
                            and cannot be undone.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setConfirmCompleteId(null)}
                                className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    completeTransfer(confirmCompleteId)
                                }
                                disabled={
                                    actionLoading ===
                                    confirmCompleteId + "-complete"
                                }
                                className="flex-1 rounded-lg bg-green-700 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:bg-stone-400"
                            >
                                {actionLoading ===
                                confirmCompleteId + "-complete"
                                    ? "Completing..."
                                    : "Yes, Mark Complete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-stone-500 capitalize">
                            Signed in as{" "}
                            <span className="font-semibold text-green-700">
                                {role}
                            </span>
                            {demoMode && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    Demo Mode
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {role === "developer" && (
                            <button
                                onClick={() => setDemoMode((d) => !d)}
                                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                            >
                                {demoMode
                                    ? "Switch to Live"
                                    : "Switch to Demo"}
                            </button>
                        )}
                        <button
                            onClick={downloadCsv}
                            className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={fetchData}
                            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                {analytics && (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                label: "Total Transactions",
                                value:
                                    analytics.overview
                                        .totalTransactions ?? 0,
                                sub: "all time (completed)",
                            },
                            {
                                label: "Total Volume",
                                value: `£${(analytics.overview.totalVolume ?? 0).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                                sub: "GBP sent (completed)",
                            },
                            {
                                label: "Completed",
                                value:
                                    analytics.byStatus.COMPLETED ?? 0,
                                sub: `${
                                    analytics.overview.totalTransactions
                                        ? Math.round(
                                              (analytics.byStatus
                                                  .COMPLETED /
                                                  (analytics.byStatus
                                                      .CREATED +
                                                      analytics.byStatus
                                                          .AWAITING_FUNDS_CHECK +
                                                      analytics.byStatus
                                                          .PAID_IN +
                                                      analytics.byStatus
                                                          .COMPLETED)) *
                                                  100
                                          )
                                        : 0
                                }% rate`,
                                colour: "text-green-700",
                            },
                            {
                                label: "Pending",
                                value:
                                    (analytics.byStatus.CREATED ?? 0) +
                                    (analytics.byStatus
                                        .AWAITING_FUNDS_CHECK ?? 0) +
                                    (analytics.byStatus.PAID_IN ?? 0),
                                sub: "awaiting action",
                                colour: "text-yellow-600",
                            },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <p className="text-sm text-stone-500">
                                    {card.label}
                                </p>
                                <p
                                    className={`mt-1 text-2xl font-bold ${card.colour ?? "text-stone-900"}`}
                                >
                                    {card.value}
                                </p>
                                <p className="mt-1 text-xs text-stone-400">
                                    {card.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Chart */}
                {chartData?.daily && chartData.daily.length > 0 && (
                    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-stone-900">
                            Daily Transaction Volume (GBP)
                        </h2>
                        <div className="flex h-40 items-end gap-1">
                            {chartData.daily.map((d) => {
                                const val = d.volume ?? d.count ?? 0;
                                const heightPct =
                                    maxVolume > 0
                                        ? (val / maxVolume) * 100
                                        : 0;
                                return (
                                    <div
                                        key={d.date}
                                        className="group relative flex flex-1 flex-col items-center justify-end"
                                    >
                                        <div
                                            className="w-full rounded-t bg-green-600 transition-all group-hover:bg-green-700"
                                            style={{
                                                height: `${heightPct}%`,
                                                minHeight: val > 0 ? 2 : 0,
                                            }}
                                        />
                                        <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded bg-stone-800 px-2 py-1 text-xs text-white group-hover:block">
                                            {d.date}
                                            <br />£{val}
                                        </div>
                                        <span className="mt-1 hidden text-[10px] text-stone-400 sm:block">
                                            {d.date?.slice(5)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Developer: Demo Data Generator */}
                {role === "developer" && (
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-amber-800">
                            Demo Data Generator
                        </h2>
                        <p className="mt-1 text-sm text-amber-700">
                            Generate fake transactions for testing. This
                            populates the demo database only.
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                            <input
                                type="number"
                                value={demoCount}
                                onChange={(e) =>
                                    setDemoCount(Number(e.target.value))
                                }
                                min={1}
                                max={500}
                                className="w-28 rounded-lg border border-amber-300 px-3 py-2 text-sm"
                            />
                            <span className="text-sm text-amber-700">
                                transactions
                            </span>
                            <button
                                onClick={generateDemo}
                                disabled={demoLoading}
                                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:bg-stone-400"
                            >
                                {demoLoading
                                    ? "Generating..."
                                    : "Generate"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Bank Details — admin only */}
                {role === "admin" && (
                    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-stone-900">
                                    Bank Details
                                </h2>
                                <p className="mt-0.5 text-sm text-stone-500">
                                    Shown to users after they create a
                                    transfer so they know where to send
                                    payment.
                                </p>
                            </div>
                            {bankForm === null && (
                                <button
                                    onClick={() =>
                                        setBankForm(
                                            bankDetails?.bankName
                                                ? { ...bankDetails }
                                                : {
                                                      bankName: "",
                                                      accountName: "",
                                                      accountNumber: "",
                                                      sortCode: "",
                                                      reference: "{ref}",
                                                  }
                                        )
                                    }
                                    className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                >
                                    {bankDetails?.bankName
                                        ? "Edit"
                                        : "Add Details"}
                                </button>
                            )}
                        </div>

                        {bankForm === null ? (
                            bankDetails?.bankName ? (
                                <div className="mt-4 divide-y divide-stone-100 rounded-xl border border-stone-100">
                                    {[
                                        [
                                            "Bank",
                                            bankDetails.bankName,
                                        ],
                                        [
                                            "Account Name",
                                            bankDetails.accountName,
                                        ],
                                        [
                                            "Account Number",
                                            bankDetails.accountNumber,
                                        ],
                                        [
                                            "Sort Code",
                                            bankDetails.sortCode,
                                        ],
                                        [
                                            "Reference Template",
                                            bankDetails.reference,
                                        ],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex justify-between px-4 py-3 text-sm"
                                        >
                                            <span className="text-stone-500">
                                                {label}
                                            </span>
                                            <span className="font-mono font-medium text-stone-900">
                                                {value || "—"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700 ring-1 ring-amber-200">
                                    ⚠️ No bank details set yet. Users
                                    won't see payment instructions until
                                    you add them.
                                </div>
                            )
                        ) : (
                            <div className="mt-4 space-y-4">
                                {[
                                    {
                                        key: "bankName",
                                        label: "Bank Name",
                                        placeholder: "e.g. Barclays",
                                    },
                                    {
                                        key: "accountName",
                                        label: "Account Name",
                                        placeholder: "e.g. Remit Ltd",
                                    },
                                    {
                                        key: "accountNumber",
                                        label: "Account Number",
                                        placeholder:
                                            "e.g. 12345678 or XXXXXXXX",
                                    },
                                    {
                                        key: "sortCode",
                                        label: "Sort Code",
                                        placeholder:
                                            "e.g. 20-00-00 or XX-XX-XX",
                                    },
                                    {
                                        key: "reference",
                                        label: "Reference Template",
                                        placeholder:
                                            "Use {ref} for transaction reference",
                                    },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-stone-700">
                                            {label}
                                        </label>
                                        <input
                                            type="text"
                                            value={bankForm[key] || ""}
                                            onChange={(e) =>
                                                setBankForm((f) => ({
                                                    ...f,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                            placeholder={placeholder}
                                            className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                ))}
                                <p className="text-xs text-stone-400">
                                    Use{" "}
                                    <code className="rounded bg-stone-100 px-1 font-mono">
                                        {"{ref}"}
                                    </code>{" "}
                                    in the Reference field to
                                    auto-insert the user&apos;s
                                    transaction reference.
                                </p>
                                {bankError && (
                                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                        {bankError}
                                    </p>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setBankForm(null);
                                            setBankError("");
                                        }}
                                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveBankDetails}
                                        disabled={bankSaving}
                                        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:bg-stone-400"
                                    >
                                        {bankSaving
                                            ? "Saving..."
                                            : "Save"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {bankSuccess && (
                            <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                ✓ Bank details updated successfully.
                            </p>
                        )}
                    </div>
                )}

                {/* Transactions Table */}
                <div className="rounded-2xl bg-white shadow-sm">
                    <div className="border-b border-stone-100 p-6">
                        <h2 className="text-lg font-semibold text-stone-900">
                            Transactions
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <input
                                type="text"
                                placeholder="Search name or phone…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="all">All Statuses</option>
                                <option value="CREATED">Created</option>
                                <option value="AWAITING_FUNDS_CHECK">
                                    Awaiting Funds
                                </option>
                                <option value="PAID_IN">
                                    Funds Confirmed
                                </option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                            <select
                                value={countryFilter}
                                onChange={(e) =>
                                    setCountryFilter(e.target.value)
                                }
                                className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="all">All Countries</option>
                                <option value="Somalia">Somalia</option>
                                <option value="Ethiopia">Ethiopia</option>
                            </select>
                            <span className="self-center text-sm text-stone-400">
                                {filtered.length} result
                                {filtered.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                                <tr>
                                    <th className="px-6 py-3">
                                        Recipient
                                    </th>
                                    <th className="px-6 py-3">Country</th>
                                    <th className="px-6 py-3">
                                        Amount (GBP)
                                    </th>
                                    <th className="px-6 py-3">
                                        They Receive
                                    </th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-stone-400"
                                        >
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-stone-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-stone-900">
                                                    {t.receiverName}
                                                </p>
                                                <p className="text-stone-400">
                                                    {t.receiverPhone}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-stone-600">
                                                {t.country}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-900">
                                                £
                                                {Number(
                                                    t.amountInGbp
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-stone-600">
                                                {Number(
                                                    t.amountOut
                                                ).toFixed(2)}{" "}
                                                {t.country === "Somalia"
                                                    ? "SOS"
                                                    : "ETB"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOURS[t.status] ?? "bg-stone-100 text-stone-600"}`}
                                                >
                                                    {STATUS_LABELS[
                                                        t.status
                                                    ] ?? t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-stone-400">
                                                {t.createdAt
                                                    ? new Date(
                                                          t.createdAt
                                                      ).toLocaleDateString(
                                                          "en-GB"
                                                      )
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    {/*
                                                     * AWAITING_FUNDS_CHECK
                                                     * → admin confirms funds
                                                     *   received in bank
                                                     */}
                                                    {t.status ===
                                                        "AWAITING_FUNDS_CHECK" && (
                                                        <button
                                                            onClick={() =>
                                                                confirmFunds(
                                                                    t.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                t.id +
                                                                    "-confirm"
                                                            }
                                                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                                                        >
                                                            {actionLoading ===
                                                            t.id + "-confirm"
                                                                ? "…"
                                                                : "✓ Confirm Funds Received"}
                                                        </button>
                                                    )}
                                                    {/*
                                                     * PAID_IN
                                                     * → admin confirms money
                                                     *   sent to recipient
                                                     */}
                                                    {t.status ===
                                                        "PAID_IN" && (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmCompleteId(
                                                                    t.id
                                                                )
                                                            }
                                                            className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                                                        >
                                                            ✓ Mark as Sent
                                                            to Recipient
                                                        </button>
                                                    )}
                                                    {t.status ===
                                                        "COMPLETED" && (
                                                        <span className="text-xs text-green-600">
                                                            ✓ Complete
                                                        </span>
                                                    )}
                                                    {t.status ===
                                                        "CREATED" && (
                                                        <span className="text-xs text-stone-400">
                                                            Awaiting proof
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}