"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");

    setLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      // Always show success — don't reveal whether email exists
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]">
        <div className="w-full max-w-md rounded-2xl bg-[#eef2ee] p-10 text-center shadow-sm ring-1 ring-[#c9d6c9]">
          <div className="text-5xl">📬</div>
          <h2 className="mt-4 text-2xl font-bold text-stone-900">
            Check your inbox
          </h2>
          <p className="mt-2 text-stone-500">
            If an account exists for{" "}
            <span className="font-medium text-stone-700">{email}</span>, you
            will receive a password reset link shortly.
          </p>
          <Link
            href="/login"
            className="mt-6 block rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <Navbar />

      <div className="mx-auto max-w-md px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900">
            Forgot Password
          </h1>
          <p className="mt-3 text-stone-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="mt-10 rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  error
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#c9d6c9] focus:border-green-500"
                }`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-stone-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-medium text-green-700 hover:underline"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}