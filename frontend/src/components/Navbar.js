"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ activePage }) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        setIsLoggedIn(!!role);
        setIsAdmin(role === "admin" || role === "developer");
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const logoHref = isAdmin
        ? "/admin"
        : isLoggedIn
          ? "/dashboard"
          : "/";

    const linkClass = (page) =>
        `text-sm transition-colors ${
            activePage === page
                ? "font-semibold text-green-700"
                : "text-stone-600 hover:text-green-700"
        }`;

    return (
        <nav className="border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href={logoHref}
                        className="text-2xl font-bold tracking-tight text-green-700"
                    >
                        Remit
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/rates" className={linkClass("rates")}>
                            Exchange Rates
                        </Link>
                        <Link href="/send" className={linkClass("send")}>
                            Send Money
                        </Link>
                        <Link href="/track" className={linkClass("track")}>
                            Track Transfer
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={isAdmin ? "/admin" : "/dashboard"}
                                    className={linkClass("dashboard")}
                                >
                                    {isAdmin ? "Admin" : "Dashboard"}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}