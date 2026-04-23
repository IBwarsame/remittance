// services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const UserDao = require("../dao/userDao");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../mailer");
const {
  assertStrongPassword,
} = require("../middleware/passwordPolicy");

const JWT_SECRET =
  process.env.JWT_SECRET || "change_this_secret_in_production";
const JWT_EXPIRES_IN = "15m";
const BCRYPT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

class AuthService {
  constructor(db) {
    this.dao = new UserDao(db);
  }

  async register({ fullName, email, phone, password }) {
    const errors = {};
    if (!fullName?.trim()) errors.fullName = "Full name is required";
    if (!email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email address";
    if (!phone?.trim()) errors.phone = "Phone number is required";
    if (!password) {
      errors.password = "Password is required";
    } else {
      try {
        assertStrongPassword(password);
      } catch (e) {
        errors.password = e.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation failed");
      err.fields = errors;
      throw err;
    }

    const existing = await this.dao.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    const id = randomUUID();
    const verificationToken = randomUUID();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await this.dao.create({
      id,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash,
      role: "user",
      verificationToken,
      createdAt: new Date().toISOString(),
    });

    try {
      await sendVerificationEmail(
        email.toLowerCase().trim(),
        fullName.trim(),
        verificationToken
      );
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return {
      message: "Registration successful. Please check your email.",
      email: email.toLowerCase().trim(),
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await this.dao.findByEmail(email);
    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new Error(
        "Please verify your email before logging in"
      );
    }

    const token = signToken(user);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async verify(token) {
    const user = await this.dao.findByToken(token);
    if (!user)
      throw new Error("Invalid or expired verification link");
    await this.dao.verify(user.id);
    return {
      message: "Email verified successfully",
      email: user.email,
    };
  }

  async forgotPassword({ email }) {
    const user = await this.dao.findByEmail(email);
    if (!user)
      return {
        message:
          "If that email exists, a reset link has been sent.",
      };

    const token = randomUUID();
    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    await this.dao.setPasswordResetToken(
      user.id,
      token,
      expiresAt
    );

    try {
      await sendPasswordResetEmail(
        user.email,
        user.fullName,
        token
      );
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }

    return {
      message: "If that email exists, a reset link has been sent.",
    };
  }

  async resetPassword({ token, password }) {
    if (!token) throw new Error("Reset token is required");

    assertStrongPassword(password);

    const user = await this.dao.findByPasswordResetToken(token);
    if (!user) throw new Error("Invalid or expired reset link");

    const expired =
      new Date(user.passwordResetExpiresAt) < new Date();
    if (expired) throw new Error("Invalid or expired reset link");

    const passwordHash = await bcrypt.hash(
      password,
      BCRYPT_ROUNDS
    );
    await this.dao.updatePassword(user.id, passwordHash);
    await this.dao.clearPasswordResetToken(user.id);

    return {
      message: "Password reset successful. You can now log in.",
    };
  }
}

module.exports = AuthService;