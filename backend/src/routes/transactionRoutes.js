// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const TransactionService = require("../services/transactionService");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

router.use(authMiddleware);

router.get("/", requireRole("admin", "developer"), async (req, res) => {
    try {
        const db =
            req.query.demoMode === "true"
                ? req.app.locals.demoDb
                : req.app.locals.realDb;
        const service = new TransactionService(db);
        res.json(await service.getAll());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/mine", async (req, res) => {
    try {
        const service = new TransactionService(req.app.locals.realDb);
        res.json(service.getByUserId(String(req.user.id)));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get(
    "/:id/proof",
    requireRole("admin", "developer"),
    async (req, res) => {
        try {
            const service = new TransactionService(req.app.locals.realDb);
            const txn = service.getById(req.params.id);
            if (!txn)
                return res
                    .status(404)
                    .json({ error: "Transaction not found" });
            if (!txn.proofImagePath)
                return res
                    .status(404)
                    .json({ error: "No proof uploaded yet" });

            const absPath = path.resolve(txn.proofImagePath);
            if (!fs.existsSync(absPath))
                return res
                    .status(404)
                    .json({ error: "Proof file missing from disk" });

            res.sendFile(absPath);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get("/:id/receipt", async (req, res) => {
    try {
        const service = new TransactionService(
            req.app.locals.realDb,
            req.app.locals.demoDb
        );
        const result = service.getReceipt(
            req.params.id,
            String(req.user.id),
            req.user.role
        );
        if (!result)
            return res
                .status(404)
                .json({ error: "Transaction not found" });
        if (result === "forbidden")
            return res.status(403).json({ error: "Forbidden" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { realDb, demoDb } = req.app.locals;
        const service = new TransactionService(realDb, demoDb);
        const txn = service.getById(req.params.id);
        if (!txn)
            return res
                .status(404)
                .json({ error: "Transaction not found" });
        if (req.user.role === "user" && txn.userId !== String(req.user.id))
            return res.status(403).json({ error: "Forbidden" });
        res.json(txn);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", requireRole("user"), async (req, res) => {
    try {
        const service = new TransactionService(req.app.locals.realDb);
        const txn = service.create(req.body, String(req.user.id));
        res.status(201).json(txn);
    } catch (err) {
        if (err.fields)
            return res
                .status(400)
                .json({ error: err.message, fields: err.fields });
        res.status(400).json({ error: err.message });
    }
});

router.patch("/:id/proof", (req, res) => {
    upload.single("proof")(req, res, async (err) => {
        // Multer errors (file size, wrong type) land here
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ error: "No file uploaded" });
            }

            const service = new TransactionService(req.app.locals.realDb);
            const result = service.uploadProof(
                req.params.id,
                String(req.user.id),
                req.user.role,
                req.file.path
            );

            if (!result)
                return res
                    .status(404)
                    .json({ error: "Transaction not found" });
            if (result === "forbidden")
                return res.status(403).json({ error: "Forbidden" });

            res.json(result);
        } catch (innerErr) {
            res.status(500).json({ error: innerErr.message });
        }
    });
});

module.exports = router;