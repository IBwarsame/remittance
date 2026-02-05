const cors = require("cors");
const { randomUUID } = require("crypto");
const express = require("express");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

const PORT = 3001;

// Updated config with percentage fee
const RATES = {
  Somalia: 34,
  Ethiopia: 48.5,
};
const FEE_PERCENTAGE = 0.02; // 2% fee

const transactions = [];

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/quote", (req, res) => {
  const { country, amountInGbp } = req.body;

  if (
    (country !== "Somalia" && country !== "Ethiopia") ||
    typeof amountInGbp !== "number" ||
    amountInGbp <= 0
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Expected { country: 'Somalia'|'Ethiopia', amountInGbp: number > 0 }",
    });
  }

  const rate = RATES[country];
  const feeGbp = amountInGbp * FEE_PERCENTAGE;
  const amountAfterFee = amountInGbp - feeGbp;
  const amountOut = amountAfterFee * rate;

  res.json({
    country,
    amountInGbp,
    feeGbp: parseFloat(feeGbp.toFixed(2)),
    feePercentage: FEE_PERCENTAGE * 100,
    rate,
    amountOut: parseFloat(amountOut.toFixed(2)),
    expiresInMinutes: 10,
  });
});

app.post("/transactions", (req, res) => {
  const { country, amountInGbp, receiverName, receiverPhone } = req.body;

  if (
    (country !== "Somalia" && country !== "Ethiopia") ||
    typeof amountInGbp !== "number" ||
    amountInGbp <= 0 ||
    typeof receiverName !== "string" ||
    receiverName.trim().length === 0 ||
    typeof receiverPhone !== "string" ||
    receiverPhone.trim().length < 6
  ) {
    return res.status(400).json({
      error:
        "Invalid input. Expected { country, amountInGbp, receiverName, receiverPhone }",
    });
  }

  const id = randomUUID();
  const bankReference = `TXN-${id.slice(0, 8).toUpperCase()}`;
  const rate = RATES[country];
  const feeGbp = parseFloat((amountInGbp * FEE_PERCENTAGE).toFixed(2));
  const amountAfterFee = amountInGbp - feeGbp;
  const amountOut = parseFloat((amountAfterFee * rate).toFixed(2));

  const txn = {
    id,
    country,
    receiverName: receiverName.trim(),
    receiverPhone: receiverPhone.trim(),
    amountInGbp,
    feeGbp,
    feePercentage: FEE_PERCENTAGE * 100,
    rate,
    amountOut,
    status: "CREATED",
    bankReference,
    createdAt: new Date().toISOString(),
    proofUploadedAt: null,
    fundsInAt: null,
    paidOutAt: null,
  };

  transactions.push(txn);
  res.status(201).json(txn);
});

app.get("/transactions", (_req, res) => {
  res.json(transactions);
});

app.get("/transactions/:id", (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });

  res.json(txn);
});

app.patch("/transactions/:id/proof", (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });

  txn.status = "AWAITING_FUNDS_CHECK";
  txn.proofUploadedAt = new Date().toISOString();
  res.json(txn);
});

app.patch("/admin/transactions/:id/confirm-funds", (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });

  txn.status = "PAID_IN";
  txn.fundsInAt = new Date().toISOString();
  res.json(txn);
});

app.patch("/admin/transactions/:id/complete", (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });

  txn.status = "COMPLETED";
  txn.paidOutAt = new Date().toISOString();
  res.json(txn);
});

// Analytics endpoint
app.get("/admin/analytics", (req, res) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);

  const completed = transactions.filter((t) => t.status === "COMPLETED");

  // Calculate totals
  const totalVolume = completed.reduce((sum, t) => sum + t.amountInGbp, 0);
  const totalFees = completed.reduce((sum, t) => sum + t.feeGbp, 0);
  const totalTransactions = completed.length;

  // Today's stats
  const todayTxns = completed.filter(
    (t) => new Date(t.createdAt) >= today
  );
  const todayVolume = todayTxns.reduce((sum, t) => sum + t.amountInGbp, 0);

  // This month's stats
  const monthTxns = completed.filter(
    (t) => new Date(t.createdAt) >= thisMonth
  );
  const monthVolume = monthTxns.reduce((sum, t) => sum + t.amountInGbp, 0);

  // By country
  const byCountry = {
    Somalia: {
      count: completed.filter((t) => t.country === "Somalia").length,
      volume: completed
        .filter((t) => t.country === "Somalia")
        .reduce((sum, t) => sum + t.amountInGbp, 0),
    },
    Ethiopia: {
      count: completed.filter((t) => t.country === "Ethiopia").length,
      volume: completed
        .filter((t) => t.country === "Ethiopia")
        .reduce((sum, t) => sum + t.amountInGbp, 0),
    },
  };

  // Status breakdown
  const byStatus = {
    CREATED: transactions.filter((t) => t.status === "CREATED").length,
    AWAITING_FUNDS_CHECK: transactions.filter(
      (t) => t.status === "AWAITING_FUNDS_CHECK"
    ).length,
    PAID_IN: transactions.filter((t) => t.status === "PAID_IN").length,
    COMPLETED: transactions.filter((t) => t.status === "COMPLETED").length,
  };

  res.json({
    overview: {
      totalTransactions,
      totalVolume: parseFloat(totalVolume.toFixed(2)),
      totalFees: parseFloat(totalFees.toFixed(2)),
      averageTransaction:
        totalTransactions > 0
          ? parseFloat((totalVolume / totalTransactions).toFixed(2))
          : 0,
    },
    today: {
      transactions: todayTxns.length,
      volume: parseFloat(todayVolume.toFixed(2)),
    },
    thisMonth: {
      transactions: monthTxns.length,
      volume: parseFloat(monthVolume.toFixed(2)),
    },
    byCountry,
    byStatus,
  });
});

// Demo data generator for analytics
app.post("/admin/demo/generate", (req, res) => {
  const { count = 50 } = req.body;

  const demoNames = [
    "Ahmed Mohamed",
    "Fatima Hassan",
    "Abdi Ali",
    "Hawa Osman",
    "Omar Ibrahim",
    "Amina Yusuf",
  ];
  const demoPhones = [
    "+252612345678",
    "+252613456789",
    "+251911234567",
    "+251912345678",
  ];

  for (let i = 0; i < count; i++) {
    const country = Math.random() > 0.5 ? "Somalia" : "Ethiopia";
    const amountInGbp = parseFloat((Math.random() * 500 + 50).toFixed(2));
    const rate = RATES[country];
    const feeGbp = parseFloat((amountInGbp * FEE_PERCENTAGE).toFixed(2));
    const amountAfterFee = amountInGbp - feeGbp;
    const amountOut = parseFloat((amountAfterFee * rate).toFixed(2));

    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const statuses = [
      "CREATED",
      "AWAITING_FUNDS_CHECK",
      "PAID_IN",
      "COMPLETED",
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const id = randomUUID();
    const txn = {
      id,
      country,
      receiverName: demoNames[Math.floor(Math.random() * demoNames.length)],
      receiverPhone:
        demoPhones[Math.floor(Math.random() * demoPhones.length)],
      amountInGbp,
      feeGbp,
      feePercentage: FEE_PERCENTAGE * 100,
      rate,
      amountOut,
      status,
      bankReference: `TXN-${id.slice(0, 8).toUpperCase()}`,
      createdAt: createdAt.toISOString(),
      proofUploadedAt: status !== "CREATED" ? createdAt.toISOString() : null,
      fundsInAt:
        status === "PAID_IN" || status === "COMPLETED"
          ? createdAt.toISOString()
          : null,
      paidOutAt: status === "COMPLETED" ? createdAt.toISOString() : null,
    };

    transactions.push(txn);
  }

  res.json({ message: `Generated ${count} demo transactions`, count });
});

app.get("/admin/reports/transactions.csv", (req, res) => {
  const headers = [
    "id",
    "createdAt",
    "country",
    "receiverName",
    "receiverPhone",
    "amountInGbp",
    "feeGbp",
    "feePercentage",
    "rate",
    "amountOut",
    "status",
    "bankReference",
    "proofUploadedAt",
    "fundsInAt",
    "paidOutAt",
  ];

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const rows = transactions.map((t) =>
    headers.map((h) => escapeCsv(t[h])).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=transactions.csv"
  );
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});