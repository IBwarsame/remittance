"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendMoneyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: "Somalia",
    amountInGbp: 100,
    receiverName: "",
    receiverPhone: "",
  });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const RATE = formData.country === "Somalia" ? 34 : 48.5;
  const FEE = 2;

  const getQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          amountInGbp: formData.amountInGbp,
        }),
      });
      const data = await response.json();
      setQuote(data);
      setStep(2);
    } catch (error) {
      alert("Error getting quote. Make sure backend is running!");
    }
    setLoading(false);
  };

  const createTransaction = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      router.push(`/transactions/${data.id}`);
    } catch (error) {
      alert("Error creating transaction");
    }
    setLoading(false);
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
              <Link href="/rates" className="text-gray-700 hover:text-blue-600">
                Exchange Rates
              </Link>
              <Link href="/send" className="font-semibold text-blue-600">
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

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className="h-1 w-20 bg-gray-200"></div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Step 1: Amount & Destination */}
        {step === 1 && (
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Money to East Africa
            </h2>

            <div className="mt-6 space-y-6">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Destination Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                >
                  <option value="Somalia">🇸🇴 Somalia</option>
                  <option value="Ethiopia">🇪🇹 Ethiopia</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount to Send (GBP)
                </label>
                <input
                  type="number"
                  value={formData.amountInGbp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amountInGbp: Number(e.target.value),
                    })
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                  min="10"
                />
              </div>

              {/* Quote Preview */}
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Transfer Fee</span>
                  <span className="font-semibold text-gray-500">£{FEE.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-700">Exchange Rate</span>
                  <span className="font-semibold text-gray-500">
                    1 GBP = {RATE}{" "}
                    {formData.country === "Somalia" ? "SOS" : "ETB"}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="font-bold text-gray-900">
                    Recipient Gets
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {((formData.amountInGbp - FEE) * RATE).toFixed(2)}{" "}
                    {formData.country === "Somalia" ? "SOS" : "ETB"}
                  </span>
                </div>
              </div>

              <button
                onClick={getQuote}
                disabled={loading || formData.amountInGbp < 10}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {step === 2 && (
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">
              Recipient Details
            </h2>

            <div className="mt-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) =>
                    setFormData({ ...formData, receiverName: e.target.value })
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.receiverPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, receiverPhone: e.target.value })
                  }
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                  placeholder="+252 or +251"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Transfer Summary
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Destination</span>
                    <span className="font-semibold text-gray-500">{formData.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You Send</span>
                    <span className="font-semibold text-gray-500">
                      £{formData.amountInGbp.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient Gets</span>
                    <span className="font-semibold text-blue-600">
                      {quote?.amountOut.toFixed(2)}{" "}
                      {formData.country === "Somalia" ? "SOS" : "ETB"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={createTransaction}
                  disabled={
                    loading ||
                    !formData.receiverName ||
                    !formData.receiverPhone
                  }
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Transfer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}