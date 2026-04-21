"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const PASSWORD_HINT =
  "Min. 12 characters with uppercase, lowercase, number, and special character";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrors({ general: "Invalid or missing reset token." });
    }
  }, [token]);

  const validate = () => {
    const e = {};
    if (!password) {
      e.password = "Password is required";
    } else {
      if (password.length < 12)
        e.password = "Password must be at least 12 characters";
      else if (!/[A-Z]/.test(password))
        e.password = "Password must contain at least one uppercase letter";
      else if (!/[a-z]/.test(password))
        e.password = "Password must contain at least one lowercase letter";
      else if (!/[0-9]/.test(password))
        e.password = "Password must contain at least one number";
      else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password))
        e.password = "Password must contain at least one special character";
    }
    if (password && !e.password && password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ general: err.message || "Reset failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]">
        <div className="w-full max-w-md rounded-2xl bg-[#eef2ee] p-10 text-center shadow-sm ring-1 ring-[#c9d6c9]">
          <div className="text-5xl">✅</div>
          <h2 className="mt-4 text-2xl font-bold text-stone-900">
            Password Reset!
          </h2>
          <p className="mt-2 text-stone-500">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link
            href="/login"
            className="mt-6 block rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Sign In
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
          <h1 className="text-4xl font-bold text-stone-900">Reset Password</h1>
          <p className="mt-3 text-stone-500">Enter your new password below</p>
        </div>

        <div className="mt-10 rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Min. 12 characters"
                className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#c9d6c9] focus:border-green-500"
                }`}
              />
              {errors.password ? (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-stone-400">{PASSWORD_HINT}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-stone-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                placeholder="Repeat password"
                className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#c9d6c9] focus:border-green-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-stone-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}