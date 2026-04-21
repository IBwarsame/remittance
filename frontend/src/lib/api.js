const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch(path, options = {}) {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers = {
            "Content-Type": "application/json", // ADD this line
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

    const res = await fetch(`${BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        // Token expired or invalid — clear storage and redirect to login
        if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = "/login";
        }
        throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.error || `Request failed: ${res.status}`);
        err.fields = body.fields || null;
        throw err;
    }

    return res.json();
}