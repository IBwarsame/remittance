// routes/bankDetailsRoutes.js
const express = require("express");
const router = express.Router();
const BankDetailsService = require("../services/bankDetailsService");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

// Public — users need to see this after creating a transfer
router.get("/", authMiddleware, (req, res) => {
    try {
        const service = new BankDetailsService(req.app.locals.realDb);
        res.json(service.get() || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin only — update
router.put(
    "/",
    authMiddleware,
    requireRole("admin"),
    (req, res) => {
        try {
            const service = new BankDetailsService(req.app.locals.realDb);
            res.json(service.update(req.body));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

module.exports = router;