"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function BeneficiariesPage() {
    const router = useRouter();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        country: "Somalia",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (!role) {
            router.push("/login");
            return;
        }
        fetchBeneficiaries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBeneficiaries = async () => {
        setLoading(true);
        try {
            const data = await apiFetch("/beneficiaries");
            setBeneficiaries(data);
        } catch (err) {
            setFetchError(err.message);
        }
        setLoading(false);
    };

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.phone.trim() || form.phone.trim().length < 6)
            e.phone = "Valid phone number is required";
        if (form.country !== "Somalia" && form.country !== "Ethiopia")
            e.country = "Select a valid country";
        return e;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const clientErrors = validate();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }
        setErrors({});
        setSaving(true);
        try {
            await apiFetch("/beneficiaries", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setForm({ fullName: "", phone: "", country: "Somalia" });
            setShowForm(false);
            fetchBeneficiaries();
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            else setErrors({ general: err.message });
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove this beneficiary?")) return;
        try {
            await apiFetch(`/beneficiaries/${id}`, { method: "DELETE" });
            setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
        } catch {
            alert("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f4]">
            <nav className="border-b border-[#c9d6c9] bg-[#eef2ee]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-green-700"
                        >
                            Remit
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm text-stone-600 hover:text-green-700"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            Beneficiaries
                        </h1>
                        <p className="mt-1 text-stone-500">
                            Saved recipients for faster transfers
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
                    >
                        {showForm ? "Cancel" : "+ Add New"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSave}
                        className="mb-6 rounded-xl bg-[#eef2ee] p-6 shadow-lg ring-1 ring-[#c9d6c9]"
                        noValidate
                    >
                        <h2 className="mb-4 text-lg font-bold text-stone-900">
                            New Beneficiary
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            fullName: e.target.value,
                                        }))
                                    }
                                    className={`mt-1 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 ${errors.fullName ? "border-red-500" : "border-[#c9d6c9]"}`}
                                    placeholder="Ahmed Mohamed"
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            phone: e.target.value,
                                        }))
                                    }
                                    className={`mt-1 block w-full rounded-lg border bg-[#f4f7f4] px-4 py-3 text-stone-700 ${errors.phone ? "border-red-500" : "border-[#c9d6c9]"}`}
                                    placeholder="+252 61 234 5678"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700">
                                    Country
                                </label>
                                <select
                                    value={form.country}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            country: e.target.value,
                                        }))
                                    }
                                    className="mt-1 block w-full rounded-lg border border-[#c9d6c9] bg-[#f4f7f4] px-4 py-3 text-stone-700"
                                >
                                    <option value="Somalia">🇸🇴 Somalia</option>
                                    <option value="Ethiopia">
                                        🇪🇹 Ethiopia
                                    </option>
                                </select>
                                {errors.country && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.country}
                                    </p>
                                )}
                            </div>

                            {errors.general && (
                                <p className="text-sm text-red-600">
                                    {errors.general}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:bg-[#c9d6c9]"
                            >
                                {saving ? "Saving..." : "Save Beneficiary"}
                            </button>
                        </div>
                    </form>
                )}

                {fetchError && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {fetchError}
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-stone-500">Loading...</p>
                ) : beneficiaries.length === 0 ? (
                    <div className="rounded-xl bg-[#eef2ee] p-12 text-center shadow-lg ring-1 ring-[#c9d6c9]">
                        <p className="text-stone-500">
                            No saved beneficiaries yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {beneficiaries.map((b) => (
                            <div
                                key={b.id}
                                className="flex items-center justify-between rounded-xl bg-[#eef2ee] px-6 py-4 shadow ring-1 ring-[#c9d6c9]"
                            >
                                <div>
                                    <p className="font-semibold text-stone-900">
                                        {b.fullName}
                                    </p>
                                    <p className="text-sm text-stone-500">
                                        {b.phone} · {b.country}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/send?beneficiaryId=${b.id}&name=${encodeURIComponent(b.fullName)}&phone=${encodeURIComponent(b.phone)}&country=${b.country}`}
                                        className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-800"
                                    >
                                        Send
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(b.id)}
                                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}