// mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

function getTransport() {
    // TODO: swap to Resend once custom domain is verified
    // return nodemailer.createTransport({
    //     host: "smtp.resend.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: "resend",
    //         pass: process.env.RESEND_API_KEY,
    //     },
    // });

    return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT ?? 2525),
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });
}

async function sendMail({ to, subject, html }) {
    const transport = getTransport();
    console.log(`[mailer] sending to ${to}`);
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