// config/db.js
const Database = require("better-sqlite3");
const path = require("path");

const setupDb = (filename) => {
    const db = new Database(path.join(__dirname, "../", filename));
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            fullName TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            passwordHash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            isVerified INTEGER DEFAULT 0,
            verificationToken TEXT,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            userId TEXT,
            country TEXT NOT NULL,
            receiverName TEXT NOT NULL,
            receiverPhone TEXT NOT NULL,
            amountInGbp REAL NOT NULL,
            feeGbp REAL NOT NULL,
            feePercentage REAL NOT NULL,
            rate REAL NOT NULL,
            amountOut REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'CREATED',
            bankReference TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            proofUploadedAt TEXT,
            fundsInAt TEXT,
            paidOutAt TEXT,
            proofImagePath TEXT,
            FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS beneficiaries (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            fullName TEXT NOT NULL,
            phone TEXT NOT NULL,
            country TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS bank_details (
            id INTEGER PRIMARY KEY DEFAULT 1,
            bankName TEXT NOT NULL DEFAULT '',
            accountName TEXT NOT NULL DEFAULT '',
            accountNumber TEXT NOT NULL DEFAULT '',
            sortCode TEXT NOT NULL DEFAULT '',
            reference TEXT NOT NULL DEFAULT '',
            updatedAt TEXT NOT NULL DEFAULT ''
        );
    `);

    // Migrations
    const userCols = db
        .prepare("PRAGMA table_info(users)")
        .all()
        .map((c) => c.name);
    if (!userCols.includes("role")) {
        db.exec(
            "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'"
        );
    }
    if (!userCols.includes("passwordResetToken")) {
        db.exec("ALTER TABLE users ADD COLUMN passwordResetToken TEXT");
    }
    if (!userCols.includes("passwordResetExpiresAt")) {
        db.exec("ALTER TABLE users ADD COLUMN passwordResetExpiresAt TEXT");
    }

    const txnCols = db
        .prepare("PRAGMA table_info(transactions)")
        .all()
        .map((c) => c.name);
    if (!txnCols.includes("userId")) {
        db.exec("ALTER TABLE transactions ADD COLUMN userId TEXT");
    }
    if (!txnCols.includes("proofImagePath")) {
        db.exec(
            "ALTER TABLE transactions ADD COLUMN proofImagePath TEXT"
        );
    }

    // Seed a single bank_details row if none exists
    const existing = db
        .prepare("SELECT id FROM bank_details WHERE id = 1")
        .get();
    if (!existing) {
        db.prepare(
            `INSERT INTO bank_details
                (id, bankName, accountName, accountNumber, sortCode, reference, updatedAt)
             VALUES (1, '', '', '', '', 'Your TXN reference', ?)`
        ).run(new Date().toISOString());
    }

    return db;
};

module.exports = {
    realDb: setupDb("remittance.db"),
    demoDb: setupDb("demo.db"),
};