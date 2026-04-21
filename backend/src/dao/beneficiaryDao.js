const { randomUUID } = require("crypto");

class BeneficiaryDao {
    constructor(db) {
        this.db = db;
    }

    getByUserId(userId) {
        return this.db
            .prepare(
                "SELECT * FROM beneficiaries WHERE userId = ? ORDER BY fullName ASC"
            )
            .all(userId);
    }

    getById(id) {
        return this.db
            .prepare("SELECT * FROM beneficiaries WHERE id = ?")
            .get(id);
    }

    create(data) {
        const { userId, fullName, phone, country } = data;
        const id = randomUUID();
        const createdAt = new Date().toISOString();

        const beneficiary = { id, userId, fullName, phone, country, createdAt };

        this.db
            .prepare(
                `INSERT INTO beneficiaries (id, userId, fullName, phone, country, createdAt)
                VALUES (@id, @userId, @fullName, @phone, @country, @createdAt)`
            )
            .run(beneficiary);

        return beneficiary;
    }

    delete(id, userId) {
        // userId scoping ensures users can only delete their own
        this.db
            .prepare("DELETE FROM beneficiaries WHERE id = ? AND userId = ?")
            .run(id, userId);
    }
}

module.exports = BeneficiaryDao;