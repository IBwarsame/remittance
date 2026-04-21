const TransactionDao = require("../dao/transactionDao");

class TransactionService {
    constructor(primaryDb, fallbackDb = null) {
        this.dao = new TransactionDao(primaryDb);
        this.fallbackDao = fallbackDb
            ? new TransactionDao(fallbackDb)
            : null;
    }

    getAll() {
        return this.dao.getAll();
    }

    getByUserId(userId) {
        return this.dao.getByUserId(userId);
    }

    getById(id) {
        let txn = this.dao.getById(id);
        if (!txn && this.fallbackDao) {
            txn = this.fallbackDao.getById(id);
        }
        return txn || null;
    }

    create(body, userId = null) {
        const { country, amountInGbp, receiverName, receiverPhone } = body;
        const errors = {};

        if (country !== "Somalia" && country !== "Ethiopia") {
            errors.country = "Country must be Somalia or Ethiopia";
        }
        if (typeof amountInGbp !== "number" || amountInGbp < 10) {
            errors.amountInGbp = "Amount must be at least £10";
        }
        if (!receiverName?.trim()) {
            errors.receiverName = "Receiver name is required";
        }
        if (!receiverPhone?.trim() || receiverPhone.trim().length < 6) {
            errors.receiverPhone = "Valid receiver phone is required";
        }

        if (Object.keys(errors).length > 0) {
            const err = new Error("Validation failed");
            err.fields = errors;
            throw err;
        }

        return this.dao.create({
            country,
            amountInGbp,
            receiverName,
            receiverPhone,
            userId,
        });    }

    uploadProof(id, userId, role, proofImagePath) {
        const txn = this.dao.getById(id);
        if (!txn) return null;
        if (role === "user" && txn.userId !== userId) return "forbidden";
        return this.dao.uploadProof(id, proofImagePath);
    }

    getReceipt(id, userId, role) {
        const txn = this.dao.getById(id);
        if (!txn && this.fallbackDao) {
            const demoTxn = this.fallbackDao.getById(id);
            if (!demoTxn) return null;
            return this._buildReceipt(demoTxn, userId, role);
        }
        if (!txn) return null;
        return this._buildReceipt(txn, userId, role);
    }

    _buildReceipt(txn, userId, role) {
        if (role === "user" && txn.userId !== userId) return "forbidden";
        return {
            reference: txn.bankReference,
            status: txn.status,
            createdAt: txn.createdAt,
            paidOutAt: txn.paidOutAt,
            recipient: {
                name: txn.receiverName,
                phone: txn.receiverPhone,
                country: txn.country,
            },
            amount: {
                sent: txn.amountInGbp,
                fee: txn.feeGbp,
                feePercentage: txn.feePercentage,
                rate: txn.rate,
                received: txn.amountOut,
                currency: txn.country === "Somalia" ? "SOS" : "ETB",
            },
        };
    }
}

module.exports = TransactionService;