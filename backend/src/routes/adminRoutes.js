const express = require("express");
const router = express.Router();
const AdminService = require("../services/adminService");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

router.use(authMiddleware);
router.use(requireRole("admin", "developer"));

const getDb = (req) =>
    req.query.demoMode === "true"
        ? req.app.locals.demoDb
        : req.app.locals.realDb;

router.get("/analytics", async (req, res) => {
    try {
        const service = new AdminService(getDb(req));
        res.json(await service.getAnalytics());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/analytics/chart-data", async (req, res) => {
    try {
        const service = new AdminService(getDb(req));
        res.json(await service.getChartData());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch(
    "/transactions/:id/confirm-funds",
    requireRole("admin"),
    async (req, res) => {
        try {
            const { realDb, demoDb } = req.app.locals;
            const service = new AdminService(realDb, demoDb);
            const txn = await service.confirmFunds(req.params.id);
            if (!txn) return res.status(404).json({ error: "Not found" });
            res.json(txn);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.patch(
    "/transactions/:id/complete",
    requireRole("admin"),
    async (req, res) => {
        try {
            const { realDb, demoDb } = req.app.locals;
            const service = new AdminService(realDb, demoDb);
            const txn = await service.complete(req.params.id);
            if (!txn) return res.status(404).json({ error: "Not found" });
            res.json(txn);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.post(
    "/demo/generate",
    requireRole("developer"),
    async (req, res) => {
        try {
            const service = new AdminService(req.app.locals.demoDb);
            const result = await service.generateDemo(req.body.count || 50);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get("/reports/transactions.csv", async (req, res) => {
    try {
        const service = new AdminService(getDb(req));
        const csv = await service.generateCsv();
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=transactions.csv"
        );
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;