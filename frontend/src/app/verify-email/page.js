"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found in the link.");
            return;
        }

        const verify = async () => {
            try {
                const data = await apiFetch(`/auth/verify/${token}`);
                setStatus("success");
                setMessage(
                    data.message ||
                        "Your email has been verified successfully.",
                );
            } catch (err) {
                setStatus("error");
                setMessage(
                    err.message ||
                        "Verification failed. The link may have expired.",
                );
            }
        };

        verify();
    }, [token]);

    const states = {
        loading: {
            icon: "⏳",
            title: "Verifying your email…",
            body: "Please wait a moment.",
            link: null,
        },
        success: {
            icon: "✅",
            title: "Email Verified!",
            body: message,
            link: { href: "/login", label: "Sign In" },
        },
        error: {
            icon: "❌",
            title: "Verification Failed",
            body: message,
            link: { href: "/register", label: "Back to Register" },
        },
    };

    const { icon, title, body, link } = states[status];

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
                <div className="text-5xl">{icon}</div>
                <h2 className="mt-4 text-2xl font-bold text-stone-900">
                    {title}
                </h2>
                <p className="mt-2 text-stone-500">{body}</p>
                {link && (
                    <Link
                        href={link.href}
                        className="mt-6 block rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
                    >
                        {link.label}
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}