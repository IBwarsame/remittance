"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://remittance-a87imep33-ibwarsames-projects.vercel.app/transactions");
      const transactions = await response.json();

      const found = transactions.find(
        (t) =>
          t.bankReference.toLowerCase() === reference.toLowerCase() ||
          t.id === reference
      );

      if (found) {
        router.push(`/transactions/${found.id}`);
      } else {
        setError("Transaction not found. Please check your reference.");
      }
    } catch (err) {
      setError("Error connecting to server. Please try again.");
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
              <Link href="/send" className="text-gray-700 hover:text-blue-600">
                Send Money
              </Link>
              <Link href="/track" className="font-semibold text-blue-600">
                Track Transfer
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

      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Track Your Transfer
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Enter your transaction reference to see the status
          </p>
        </div>

        {/* Track Form */}
        <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., TXN-ABC12345"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                You can find this in your confirmation email or transaction
                receipt
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !reference.trim()}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Searching..." : "Track Transfer"}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-xl bg-blue-50 p-6">
          <h3 className="font-semibold text-gray-900">
            What you can track:
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Real-time transfer status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Payment confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Estimated delivery time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✓</span>
              <span>Recipient details</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}