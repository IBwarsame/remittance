// services/bankDetailsService.js
const BankDetailsDao = require("../dao/bankDetailsDao");

class BankDetailsService {
    constructor(db) {
        this.dao = new BankDetailsDao(db);
    }

    get() {
        return this.dao.get();
    }

    update(data) {
        const { bankName, accountName, accountNumber, sortCode, reference } =
            data;
        if (!bankName?.trim()) throw new Error("Bank name is required");
        if (!accountName?.trim()) throw new Error("Account name is required");
        if (!accountNumber?.trim())
            throw new Error("Account number is required");
        if (!sortCode?.trim()) throw new Error("Sort code is required");
        return this.dao.upsert({
            bankName: bankName.trim(),
            accountName: accountName.trim(),
            accountNumber: accountNumber.trim(),
            sortCode: sortCode.trim(),
            reference: (reference || "").trim(),
        });
    }
}

module.exports = BankDetailsService;