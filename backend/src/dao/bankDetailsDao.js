// dao/bankDetailsDao.js
class BankDetailsDao {
    constructor(db) {
        this.db = db;
    }

    get() {
        return (
            this.db
                .prepare("SELECT * FROM bank_details WHERE id = 1")
                .get() || null
        );
    }

    upsert({ bankName, accountName, accountNumber, sortCode, reference }) {
        const now = new Date().toISOString();
        this.db
            .prepare(
                `INSERT INTO bank_details
                    (id, bankName, accountName, accountNumber, sortCode, reference, updatedAt)
                 VALUES (1, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET
                    bankName = excluded.bankName,
                    accountName = excluded.accountName,
                    accountNumber = excluded.accountNumber,
                    sortCode = excluded.sortCode,
                    reference = excluded.reference,
                    updatedAt = excluded.updatedAt`
            )
            .run(bankName, accountName, accountNumber, sortCode, reference, now);
        return this.get();
    }
}

module.exports = BankDetailsDao;