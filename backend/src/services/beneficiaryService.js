const BeneficiaryDao = require("../dao/beneficiaryDao");

class BeneficiaryService {
    constructor(db) {
        this.dao = new BeneficiaryDao(db);
    }

    getAll(userId) {
        return this.dao.getByUserId(userId);
    }

    create(userId, data) {
        const { fullName, phone, country } = data;
        const errors = {};

        if (!fullName?.trim()) errors.fullName = "Full name is required";
        if (!phone?.trim() || phone.trim().length < 6)
            errors.phone = "Valid phone number is required";
        if (country !== "Somalia" && country !== "Ethiopia")
            errors.country = "Country must be Somalia or Ethiopia";

        if (Object.keys(errors).length > 0) {
            const err = new Error("Validation failed");
            err.fields = errors;
            throw err;
        }

        return this.dao.create({ userId, fullName: fullName.trim(), phone: phone.trim(), country });
    }

    delete(id, userId) {
        const existing = this.dao.getById(id);
        if (!existing || existing.userId !== userId) return false;
        this.dao.delete(id, userId);
        return true;
    }
}

module.exports = BeneficiaryService;