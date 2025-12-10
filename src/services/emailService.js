// src/services/emailService.js
const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_TLS = process.env.SMTP_TLS === 'true' || false; // optional

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn('⚠️ SMTP credentials are not fully set in environment variables. Email sending will fail until configured.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  tls: {
    // Allow self-signed certs for development; remove or set to true for production checks
    rejectUnauthorized: false,
  },
});

// Optional: verify transporter on startup (will fail if credentials are invalid)
// transporter.verify().then(() => console.log('✅ SMTP transporter verified')).catch(err => console.warn('SMTP verify failed', err));

/**
 * sendVerificationEmail(to, { code, token })
 * Requires BASE_URL env var to create token-based verification links.
 */
async function sendVerificationEmail(to, { code, token }) {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
  const verifyUrl = `${BASE_URL.replace(/\/$/, '')}/api/auth/verify/token?token=${encodeURIComponent(token)}`;

  const text = `Your verification code is ${code}\nOr click: ${verifyUrl}`;
  const html = `<p>Your verification code is <b>${code}</b></p><p>Or click: <a href="${verifyUrl}">Verify email</a></p>`;

  const mailOptions = {
    from: `"No Reply" <no-reply@${process.env.SMTP_FROM_DOMAIN || 'yourdomain.com'}>`,
    to,
    subject: 'Verify your email',
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  // nodemailer info will contain messageId and (for some transports) preview URL
  console.log(`✉️ Sent verification email to ${to}, messageId: ${info.messageId || 'n/a'}`);
  // for debug: if using Mailtrap you can view the inbox on Mailtrap's dashboard
  return info;
}

module.exports = { transporter, sendVerificationEmail };
