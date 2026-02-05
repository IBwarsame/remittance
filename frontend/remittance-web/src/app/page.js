"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [amount, setAmount] = useState(100);
  const RATE = 34;
  const FEE_PERCENTAGE = 0.02; // 2%
  const fee = amount * FEE_PERCENTAGE;
  const converted = (amount - fee) * RATE;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Remit
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link href="/rates" className="text-gray-700 hover:text-blue-600">
                Exchange Rates
              </Link>
              <Link href="/send" className="text-gray-700 hover:text-blue-600">
                Send Money
              </Link>
              <Link href="/track" className="text-gray-700 hover:text-blue-600">
                Track Transfer
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                Send Money to
                <span className="text-blue-600"> East Africa</span> with
                Confidence
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Fast, secure, and affordable remittance to Somalia and Ethiopia.
                Track your transfers in real-time and support your loved ones
                back home.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/send"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  Send Money Now
                </Link>
                <Link
                  href="/rates"
                  className="rounded-lg border-2 border-blue-600 px-6 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50"
                >
                  View Rates
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">2%</div>
                  <div className="text-sm text-gray-600">Low Fee</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">2-24hrs</div>
                  <div className="text-sm text-gray-600">Transfer Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
              </div>
            </div>

            {/* Quick Calculator */}
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Quick Quote
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    You Send
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                    <span className="text-lg font-semibold text-gray-700">
                      GBP
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Transfer Fee (2%)</span>
                    <span>£{fee.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>Exchange Rate</span>
                    <span>1 GBP = {RATE} SOS</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recipient Gets
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="block w-full rounded-lg border-2 border-blue-600 bg-blue-50 px-4 py-3 text-lg font-bold text-blue-600">
                      {converted.toFixed(2)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      SOS
                    </span>
                  </div>
                </div>

                <Link
                  href="/send"
                  className="mt-4 block w-full rounded-lg bg-blue-600 py-3 text-center text-lg font-semibold text-white hover:bg-blue-700"
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
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Send money in 3 simple steps
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Enter Details
              </h3>
              <p className="mt-2 text-gray-600">
                Choose amount, destination, and add recipient information
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Make Payment
              </h3>
              <p className="mt-2 text-gray-600">
                Transfer to our bank account and upload proof of payment
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Track & Receive
              </h3>
              <p className="mt-2 text-gray-600">
                Monitor your transfer status and recipient gets money in 2-24
                hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Remit?
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Low Fees
              </h3>
              <p className="mt-2 text-gray-600">
                Just 2% per transfer. No hidden charges.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Fast Transfer
              </h3>
              <p className="mt-2 text-gray-600">
                Most transfers complete within 2-24 hours.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Secure
              </h3>
              <p className="mt-2 text-gray-600">
                Bank-level security to protect your money and data.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Track Anytime
              </h3>
              <p className="mt-2 text-gray-600">
                Real-time updates on your transfer status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">Remit</div>
              <p className="mt-4 text-sm text-gray-600">
                Fast, secure remittance to East Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Services</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/send">Send Money</Link>
                </li>
                <li>
                  <Link href="/rates">Exchange Rates</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © 2026 Remit. Final Year Project - Demo Application Only.
          </div>
        </div>
      </footer>
    </div>
  );
}