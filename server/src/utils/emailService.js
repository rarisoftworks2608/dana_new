const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT) || 465;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465, // true for SSL/TLS (465), false for STARTTLS (587)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Fail fast and loudly instead of hanging on Nodemailer's 2-minute
    // default if the host is unreachable (e.g. a network/port block) -
    // an event registration shouldn't leave a silent pending connection.
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  return transporter;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function buildTextBody(registration) {
  return (
    `Hi ${registration.full_name},\n\n` +
    `Thank you for registering as ${registration.registration_type} for Dana Supplier Technology Day 2026.\n\n` +
    `Your registration code: ${registration.registration_id}\n` +
    `Your unique entry QR code is attached — please bring it (printed or on your phone) to the venue for quick check-in.\n\n` +
    `Event Date: 28 July 2026, 09:00 AM IST\n` +
    `Venue: Chakan Office Premises\n\n` +
    `See you there!\nDana Anaand India Private Limited`
  );
}

function buildHtmlBody(registration) {
  const name = escapeHtml(registration.full_name);
  const regId = escapeHtml(registration.registration_id);
  const type = escapeHtml(registration.registration_type);
  const company = escapeHtml(registration.company);

  return `
<div style="background:#F8FAFC;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
    <div style="background:linear-gradient(135deg,#003B8E 0%,#00296B 100%);padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#FFCB3D;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Registration Confirmed</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">Dana Supplier Technology Day 2026</h1>
    </div>

    <div style="padding:32px;">
      <p style="font-size:16px;color:#0F172A;margin-top:0;">Hi ${name},</p>
      <p style="font-size:15px;color:#334155;line-height:1.6;">
        Thank you for registering as <strong>${type}</strong> for Dana Supplier Technology Day 2026.
        We're excited to have you join us!
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;margin:24px 0;">
        <tr>
          <td style="padding:16px 20px;font-size:14px;color:#64748B;">Registration ID</td>
          <td style="padding:16px 20px;font-size:14px;color:#0F172A;font-weight:bold;text-align:right;">${regId}</td>
        </tr>
        <tr>
          <td style="padding:0 20px 16px;font-size:14px;color:#64748B;">Registering As</td>
          <td style="padding:0 20px 16px;font-size:14px;color:#0F172A;font-weight:bold;text-align:right;">${type}</td>
        </tr>
        ${company ? `<tr>
          <td style="padding:0 20px 16px;font-size:14px;color:#64748B;">Company</td>
          <td style="padding:0 20px 16px;font-size:14px;color:#0F172A;font-weight:bold;text-align:right;">${company}</td>
        </tr>` : ""}
      </table>

      <div style="text-align:center;margin:24px 0;">
        <img src="cid:qrcode" alt="Your entry QR code" width="220" height="220" style="border:6px solid #F8FAFC;border-radius:12px;" />
        <p style="font-size:13px;color:#64748B;margin:10px 0 0;">
          Show this QR code (printed or on your phone) at the venue for quick check-in.
        </p>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E2E8F0;padding-top:20px;margin-top:8px;">
        <tr>
          <td style="font-size:14px;color:#64748B;padding-bottom:6px;">📅 Event Date</td>
          <td style="font-size:14px;color:#0F172A;text-align:right;padding-bottom:6px;">28 July 2026, 09:00 AM IST</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#64748B;">📍 Venue</td>
          <td style="font-size:14px;color:#0F172A;text-align:right;">Chakan Office Premises</td>
        </tr>
      </table>

      <p style="font-size:15px;color:#334155;line-height:1.6;margin-top:28px;">
        See you there!<br />
        <strong>Dana Anaand India Private Limited</strong>
      </p>
    </div>

    <div style="background:#F8FAFC;padding:16px 32px;text-align:center;">
      <p style="font-size:12px;color:#94A3B8;margin:0;">This is an automated confirmation — please don't reply to this email.</p>
    </div>
  </div>
</div>`;
}

/**
 * Sends the registration confirmation email — a thank-you message with the
 * registrant's details and their entry QR code embedded inline (plus
 * attached, for offline/print use) — via Hostinger SMTP (Nodemailer).
 * Sandboxed (logged only) until SMTP_USER/SMTP_PASS are set in .env, so
 * registration keeps working during development.
 */
async function sendConfirmationEmail(registration, qrAbsolutePath) {
  const sandbox = !process.env.SMTP_USER || !process.env.SMTP_PASS;

  if (sandbox) {
    console.log(
      `[EMAIL SANDBOX] Would email ${registration.email} | name=${registration.full_name} | code=${registration.registration_id}`
    );
    return { ok: true, status: "sandboxed" };
  }

  const fromName = process.env.EMAIL_FROM_NAME || "Dana Supplier Technology Day 2026";

  try {
    await getTransporter().sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: registration.email,
      subject: "You're registered! Your event entry QR code inside",
      text: buildTextBody(registration),
      html: buildHtmlBody(registration),
      attachments: [
        {
          filename: `entry_qr_${registration.registration_id}.png`,
          path: qrAbsolutePath,
          cid: "qrcode",
        },
      ],
    });

    return { ok: true, status: "sent" };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { ok: false, status: "failed", error: err.message };
  }
}

module.exports = { sendConfirmationEmail };
