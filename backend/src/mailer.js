// mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

function getTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw new Error(
            "SMTP env vars missing: SMTP_HOST, SMTP_USER, SMTP_PASS"
        );
    }
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT ?? 465),
        secure: true,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
}

async function sendMail({ to, subject, html }) {
    const transport = getTransport();
    console.log(`[mailer] sending to ${to}`);
    await transport.sendMail({
        from: `"Remit" <${process.env.MAIL_FROM ?? "onboarding@resend.dev"}>`,
        to,
        subject,
        html,
    });
}

// sendVerificationEmail and sendPasswordResetEmail stay exactly the same
const sendVerificationEmail = async (email, fullName, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await sendMail({
        to: email,
        subject: "Verify your Remit account",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#2563eb;">Welcome to Remit, ${fullName}!</h2>
        <p>Thanks for registering. Please verify your email address to get started.</p>
        <a href="${verifyUrl}" style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#666;font-size:14px;">If you didn't create an account, you can ignore this email.</p>
        <p style="color:#666;font-size:14px;">Or copy this link:<br/>
          <span style="color:#2563eb;">${verifyUrl}</span>
        </p>
      </div>
    `,
    });
};

const sendPasswordResetEmail = async (email, fullName, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendMail({
        to: email,
        subject: "Reset your Remit password",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#2563eb;">Password Reset Request</h2>
        <p>Hi ${fullName}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#666;font-size:14px;">This link expires in <strong>1 hour</strong>.</p>
        <p style="color:#666;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#666;font-size:14px;">Or copy this link:<br/>
          <span style="color:#2563eb;">${resetUrl}</span>
        </p>
      </div>
    `,
    });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };