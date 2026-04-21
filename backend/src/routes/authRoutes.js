const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const service = new AuthService(req.app.locals.realDb);
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.fields) {
      return res
        .status(400)
        .json({ error: err.message, fields: err.fields });
    }
    const status =
      err.message === "Email already registered" ? 409 : 400;
    res.status(status).json({ error: err.message });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const service = new AuthService(req.app.locals.realDb);
    const result = await service.login(req.body);
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Invalid email or password"
        ? 401
        : err.message.startsWith("Please verify")
          ? 403
          : 400;
    res.status(status).json({ error: err.message });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const service = new AuthService(req.app.locals.realDb);
    res.json(await service.verify(req.params.token));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const service = new AuthService(req.app.locals.realDb);
    res.json(await service.forgotPassword(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/reset-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const service = new AuthService(req.app.locals.realDb);
    res.json(await service.resetPassword(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;