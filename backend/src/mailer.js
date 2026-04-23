// mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

function getTransport(email) {
  const isTestEmail =
    email.endsWith("@remit.local") || email.endsWith("@remit.com");

  if (isTestEmail) {
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT ?? 2525),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY,
    },
  });
}

async function sendMail({ to, subject, html }) {
  const transport = getTransport(to);
  const isTestEmail =
    to.endsWith("@remit.local") || to.endsWith("@remit.com");

  console.log(
    `[mailer] sending to ${to} via ${isTestEmail ? "Mailtrap" : "Resend"}`
  );

  try {
    const info = await transport.sendMail({
      from: `"Remit" <${isTestEmail ? (process.env.MAIL_FROM ?? "noreply@remit.com") : "onboarding@resend.dev"}>`,
      to,
      subject,
      html,
    });
    console.log(`[mailer] success:`, info.messageId);
  } catch (err) {
    console.error(`[mailer] FAILED:`, err.message);
    throw err;
  }
}

const sendVerificationEmail = async (email, fullName, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendMail({
    to: email,
    subject: "Verify your Remit account",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#15803d;">Welcome to Remit, ${fullName}!</h2>
        <p>Thanks for registering. Please verify your email address to get started.</p>
        <a href="${verifyUrl}" style="display:inline-block;background-color:#15803d;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#666;font-size:14px;">If you didn't create an account, you can ignore this email.</p>
        <p style="color:#666;font-size:14px;">Or copy this link:<br/>
          <span style="color:#15803d;">${verifyUrl}</span>
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
        <h2 style="color:#15803d;">Password Reset Request</h2>
        <p>Hi ${fullName}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;background-color:#15803d;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#666;font-size:14px;">This link expires in <strong>1 hour</strong>.</p>
        <p style="color:#666;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#666;font-size:14px;">Or copy this link:<br/>
          <span style="color:#15803d;">${resetUrl}</span>
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };