require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { realDb, demoDb } = require("./config/db");


const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const bankDetailsRoutes = require("./routes/bankDetailsRoutes");

const uploadsDir = path.join(__dirname, "uploads/proofs");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

app.locals.realDb = realDb;
app.locals.demoDb = demoDb;

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/transactions", transactionRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/quote", quoteRoutes);
app.use("/beneficiaries", beneficiaryRoutes);
app.use("/bank-details", bankDetailsRoutes);

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
    ],
    credentials: true,
}));