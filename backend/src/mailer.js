// mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const INTERNAL_DOMAINS = ["remit.com", "remit.local"];

function isInternalAddress(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return INTERNAL_DOMAINS.includes(domain);
}

function createSandboxTransport() {
  const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } =
    process.env;
  if (!MAILTRAP_HOST || !MAILTRAP_USER || !MAILTRAP_PASS) {
    throw new Error(
      "Mailtrap env vars missing: MAILTRAP_HOST, MAILTRAP_USER, MAILTRAP_PASS"
    );
  }
  return nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: Number(MAILTRAP_PORT ?? 2525),
    auth: { user: MAILTRAP_USER, pass: MAILTRAP_PASS },
  });
}

function createProductionTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Production SMTP env vars missing: SMTP_HOST, SMTP_USER, SMTP_PASS"
    );
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
}

function getTransport(email) {
  const internal = isInternalAddress(email);
  console.log(
    `[mailer] ${email} → ${internal ? "sandbox (Mailtrap)" : "production"}`
  );
  return internal ? createSandboxTransport() : createProductionTransport();
}

async function sendMail({ to, subject, html }) {
  const transport = getTransport(to);
  await transport.sendMail({
    from: `"Remit" <${process.env.MAIL_FROM ?? "noreply@remit.com"}>`,
    to,
    subject,
    html,
  });
}

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