"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  
    // Mock authentication
    if (email === "admin@remitquick.com" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);
      router.push("/admin"); // Redirect directly to admin dashboard
    } else if (email && password) {
      setUserRole("user");
      setIsLoggedIn(true);
      localStorage.setItem("userRole", "user");
      localStorage.setItem("userEmail", email);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  if (isLoggedIn) {
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
                <Link href="/track" className="text-gray-700 hover:text-blue-600">
                  Track Transfer
                </Link>
                <button onClick={handleLogout} className="Btn" type="button">
                  <div className="sign">
                    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>
                  <div className="text">Logout</div>
                </button>
              </div>
            </div>
          </div>
        </nav>
  
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="mt-4 text-lg text-gray-00">
              You are logged in as a user
            </p>
          </div>
  
          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Link
              href="/send"
              className="rounded-xl border-2 border-blue-600 bg-white p-8 hover:bg-blue-50 transition-colors"
            >
              <div className="text-4xl mb-4"></div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Send Money
              </h3>
              <p className="mt-2 text-gray-600">
                Start a new transfer to Somalia or Ethiopia
              </p>
            </Link>
            <Link
              href="/track"
              className="rounded-xl border-2 border-blue-600 bg-white p-8 hover:bg-blue-50 transition-colors"
            >
              <div className="text-4xl mb-4"></div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Track Transfer
              </h3>
              <p className="mt-2 text-gray-600">
                Check the status of your transactions
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/track" className="text-gray-700 hover:text-blue-600">
                Track Transfer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-md px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-4 text-lg text-gray-600">
            Access your Remit account
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 rounded-xl bg-yellow-50 border border-yellow-200 p-6">
          <h3 className="font-semibold text-gray-900">Demo Credentials</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-800">
            <div className="rounded-lg bg-white p-3">
              <span className="font-semibold text-blue-600">Admin:</span>
              <br />
              <span className="text-gray-700">Email: admin@remitquick.com</span>
              <br />
              <span className="text-gray-700">Password: admin123</span>
            </div>
            <div className="rounded-lg bg-white p-3">
              <span className="font-semibold text-blue-600">User:</span>
              <br />
              <span className="text-gray-700">Email: any email</span>
              <br />
              <span className="text-gray-700">Password: any password</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}