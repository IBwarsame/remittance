"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const params = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(
        `https://remittance-a87imep33-ibwarsames-projects.vercel.app/transactions/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setTransaction(data);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
    setLoading(false);
  };

  const uploadProof = async () => {
    setUploading(true);
    try {
      const response = await fetch(
        `https://remittance-a87imep33-ibwarsames-projects.vercel.app/transactions/${params.id}/proof`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        fetchTransaction();
        alert("Payment proof uploaded successfully!");
      }
    } catch (error) {
      alert("Error uploading proof");
    }
    setUploading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CREATED":
        return "bg-yellow-100 text-yellow-800";
      case "AWAITING_FUNDS_CHECK":
        return "bg-blue-100 text-blue-800";
      case "PAID_IN":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CREATED":
        return "Awaiting Payment";
      case "AWAITING_FUNDS_CHECK":
        return "Verifying Payment";
      case "PAID_IN":
        return "Processing Transfer";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction Not Found
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Return to Home
          </Link>
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

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Status Banner */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Transaction Details
              </h1>
              <p className="mt-2 text-gray-600">
                Reference: {transaction.bankReference}
              </p>
            </div>
            <div>
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                  transaction.status
                )}`}
              >
                {getStatusText(transaction.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions (if CREATED) */}
        {transaction.status === "CREATED" && (
          <div className="mb-8 rounded-xl border-2 border-blue-600 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Complete Your Payment
            </h2>
            <p className="mt-2 text-gray-700">
              Transfer{" "}
              <span className="font-bold text-blue-600">
                £{transaction.amountInGbp.toFixed(2)}
              </span>{" "}
              to our bank account:
            </p>
            <div className="mt-4 space-y-2 rounded-lg bg-white p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-semibold">Barclays Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-semibold">Remit Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-semibold">12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sort Code:</span>
                <span className="font-semibold">12-34-56</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Reference:</span>
                <span className="font-bold text-blue-600">
                  {transaction.bankReference}
                </span>
              </div>
            </div>
            <button
              onClick={uploadProof}
              disabled={uploading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "I've Made the Payment"}
            </button>
          </div>
        )}

        {/* Transfer Summary */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">Transfer Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Destination</span>
              <span className="font-semibold">{transaction.country}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Recipient Name</span>
              <span className="font-semibold">{transaction.receiverName}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Recipient Phone</span>
              <span className="font-semibold">{transaction.receiverPhone}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Amount Sent</span>
              <span className="font-semibold">
                £{transaction.amountInGbp.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Transfer Fee</span>
              <span className="font-semibold">
                £{transaction.feeGbp.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-semibold">
                1 GBP = {transaction.rate}{" "}
                {transaction.country === "Somalia" ? "SOS" : "ETB"}
              </span>
            </div>
            <div className="flex justify-between bg-blue-50 p-4">
              <span className="text-lg font-bold text-gray-900">
                Recipient Gets
              </span>
              <span className="text-xl font-bold text-blue-600">
                {transaction.amountOut.toFixed(2)}{" "}
                {transaction.country === "Somalia" ? "SOS" : "ETB"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">
            Transaction Timeline
          </h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Transfer Created
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(transaction.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {transaction.proofUploadedAt && (
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Payment Proof Uploaded
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.proofUploadedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {transaction.fundsInAt && (
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Funds Confirmed
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.fundsInAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {transaction.paidOutAt && (
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Transfer Completed
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.paidOutAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}