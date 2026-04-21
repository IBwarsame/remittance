"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function RatesPage() {
    const [amount, setAmount] = useState(100);
    const [toCurrency, setToCurrency] = useState("SOS");

    const rates = { SOS: 34.0, ETB: 48.5 };
    const converted = (amount * rates[toCurrency]).toFixed(2);

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar activePage="rates" />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-stone-900">
                        Exchange Rates
                    </h1>
                    <p className="mt-3 text-stone-500">
                        Live rates for sending money to East Africa
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                        Last updated: {new Date().toLocaleString()}
                    </p>
                </div>

                {/* Converter */}
                <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                    <h2 className="text-xl font-bold text-stone-900">
                        Currency Converter
                    </h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-stone-700">
                                You Send
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-2 block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-3 text-stone-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <div className="mt-2 rounded-lg border border-[#c9d6c9] bg-[#dde7dd] px-4 py-2 text-sm font-medium text-stone-600">
                                GBP – British Pound
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700">
                                Recipient Gets
                            </label>
                            <div className="mt-2 rounded-lg border-2 border-green-600 bg-green-50 px-4 py-3 text-lg font-bold text-green-700">
                                {converted}
                            </div>
                            <select
                                value={toCurrency}
                                onChange={(e) =>
                                    setToCurrency(e.target.value)
                                }
                                className="mt-2 block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-2 text-stone-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="SOS">
                                    SOS – Somali Shilling
                                </option>
                                <option value="ETB">
                                    ETB – Ethiopian Birr
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-[#dde7dd] p-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-stone-500">
                                Exchange Rate
                            </span>
                            <span className="font-semibold text-stone-800">
                                1 GBP = {rates[toCurrency]} {toCurrency}
                            </span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <span className="text-stone-500">
                                Transfer Fee (2%)
                            </span>
                            <span className="font-semibold text-stone-800">
                                £{(amount * 0.02).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/send"
                        className="mt-6 block w-full rounded-lg bg-green-700 py-3 text-center font-semibold text-white transition hover:bg-green-800"
                    >
                        Send Money Now
                    </Link>
                </div>

                {/* Rate Cards */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {[
                        {
                            name: "Somalia",
                            flag: "🇸🇴",
                            currency: "Somali Shilling (SOS)",
                            rate: `1 GBP = ${rates.SOS} SOS`,
                        },
                        {
                            name: "Ethiopia",
                            flag: "🇪🇹",
                            currency: "Ethiopian Birr (ETB)",
                            rate: `1 GBP = ${rates.ETB} ETB`,
                        },
                    ].map(({ name, flag, currency, rate }) => (
                        <div
                            key={name}
                            className="rounded-xl bg-[#eef2ee] p-6 shadow-sm ring-1 ring-[#c9d6c9]"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-stone-900">
                                    {name}
                                </h3>
                                <span className="text-4xl">{flag}</span>
                            </div>
                            <div className="mt-5 space-y-3 text-sm">
                                {[
                                    ["Currency", currency],
                                    ["Rate", rate],
                                    ["Transfer Time", "2–24 hours"],
                                    ["Fee", "2%"],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex justify-between"
                                    >
                                        <span className="text-stone-500">
                                            {label}
                                        </span>
                                        <span
                                            className={`font-semibold ${label === "Rate" ? "text-green-700" : "text-stone-700"}`}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-10 rounded-xl bg-[#dde7dd] p-8">
                    <h3 className="text-lg font-bold text-stone-900">
                        Why Our Rates Are Great
                    </h3>
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {[
                            [
                                "Real-time",
                                "Rates updated every hour to give you the best value",
                            ],
                            [
                                "Transparent",
                                "No hidden fees. What you see is what you pay",
                            ],
                            [
                                "Competitive",
                                "Better rates than traditional banks and money transfer services",
                            ],
                        ].map(([title, desc]) => (
                            <div key={title}>
                                <div className="font-bold text-green-700">
                                    {title}
                                </div>
                                <p className="mt-1 text-sm text-stone-600">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}