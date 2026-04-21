"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) return setError("Email is required");
        if (!password) return setError("Password is required");

        setLoading(true);
        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.user.role);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userName", data.user.fullName);

            if (
                data.user.role === "admin" ||
                data.user.role === "developer"
            ) {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const hasError = !!error;

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <Navbar />

            <div className="mx-auto max-w-md px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-stone-900">
                        Sign In
                    </h1>
                    <p className="mt-3 text-stone-500">
                        Access your Remit account
                    </p>
                </div>

                <div className="mt-10 rounded-2xl bg-[#eef2ee] p-8 shadow-sm ring-1 ring-[#c9d6c9]">
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                        noValidate
                    >
                        <div>
                            <label className="block text-sm font-medium text-stone-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                placeholder="your@email.com"
                                className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${hasError
                                    ? "border-red-400 focus:border-red-400"
                                    : "border-[#c9d6c9] focus:border-green-500"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="••••••••"
                                className={`mt-2 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${hasError
                                    ? "border-red-400 focus:border-red-400"
                                    : "border-[#c9d6c9] focus:border-green-500"
                                    }`}
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:bg-stone-400"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
                    <Link
                            href="/forgot-password"
                            className="font-medium text-green-700 hover:underline"
                        >
                            Forgot password?
                        </Link>
                        <span>
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-green-700 hover:underline"
                            >
                                Sign up
                            </Link>
                        </span>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}