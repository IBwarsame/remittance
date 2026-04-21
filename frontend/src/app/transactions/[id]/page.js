// frontend/src/app/transactions/[id]/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const STATUS_STEPS = ["CREATED", "AWAITING_FUNDS_CHECK", "PAID_IN", "COMPLETED"];

const STATUS_META = {
    CREATED: {
        label: "Transfer Created",
        colour: "bg-yellow-100 text-yellow-800",
        description:
            "Your transfer has been created. Please send payment using the bank details below.",
    },
    AWAITING_FUNDS_CHECK: {
        label: "Proof Submitted",
        colour: "bg-blue-100 text-blue-800",
        description:
            "We've received your proof of payment and are verifying the funds.",
    },
    PAID_IN: {
        label: "Funds Confirmed",
        colour: "bg-purple-100 text-purple-800",
        description:
            "Your payment has been confirmed. We are now processing your transfer.",
    },
    COMPLETED: {
        label: "Completed",
        colour: "bg-green-100 text-green-800",
        description: "Your transfer has been completed successfully.",
    },
};

export default function TransactionDetailPage() {
    const { id } = useParams();
    const [txn, setTxn] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const fetchAll = async () => {
        try {
            const [txnData, bdData] = await Promise.all([
                apiFetch(`/transactions/${id}`),
                apiFetch("/bank-details"),
            ]);
            setTxn(txnData);
            setBankDetails(bdData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [id]);

    const handleProofUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");
        setUploadSuccess(false);
        setUploading(true);

        const formData = new FormData();
        formData.append("proof", file);

        try {
            const token = localStorage.getItem("token");
            const BASE =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(
                `${BASE}/transactions/${id}/proof`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Do NOT set Content-Type — let the browser set multipart boundary
                    },
                    body: formData,
                }
            );

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(
                    body.error || `Upload failed: ${res.status}`
                );
            }

            const updated = await res.json();
            setTxn(updated);
            setUploadSuccess(true);
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
            // Reset file input so same file can be re-selected if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7f4]">
                <Navbar />
                <div className="flex h-96 items-center justify-center">
                    <div className="text-stone-400">Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !txn) {
        return (
            <div className="min-h-screen bg-[#f4f7f4]">
                <Navbar />
                <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                    <p className="text-red-600">
                        {error || "Transaction not found"}
                    </p>
                </div>
            </div>
        );
    }

    const stepIndex = STATUS_STEPS.indexOf(txn.status);
    const meta = STATUS_META[txn.status] ?? {
        label: txn.status,
        colour: "bg-stone-100 text-stone-600",
        description: "",
    };
    const currency = txn.country === "Somalia" ? "SOS" : "ETB";
    const canUploadProof = txn.status === "CREATED";
    const hasBankDetails =
        bankDetails &&
        (bankDetails.bankName ||
            bankDetails.accountNumber ||
            bankDetails.sortCode);

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar />

            <div className="mx-auto max-w-2xl px-4 py-12">
                {/* Status badge + description */}
                <div className="mb-6 rounded-2xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-stone-500">
                                Reference
                            </p>
                            <p className="mt-0.5 font-mono text-lg font-bold text-stone-900">
                                {txn.bankReference}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${meta.colour}`}
                        >
                            {meta.label}
                        </span>
                    </div>
                    <p className="mt-3 text-sm text-stone-600">
                        {meta.description}
                    </p>
                </div>

                {/* Progress tracker */}
                <div className="mb-6 rounded-2xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9]">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
                        Transfer Progress
                    </h2>
                    <div className="flex items-center gap-0">
                        {STATUS_STEPS.map((s, i) => {
                            const done = i <= stepIndex;
                            const active = i === stepIndex;
                            return (
                                <div
                                    key={s}
                                    className="flex flex-1 items-center"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                                done
                                                    ? "bg-green-700 text-white"
                                                    : "bg-[#c9d6c9] text-stone-400"
                                            } ${active ? "ring-2 ring-green-400 ring-offset-2" : ""}`}
                                        >
                                            {done && !active ? (
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        <span className="mt-1 hidden text-center text-[10px] text-stone-500 sm:block">
                                            {STATUS_META[s]?.label ?? s}
                                        </span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div
                                            className={`mb-4 h-0.5 flex-1 transition-colors ${
                                                i < stepIndex
                                                    ? "bg-green-700"
                                                    : "bg-[#c9d6c9]"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bank details — shown when status is CREATED */}
                {canUploadProof && hasBankDetails && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                        <h2 className="mb-1 text-base font-semibold text-green-900">
                            Send Your Payment
                        </h2>
                        <p className="mb-4 text-sm text-green-700">
                            Transfer{" "}
                            <span className="font-bold">
                                £{Number(txn.amountInGbp).toFixed(2)}
                            </span>{" "}
                            to the account below, then upload your proof of
                            payment.
                        </p>
                        <div className="divide-y divide-green-200 rounded-xl bg-white">
                            {[
                                ["Bank", bankDetails.bankName],
                                ["Account Name", bankDetails.accountName],
                                ["Account Number", bankDetails.accountNumber],
                                ["Sort Code", bankDetails.sortCode],
                                [
                                    "Reference",
                                    bankDetails.reference
                                        ? bankDetails.reference.replace(
                                              /\{ref\}/gi,
                                              txn.bankReference
                                          )
                                        : txn.bankReference,
                                ],
                            ]
                                .filter(([, v]) => v)
                                .map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between px-4 py-3"
                                    >
                                        <span className="text-sm text-stone-500">
                                            {label}
                                        </span>
                                        <span className="font-mono text-sm font-semibold text-stone-900">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                        </div>
                        <p className="mt-3 text-xs text-green-700">
                            ⚠️ Use your reference number exactly as shown so
                            we can match your payment.
                        </p>
                    </div>
                )}

                {/* Proof upload */}
                {canUploadProof && (
                    <div className="mb-6 rounded-2xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9]">
                        <h2 className="mb-1 text-base font-semibold text-stone-900">
                            Upload Proof of Payment
                        </h2>
                        <p className="mb-4 text-sm text-stone-500">
                            Upload a screenshot or photo of your bank transfer
                            confirmation. Accepted: JPEG, PNG, WebP (max 5MB).
                        </p>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9d6c9] bg-[#f4f7f4] px-6 py-8 transition hover:border-green-500 hover:bg-[#e8f0e8]">
                            <svg
                                className="mb-2 h-8 w-8 text-stone-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                            </svg>
                            <span className="text-sm font-medium text-stone-600">
                                {uploading
                                    ? "Uploading..."
                                    : "Click to choose file"}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleProofUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>

                        {uploadError && (
                            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {uploadError}
                            </p>
                        )}
                        {uploadSuccess && (
                            <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                ✓ Proof uploaded successfully. We'll verify
                                your payment shortly.
                            </p>
                        )}
                    </div>
                )}

                {/* Already uploaded proof notice */}
                {txn.proofUploadedAt && (
                    <div className="mb-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700 ring-1 ring-blue-200">
                        ✓ Proof of payment submitted on{" "}
                        {new Date(txn.proofUploadedAt).toLocaleString(
                            "en-GB"
                        )}
                    </div>
                )}

                {/* Transfer summary */}
                <div className="rounded-2xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9]">
                    <h2 className="mb-4 text-base font-semibold text-stone-900">
                        Transfer Summary
                    </h2>
                    <div className="divide-y divide-[#c9d6c9]">
                        {[
                            ["Destination", txn.country],
                            ["Recipient", txn.receiverName],
                            ["Recipient Phone", txn.receiverPhone],
                            [
                                "You Send",
                                `£${Number(txn.amountInGbp).toFixed(2)}`,
                            ],
                            [
                                "Transfer Fee",
                                `£${Number(txn.feeGbp).toFixed(2)} (${txn.feePercentage}%)`,
                            ],
                            [
                                "Exchange Rate",
                                `1 GBP = ${txn.rate} ${currency}`,
                            ],
                            [
                                "Recipient Gets",
                                `${Number(txn.amountOut).toFixed(2)} ${currency}`,
                            ],
                            [
                                "Created",
                                new Date(txn.createdAt).toLocaleString(
                                    "en-GB"
                                ),
                            ],
                            ...(txn.paidOutAt
                                ? [
                                      [
                                          "Completed",
                                          new Date(
                                              txn.paidOutAt
                                          ).toLocaleString("en-GB"),
                                      ],
                                  ]
                                : []),
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="flex justify-between py-3 text-sm"
                            >
                                <span className="text-stone-500">{label}</span>
                                <span className="font-medium text-stone-900">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}