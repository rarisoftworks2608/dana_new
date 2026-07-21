const QRCode = require("qrcode");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const QR_DIR = path.join(__dirname, "..", "..", "uploads", "qrcodes");

if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

// Background color per "Registering As" type, so QR codes are visually
// distinguishable at a glance (e.g. at the venue's check-in desk).
const QR_BACKGROUND_BY_TYPE = {
  Attendee: "#60A5FAff", // blue
  Exhibitor: "#FB923Cff", // orange
  Dana: "#FDE047ff", // yellow
};
const QR_DEFAULT_BACKGROUND = "#FFFFFFff";
const QR_DARK_COLOR = "#000000ff";

function qrColorFor(registrationType) {
  return {
    dark: QR_DARK_COLOR,
    light: QR_BACKGROUND_BY_TYPE[registrationType] || QR_DEFAULT_BACKGROUND,
  };
}

/** Generates a random, unguessable token to encode in the QR code. */
function generateQrToken() {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * The public URL encoded in the QR image itself. Scanning with the admin
 * scanner still just needs the raw token (extracted from this URL), but
 * scanning with a generic camera / Google Lens opens this link and shows
 * the registrant's details on a normal webpage instead of a meaningless
 * hex string.
 */
function buildVerifyUrl(qrToken) {
  const base = (process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0];
  return `${base.replace(/\/$/, "")}/verify/${qrToken}`;
}

/** Generates a human-friendly unique registration ID, e.g. DANA-2026-000123 */
function generateRegistrationCode(id) {
  const year = new Date().getFullYear();
  return `DANA-${year}-${String(id).padStart(6, "0")}`;
}

/**
 * Generates a QR code PNG encoding the qrToken, saves it to disk (so it can be
 * emailed as an attachment / served over HTTP), and returns the relative path
 * plus the absolute path on disk.
 */
async function generateQrImage(qrToken, registrationType) {
  const fileName = `qr_${qrToken}.png`;
  const filePath = path.join(QR_DIR, fileName);

  await QRCode.toFile(filePath, buildVerifyUrl(qrToken), {
    errorCorrectionLevel: "M",
    width: 400,
    margin: 2,
    color: qrColorFor(registrationType),
  });

  return {
    relativePath: `uploads/qrcodes/${fileName}`,
    absolutePath: filePath,
  };
}

/**
 * Generates the same QR code as a base64 data URL so the frontend can render
 * and let the user download it immediately, without a follow-up request.
 */
async function generateQrDataUrl(qrToken, registrationType) {
  return QRCode.toDataURL(buildVerifyUrl(qrToken), {
    errorCorrectionLevel: "M",
    width: 400,
    margin: 2,
    color: qrColorFor(registrationType),
  });
}

module.exports = {
  generateQrToken,
  generateRegistrationCode,
  generateQrImage,
  generateQrDataUrl,
  buildVerifyUrl,
};
