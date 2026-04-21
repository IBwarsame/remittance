const express = require("express");
const router = express.Router();
const QuoteService = require("../services/quoteService");

router.post("/", (req, res) => {
    try {
        const service = new QuoteService();
        res.json(service.calculate(req.body));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;