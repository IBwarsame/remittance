"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
    const [amount, setAmount] = useState(100);
    const RATE = 34;
    const FEE_PERCENTAGE = 0.02;
    const fee = amount * FEE_PERCENTAGE;
    const converted = (amount - fee) * RATE;

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar activePage="home" />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#eef2ee] to-[#ddeedd] py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight text-stone-900">
                                Send Money to
                                <span className="text-green-700">
                                    {" "}
                                    East Africa
                                </span>{" "}
                                with Confidence
                            </h1>
                            <p className="mt-6 text-lg text-stone-600">
                                Fast, secure, and affordable remittance to
                                Somalia and Ethiopia. Track your transfers in
                                real-time and support your loved ones back home.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <Link
                                    href="/send"
                                    className="rounded-lg bg-green-700 px-6 py-3 text-lg font-semibold text-white hover:bg-green-800"
                                >
                                    Send Money Now
                                </Link>
                                <Link
                                    href="/rates"
                                    className="rounded-lg border-2 border-green-700 px-6 py-3 text-lg font-semibold text-green-700 hover:bg-[#ddeedd]"
                                >
                                    View Rates
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-green-700">
                                        2%
                                    </div>
                                    <div className="text-sm text-stone-500">
                                        Low Fee
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-700">
                                        2-24hrs
                                    </div>
                                    <div className="text-sm text-stone-500">
                                        Transfer Time
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-700">
                                        100%
                                    </div>
                                    <div className="text-sm text-stone-500">
                                        Secure
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Calculator */}
                        <div className="rounded-2xl bg-[#eef2ee] p-8 shadow-lg ring-1 ring-[#c9d6c9]">
                            <h3 className="mb-6 text-2xl font-bold text-stone-900">
                                Quick Quote
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700">
                                        You Send
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-3 text-lg text-stone-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <span className="text-lg font-semibold text-stone-600">
                                            GBP
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-[#dde7dd] p-4">
                                    <div className="flex justify-between text-sm text-stone-600">
                                        <span>Transfer Fee (2%)</span>
                                        <span>£{fee.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between text-sm text-stone-600">
                                        <span>Exchange Rate</span>
                                        <span>1 GBP = {RATE} SOS</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700">
                                        Recipient Gets
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className="block w-full rounded-lg border-2 border-green-600 bg-green-50 px-4 py-3 text-lg font-bold text-green-700">
                                            {converted.toFixed(2)}
                                        </div>
                                        <span className="text-lg font-semibold text-stone-600">
                                            SOS
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/send"
                                    className="mt-4 block w-full rounded-lg bg-green-700 py-3 text-center text-lg font-semibold text-white hover:bg-green-800"
                                >
                                    Continue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-stone-900">
                            How It Works
                        </h2>
                        <p className="mt-4 text-lg text-stone-500">
                            Send money in 3 simple steps
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                n: 1,
                                title: "Enter Details",
                                desc: "Choose amount, destination, and add recipient information",
                            },
                            {
                                n: 2,
                                title: "Make Payment",
                                desc: "Transfer to our bank account and upload proof of payment",
                            },
                            {
                                n: 3,
                                title: "Track & Receive",
                                desc: "Monitor your transfer status and recipient gets money in 2-24 hours",
                            },
                        ].map(({ n, title, desc }) => (
                            <div key={n} className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-xl font-bold text-white">
                                    {n}
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-stone-900">
                                    {title}
                                </h3>
                                <p className="mt-2 text-stone-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-[#eef2ee] py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-stone-900">
                            Why Choose Remit?
                        </h2>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: "Low Fees",
                                desc: "Just 2% per transfer. No hidden charges.",
                            },
                            {
                                title: "Fast Transfer",
                                desc: "Most transfers complete within 2-24 hours.",
                            },
                            {
                                title: "Secure",
                                desc: "Bank-level security to protect your money and data.",
                            },
                            {
                                title: "Track Anytime",
                                desc: "Real-time updates on your transfer status.",
                            },
                        ].map(({ title, desc }) => (
                            <div
                                key={title}
                                className="rounded-xl bg-[#dde7dd] p-6 shadow-sm ring-1 ring-[#c9d6c9]"
                            >
                                <h3 className="text-lg font-semibold text-stone-900">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm text-stone-600">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#c9d6c9] bg-[#eef2ee] py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="text-2xl font-bold text-green-700">
                                Remit
                            </div>
                            <p className="mt-4 text-sm text-stone-500">
                                Fast, secure remittance to East Africa.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-stone-800">
                                Company
                            </h4>
                            <ul className="mt-4 space-y-2 text-sm text-stone-500">
                                <li>
                                    <Link
                                        href="/about"
                                        className="hover:text-green-700"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-green-700"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-stone-800">
                                Services
                            </h4>
                            <ul className="mt-4 space-y-2 text-sm text-stone-500">
                                <li>
                                    <Link
                                        href="/send"
                                        className="hover:text-green-700"
                                    >
                                        Send Money
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/rates"
                                        className="hover:text-green-700"
                                    >
                                        Exchange Rates
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-stone-800">
                                Legal
                            </h4>
                            <ul className="mt-4 space-y-2 text-sm text-stone-500">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="hover:text-green-700"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="hover:text-green-700"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-[#c9d6c9] pt-8 text-center text-sm text-stone-400">
                        © 2026 Remit. Final Year Project – Demo Application
                        Only.
                    </div>
                </div>
            </footer>
        </div>
    );
}