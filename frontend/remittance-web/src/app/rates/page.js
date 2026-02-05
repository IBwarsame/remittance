"use client";

import Link from "next/link";
import { useState } from "react";

export default function RatesPage() {
  const [amount, setAmount] = useState(100);
  const [toCurrency, setToCurrency] = useState("SOS");

  const rates = {
    SOS: 34.0,
    ETB: 48.5,
  };

  const convert = () => {
    return (amount * rates[toCurrency]).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Remit
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/rates" className="font-semibold text-blue-600">
                Exchange Rates
              </Link>
              <Link href="/send" className="text-gray-700 hover:text-blue-600">
                Send Money
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Exchange Rates</h1>
          <p className="mt-4 text-lg text-gray-600">
            Real-time rates for sending money to East Africa
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Currency Converter */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            Currency Converter
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                You Send
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-500"
                />
              </div>
              <div className="mt-2 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700">
                GBP - British Pound
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipient Gets
              </label>
              <div className="mt-2">
                <div className="block w-full rounded-lg border-2 border-blue-600 bg-blue-50 px-4 py-3 text-lg font-bold text-blue-600">
                  {convert()}
                </div>
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500"
              >
                <option value="SOS">SOS - Somali Shilling</option>
                <option value="ETB">ETB - Ethiopian Birr</option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-semibold text-gray-900">
                1 GBP = {rates[toCurrency]} {toCurrency}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Transfer Fee</span>
              <span className="font-semibold text-gray-900">£2.00</span>
            </div>
          </div>

          <Link
            href="/send"
            className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Send Money Now
          </Link>
        </div>

        {/* Rate Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Somalia Card */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Somalia</h3>
              <div className="text-4xl">🇸🇴</div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Currency</span>
                <span className="font-semibold text-gray-500">Somali Shilling (SOS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <span className="text-xl font-bold text-blue-600">
                  1 GBP = {rates.SOS} SOS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Time</span>
                <span className="font-semibold text-gray-500">2-24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-semibold text-gray-500">2%</span>
              </div>
            </div>
          </div>

          {/* Ethiopia Card */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Ethiopia</h3>
              <div className="text-4xl">🇪🇹</div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Currency</span>
                <span className="font-semibold text-gray-500">Ethiopian Birr (ETB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <span className="text-xl font-bold text-blue-600">
                  1 GBP = {rates.ETB} ETB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Time</span>
                <span className="font-semibold text-gray-500">2-24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-semibol text-gray-500">2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-xl bg-blue-50 p-8">
          <h3 className="text-xl font-bold text-gray-900">
            Why Our Rates Are Great
          </h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-blue-600">Real-time</div>
              <p className="mt-2 text-gray-600">
                Rates updated every hour to give you the best value
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                Transparent
              </div>
              <p className="mt-2 text-gray-600">
                No hidden fees. What you see is what you pay
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                Competitive
              </div>
              <p className="mt-2 text-gray-600">
                Better rates than traditional banks and money transfer services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}