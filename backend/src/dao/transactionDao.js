const { randomUUID } = require("crypto");

const RATES = { Somalia: 34, Ethiopia: 48.5 };
const FEE_PERCENTAGE = 0.02;

const ALLOWED_TIMESTAMP_FIELDS = ["proofUploadedAt", "fundsInAt", "paidOutAt"];
const ALLOWED_STATUSES = [
    "CREATED",
    "AWAITING_FUNDS_CHECK",
    "PAID_IN",
    "COMPLETED",
];

class TransactionDao {
    constructor(db) {
        this.db = db;
    }

    getAll() {
        return this.db
            .prepare("SELECT * FROM transactions ORDER BY createdAt DESC")
            .all();
    }

    getById(id) {
        return this.db
            .prepare("SELECT * FROM transactions WHERE id = ?")
            .get(id);
    }

    getByUserId(userId) {
        return this.db
            .prepare(
                "SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC"
            )
            .all(userId);
    }

    uploadProof(id, proofImagePath) {
        const now = new Date().toISOString();
        this.db
            .prepare(
                `UPDATE transactions
                 SET status = ?, proofUploadedAt = ?, proofImagePath = ?
                 WHERE id = ?`
            )
            .run("AWAITING_FUNDS_CHECK", now, proofImagePath, id);
        return this.getById(id);
    }
    

    create(data) {
        console.log("DAO userId:", data.userId);
        const {
            country,
            amountInGbp,
            receiverName,
            receiverPhone,
            userId = null,
        } = data;

        const id = randomUUID();
        const rate = RATES[country];
        const feeGbp = parseFloat((amountInGbp * FEE_PERCENTAGE).toFixed(2));
        const amountOut = parseFloat(
            ((amountInGbp - feeGbp) * rate).toFixed(2)
        );

        const txn = {
            id,
            userId,
            country,
            receiverName: receiverName.trim(),
            receiverPhone: receiverPhone.trim(),
            amountInGbp,
            feeGbp,
            feePercentage: FEE_PERCENTAGE * 100,
            rate,
            amountOut,
            status: "CREATED",
            bankReference: `TXN-${id.slice(0, 8).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            proofUploadedAt: null,
            fundsInAt: null,
            paidOutAt: null,
            proofImagePath: null,
        };

        this.db
            .prepare(
                `INSERT INTO transactions VALUES (
                    @id, @userId, @country, @receiverName, @receiverPhone,
                    @amountInGbp, @feeGbp, @feePercentage, @rate, @amountOut,
                    @status, @bankReference, @createdAt, @proofUploadedAt,
                    @fundsInAt, @paidOutAt, @proofImagePath
                )`
            )
            .run(txn);

        return txn;
    }

    updateStatus(id, status, timestampField) {
        if (!ALLOWED_TIMESTAMP_FIELDS.includes(timestampField)) {
            throw new Error(`Invalid timestamp field: ${timestampField}`);
        }
        if (!ALLOWED_STATUSES.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        const now = new Date().toISOString();
        this.db
            .prepare(
                `UPDATE transactions SET status = ?, ${timestampField} = ? WHERE id = ?`
            )
            .run(status, now, id);
        return this.getById(id);
    }

    insertMany(items) {
        this.db.prepare("DELETE FROM transactions").run();
        const insert = this.db.prepare(
            `INSERT INTO transactions VALUES (
                @id, @userId, @country, @receiverName, @receiverPhone,
                @amountInGbp, @feeGbp, @feePercentage, @rate, @amountOut,
                @status, @bankReference, @createdAt, @proofUploadedAt,
                @fundsInAt, @paidOutAt
            )`
        );
        const insertAll = this.db.transaction((rows) => {
            for (const row of rows) insert.run(row);
        });
        insertAll(items);
    }

    getChartData() {
        return this.db
            .prepare(
                `SELECT
                    DATE(createdAt) as date,
                    SUM(amountInGbp) as volume,
                    COUNT(*) as count
                FROM transactions
                WHERE status = 'COMPLETED'
                    AND createdAt >= DATE('now', '-30 days')
                GROUP BY DATE(createdAt)
                ORDER BY date ASC`
            )
            .all();
    }

    getAnalyticsOverview() {
        return this.db
            .prepare(
                `SELECT
                    COUNT(*) as totalTransactions,
                    ROUND(SUM(amountInGbp), 2) as totalVolume,
                    ROUND(SUM(feeGbp), 2) as totalFees,
                    ROUND(AVG(amountInGbp), 2) as averageTransaction
                FROM transactions WHERE status = 'COMPLETED'`
            )
            .get();
    }

    getStatsSince(isoDate) {
        return this.db
            .prepare(
                `SELECT
                    COUNT(*) as transactions,
                    ROUND(SUM(amountInGbp), 2) as volume
                FROM transactions
                WHERE status = 'COMPLETED' AND createdAt >= ?`
            )
            .get(isoDate);
    }

    getCountryStats(country) {
        return this.db
            .prepare(
                `SELECT
                    COUNT(*) as count,
                    ROUND(SUM(amountInGbp), 2) as volume
                FROM transactions
                WHERE status = 'COMPLETED' AND country = ?`
            )
            .get(country);
    }

    getStatusCounts() {
        return this.db
            .prepare(
                "SELECT status, COUNT(*) as count FROM transactions GROUP BY status"
            )
            .all();
    }

    getAllForCsv() {
        return this.db
            .prepare("SELECT * FROM transactions ORDER BY createdAt DESC")
            .all();
    }
}

module.exports = TransactionDao;