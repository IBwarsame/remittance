const TransactionDao = require("../dao/transactionDao");
const { randomUUID } = require("crypto");

const RATES = { Somalia: 34, Ethiopia: 48.5 };
const FEE_PERCENTAGE = 0.02;

const DEMO_NAMES = [
    "Ahmed Mohamed", "Fatima Hassan", "Abdi Ali",
    "Hawa Osman", "Omar Ibrahim", "Amina Yusuf",
];
const DEMO_PHONES = [
    "+252612345678", "+252613456789",
    "+251911234567", "+251912345678",
];
const STATUSES = ["CREATED", "AWAITING_FUNDS_CHECK", "PAID_IN", "COMPLETED"];

class AdminService {
    constructor(primaryDb, fallbackDb = null) {
        this.dao = new TransactionDao(primaryDb);
        this.fallbackDao = fallbackDb ? new TransactionDao(fallbackDb) : null;
    }

    _findDao(id) {
        if (this.dao.getById(id)) return this.dao;
        if (this.fallbackDao?.getById(id)) return this.fallbackDao;
        return null;
    }

    confirmFunds(id) {
        const dao = this._findDao(id);
        if (!dao) return null;
        return dao.updateStatus(id, "PAID_IN", "fundsInAt");
    }

    complete(id) {
        const dao = this._findDao(id);
        if (!dao) return null;
        return dao.updateStatus(id, "COMPLETED", "paidOutAt");
    }

    getAnalytics() {
        const now = new Date();
        const today = new Date(
            now.getFullYear(), now.getMonth(), now.getDate()
        ).toISOString();
        const thisMonth = new Date(
            now.getFullYear(), now.getMonth(), 1
        ).toISOString();

        const overview = this.dao.getAnalyticsOverview();
        const todayStats = this.dao.getStatsSince(today);
        const monthStats = this.dao.getStatsSince(thisMonth);

        const byCountry = {};
        for (const country of ["Somalia", "Ethiopia"]) {
            byCountry[country] = this.dao.getCountryStats(country);
        }

        const byStatus = {
            CREATED: 0, AWAITING_FUNDS_CHECK: 0, PAID_IN: 0, COMPLETED: 0,
        };
        for (const row of this.dao.getStatusCounts()) {
            byStatus[row.status] = row.count;
        }

        return {
            overview: {
                totalTransactions: overview.totalTransactions || 0,
                totalVolume: overview.totalVolume || 0,
                totalFees: overview.totalFees || 0,
                averageTransaction: overview.averageTransaction || 0,
            },
            today: {
                transactions: todayStats.transactions || 0,
                volume: todayStats.volume || 0,
            },
            thisMonth: {
                transactions: monthStats.transactions || 0,
                volume: monthStats.volume || 0,
            },
            byCountry,
            byStatus,
        };
    }

    getChartData() {
        return this.dao.getChartData();
    }

    generateDemo(count = 50) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const country = Math.random() > 0.5 ? "Somalia" : "Ethiopia";
            const amountInGbp = parseFloat((Math.random() * 500 + 50).toFixed(2));
            const rate = RATES[country];
            const feeGbp = parseFloat((amountInGbp * FEE_PERCENTAGE).toFixed(2));
            const amountOut = parseFloat(
                ((amountInGbp - feeGbp) * rate).toFixed(2)
            );
            const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            const createdAt = new Date();
            createdAt.setDate(
                createdAt.getDate() - Math.floor(Math.random() * 30)
            );
            const id = randomUUID();

            items.push({
                id,
                userId: null,
                country,
                receiverName: DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)],
                receiverPhone: DEMO_PHONES[Math.floor(Math.random() * DEMO_PHONES.length)],
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
                proofImagePath: null,
            });
        }

        this.dao.insertMany(items);
        return { message: `Generated ${count} demo transactions`, count };
    }

    generateCsv() {
        const headers = [
            "id", "createdAt", "country", "receiverName", "receiverPhone",
            "amountInGbp", "feeGbp", "feePercentage", "rate", "amountOut",
            "status", "bankReference", "proofUploadedAt", "fundsInAt", "paidOutAt",
        ];

        const escapeCsv = (value) => {
            if (value === null || value === undefined) return "";
            const str = String(value);
            if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
            return str;
        };

        const rows = this.dao
            .getAllForCsv()
            .map((t) => headers.map((h) => escapeCsv(t[h])).join(","));

        return [headers.join(","), ...rows].join("\n");
    }
}

module.exports = AdminService;