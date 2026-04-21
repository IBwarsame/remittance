"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const RATES = { Somalia: 34, Ethiopia: 48.5 };
const FEE_PERCENTAGE = 0.02;

function SendMoneyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        country: searchParams.get("country") || "Somalia",
        amountInGbp: 100,
        receiverName: searchParams.get("name") || "",
        receiverPhone: searchParams.get("phone") || "",
    });
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveBeneficiary, setSaveBeneficiary] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("userRole"));
    }, []);

    const rate = RATES[formData.country];
    const feeGbp = formData.amountInGbp * FEE_PERCENTAGE;

    const validateStep1 = () => {
        const e = {};
        if (formData.amountInGbp < 10)
            e.amountInGbp = "Minimum transfer amount is £10";
        if (!formData.country) e.country = "Please select a country";
        return e;
    };

    const validateStep2 = () => {
        const e = {};
        if (!formData.receiverName.trim())
            e.receiverName = "Receiver name is required";
        if (
            !formData.receiverPhone.trim() ||
            formData.receiverPhone.trim().length < 6
        )
            e.receiverPhone = "Valid phone number is required";
        return e;
    };

    const getQuote = async () => {
        const e = validateStep1();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const data = await apiFetch("/quote", {
                method: "POST",
                body: JSON.stringify({
                    country: formData.country,
                    amountInGbp: formData.amountInGbp,
                }),
            });
            setQuote(data);
            setStep(2);
        } catch (err) {
            setErrors({ general: err.message });
        }
        setLoading(false);
    };

    const createTransaction = async () => {
        const e = validateStep2();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        if (!isLoggedIn) {
            router.push(`/login?redirect=${encodeURIComponent("/send")}`);
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            if (saveBeneficiary) {
                try {
                    await apiFetch("/beneficiaries", {
                        method: "POST",
                        body: JSON.stringify({
                            fullName: formData.receiverName,
                            phone: formData.receiverPhone,
                            country: formData.country,
                        }),
                    });
                } catch {
                    // non-fatal
                }
            }

            const data = await apiFetch("/transactions", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            router.push(`/transactions/${data.id}`);
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            else setErrors({ general: err.message });
        }
        setLoading(false);
    };

    const inputClass = (field) =>
        `mt-2 block w-full rounded-lg border px-4 py-3 text-stone-700 placeholder-stone-400 bg-[#f4f7f4] focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors[field]
                ? "border-red-400"
                : "border-[#c9d6c9] focus:border-green-500"
        }`;

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar activePage="send" />

            <div className="mx-auto max-w-2xl px-4 py-12">
                {/* Progress */}
                <div className="mb-8 flex justify-center gap-4">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                                    step >= s
                                        ? "bg-green-700 text-white"
                                        : "bg-[#c9d6c9] text-stone-500"
                                }`}
                            >
                                {s}
                            </div>
                            {s < 2 && (
                                <div className="ml-4 h-0.5 w-16 bg-[#c9d6c9]" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                        <h2 className="text-2xl font-bold text-stone-900">
                            Send Money to East Africa
                        </h2>
                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Destination Country
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData((f) => ({
                                            ...f,
                                            country: e.target.value,
                                        }))
                                    }
                                    className="mt-2 block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-3 text-stone-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="Somalia">🇸🇴 Somalia</option>
                                    <option value="Ethiopia">
                                        🇪🇹 Ethiopia
                                    </option>
                                </select>
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.country}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Amount to Send (GBP)
                                </label>
                                <input
                                    type="number"
                                    value={formData.amountInGbp}
                                    onChange={(e) =>
                                        setFormData((f) => ({
                                            ...f,
                                            amountInGbp: Number(e.target.value),
                                        }))
                                    }
                                    className={inputClass("amountInGbp")}
                                    min="10"
                                />
                                {errors.amountInGbp && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.amountInGbp}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg bg-[#dde7dd] p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">
                                        Transfer Fee (2%)
                                    </span>
                                    <span className="font-medium text-stone-700">
                                        £{feeGbp.toFixed(2)}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-stone-600">
                                        Exchange Rate
                                    </span>
                                    <span className="font-medium text-stone-700">
                                        1 GBP = {rate}{" "}
                                        {formData.country === "Somalia"
                                            ? "SOS"
                                            : "ETB"}
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-between border-t border-[#c9d6c9] pt-3">
                                    <span className="font-semibold text-stone-800">
                                        Recipient Gets
                                    </span>
                                    <span className="text-lg font-bold text-green-700">
                                        {(
                                            (formData.amountInGbp - feeGbp) *
                                            rate
                                        ).toFixed(2)}{" "}
                                        {formData.country === "Somalia"
                                            ? "SOS"
                                            : "ETB"}
                                    </span>
                                </div>
                            </div>

                            {errors.general && (
                                <p className="text-sm text-red-500">
                                    {errors.general}
                                </p>
                            )}

                            {!isLoggedIn && (
                                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                                    You&apos;ll need to{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium underline"
                                    >
                                        sign in
                                    </Link>{" "}
                                    before completing your transfer.
                                </div>
                            )}

                            <button
                                onClick={getQuote}
                                disabled={
                                    loading || formData.amountInGbp < 10
                                }
                                className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-[#c9d6c9]"
                            >
                                {loading ? "Loading..." : "Continue"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                        <h2 className="text-2xl font-bold text-stone-900">
                            Recipient Details
                        </h2>
                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Recipient Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.receiverName}
                                    onChange={(e) =>
                                        setFormData((f) => ({
                                            ...f,
                                            receiverName: e.target.value,
                                        }))
                                    }
                                    className={inputClass("receiverName")}
                                    placeholder="Enter full name"
                                />
                                {errors.receiverName && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.receiverName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Recipient Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.receiverPhone}
                                    onChange={(e) =>
                                        setFormData((f) => ({
                                            ...f,
                                            receiverPhone: e.target.value,
                                        }))
                                    }
                                    className={inputClass("receiverPhone")}
                                    placeholder="+252 or +251"
                                />
                                {errors.receiverPhone && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.receiverPhone}
                                    </p>
                                )}
                            </div>

                            {isLoggedIn && (
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#c9d6c9] p-4 hover:bg-[#dde7dd]">
                                    <input
                                        type="checkbox"
                                        checked={saveBeneficiary}
                                        onChange={(e) =>
                                            setSaveBeneficiary(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded accent-green-700"
                                    />
                                    <span className="text-sm text-stone-600">
                                        Save this recipient for future transfers
                                    </span>
                                </label>
                            )}

                            <div className="rounded-lg bg-[#dde7dd] p-4">
                                <h3 className="font-semibold text-stone-900">
                                    Transfer Summary
                                </h3>
                                <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">
                                            Destination
                                        </span>
                                        <span className="font-medium text-stone-700">
                                            {formData.country}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">
                                            You Send
                                        </span>
                                        <span className="font-medium text-stone-700">
                                            £
                                            {formData.amountInGbp.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">
                                            Recipient Gets
                                        </span>
                                        <span className="font-semibold text-green-700">
                                            {quote?.amountOut.toFixed(2)}{" "}
                                            {formData.country === "Somalia"
                                                ? "SOS"
                                                : "ETB"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {errors.general && (
                                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {errors.general}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setErrors({});
                                    }}
                                    className="w-full rounded-lg border border-[#c9d6c9] py-3 font-semibold text-stone-700 transition hover:bg-[#dde7dd]"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={createTransaction}
                                    disabled={loading}
                                    className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-[#c9d6c9]"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Transfer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SendMoneyPage() {
    return (
        <Suspense>
            <SendMoneyForm />
        </Suspense>
    );
}