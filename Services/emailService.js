// src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false, // mailtrap uses non-secure + STARTTLS; change to true for 465
});

async function sendVerificationEmail(to, { code, token }) {
  const verifyUrl = `https://yourdomain.com/verify?token=${token}`; // update for prod
  const text = `Your verification code is ${code}\nOr click: ${verifyUrl}`;
  const html = `<p>Your verification code is <b>${code}</b></p><p>Or click: <a href="${verifyUrl}">Verify email</a></p>`;

  const info = await transporter.sendMail({
    from: `"No Reply" <no-reply@yourdomain.com>`,
    to,
    subject: 'Verify your email',
    text,
    html,
  });

  return info;
}

module.exports = { transporter, sendVerificationEmail };
