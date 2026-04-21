"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

const Field = ({ id, label, type = "text", placeholder, value, onChange, error, hint }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${error
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#c9d6c9] focus:border-green-500"
                }`}
        />
        {hint && !error && (
            <p className="mt-1 text-xs text-stone-400">{hint}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const PASSWORD_HINT =
    "Min. 12 characters with uppercase, lowercase, number, and special character";

export default function RegisterPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const set = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Invalid email address";
        if (!form.phone.trim()) e.phone = "Phone number is required";
        if (!form.password) {
            e.password = "Password is required";
        } else {
            if (form.password.length < 12)
                e.password = "Password must be at least 12 characters";
            else if (!/[A-Z]/.test(form.password))
                e.password = "Password must contain at least one uppercase letter";
            else if (!/[a-z]/.test(form.password))
                e.password = "Password must contain at least one lowercase letter";
            else if (!/[0-9]/.test(form.password))
                e.password = "Password must contain at least one number";
            else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(form.password))
                e.password = "Password must contain at least one special character";
        }
        if (form.password && !e.password && form.password !== form.confirmPassword)
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
            const data = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                }),
            });
            setSuccess(data.message);
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            else setErrors({ general: err.message });
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
                        Check your email
                    </h2>
                    <p className="mt-2 text-stone-500">{success}</p>
                    <Link
                        href="/login"
                        className="mt-6 block rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
                    >
                        Go to Sign In
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
                    <h1 className="text-4xl font-bold text-stone-900">Create Account</h1>
                    <p className="mt-3 text-stone-500">
                        Join Remit to send money to East Africa
                    </p>
                </div>

                <div className="mt-10 rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <Field
                            id="fullName"
                            label="Full Name"
                            placeholder="John Smith"
                            value={form.fullName}
                            onChange={set("fullName")}
                            error={errors.fullName}
                        />
                        <Field
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={set("email")}
                            error={errors.email}
                        />
                        <Field
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="+44 7700 000000"
                            value={form.phone}
                            onChange={set("phone")}
                            error={errors.phone}
                        />
                        <Field
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Min. 12 characters"
                            value={form.password}
                            onChange={set("password")}
                            error={errors.password}
                            hint={PASSWORD_HINT}
                        />
                        <Field
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Repeat password"
                            value={form.confirmPassword}
                            onChange={set("confirmPassword")}
                            error={errors.confirmPassword}
                        />

                        {errors.general && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {errors.general}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-stone-400"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-green-700 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}