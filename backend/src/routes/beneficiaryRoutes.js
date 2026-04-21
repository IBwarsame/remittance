const express = require("express");
const router = express.Router();
const BeneficiaryService = require("../services/beneficiaryService");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", (req, res) => {
    try {
        const service = new BeneficiaryService(req.app.locals.realDb);
        res.json(service.getAll(req.user.id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", (req, res) => {
    try {
        const service = new BeneficiaryService(req.app.locals.realDb);
        const b = service.create(req.user.id, req.body);
        res.status(201).json(b);
    } catch (err) {
        if (err.fields) {
            return res
                .status(400)
                .json({ error: err.message, fields: err.fields });
        }
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", (req, res) => {
    try {
        const service = new BeneficiaryService(req.app.locals.realDb);
        const ok = service.delete(req.params.id, req.user.id);
        if (!ok) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;