const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const { nextSequence } = require("../models/Counter");
const { generateQrToken, generateRegistrationCode, generateQrImage, generateQrDataUrl } = require("../utils/qrService");
const { sendWhatsAppConfirmation } = require("../utils/whatsappService");
const { sendConfirmationEmail } = require("../utils/emailService");

const VALID_TYPES = ["Attendee", "Exhibitor", "Dana", "Others"];

async function getActiveEventId() {
  const event = await Event.findOne({ is_active: true }).sort({ _id: 1 });
  return event ? event.id : null;
}

async function logNotification(registrationId, channel, status, errorMessage = null) {
  await Notification.create({
    registration_id: registrationId,
    channel,
    status,
    error_message: errorMessage,
  });
}

/**
 * Fires WhatsApp + email off in the background, after the registration
 * response has already been sent to the client - actual SMTP/API round
 * trips here are seconds slower than a DB write and must never make the
 * registrant sit on "Submitting..." waiting for them.
 */
async function sendNotifications(registration, qrPublicUrl, absolutePath) {
  let whatsappResult = { ok: false, status: "failed" };
  try {
    whatsappResult = await sendWhatsAppConfirmation(registration, qrPublicUrl);
  } catch (err) {
    whatsappResult = { ok: false, status: "failed", error: err.message };
  }
  await Registration.updateOne(
    { _id: registration._id },
    { whatsapp_sent: whatsappResult.ok, whatsapp_sent_at: whatsappResult.ok ? new Date() : null }
  );
  await logNotification(registration.id, "whatsapp", whatsappResult.status, whatsappResult.error);

  let emailResult = { ok: false, status: "failed" };
  try {
    emailResult = await sendConfirmationEmail(registration, absolutePath, qrPublicUrl);
  } catch (err) {
    emailResult = { ok: false, status: "failed", error: err.message };
  }
  await Registration.updateOne(
    { _id: registration._id },
    { email_sent: emailResult.ok, email_sent_at: emailResult.ok ? new Date() : null }
  );
  await logNotification(registration.id, "email", emailResult.status, emailResult.error);
}

/**
 * POST /api/registrations
 * Accepts the exact payload shape produced by the landing page's
 * registration form (camelCase field names).
 */
async function createRegistration(req, res) {
  const {
    fullName,
    email,
    mobile,
    company,
    registrationType,
    vendorName,
    interestedAreas,
  } = req.body;

  // ---- Validation ----
  const errors = [];
  if (!fullName || !fullName.trim()) errors.push("Full name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
  if (!mobile || !/^\d{10}$/.test(String(mobile).replace(/\D/g, "").slice(-10)))
    errors.push("A valid 10-digit mobile number is required.");
  if (!company || !String(company).trim()) errors.push("Company name is required.");
  if (!registrationType || !VALID_TYPES.includes(registrationType))
    errors.push(`Registration type must be one of: ${VALID_TYPES.join(", ")}.`);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], details: errors });
  }

  const cleanMobile = String(mobile).replace(/\D/g, "").slice(-10);
  const normalizedEmail = email.toLowerCase().trim();
  const areas = Array.isArray(interestedAreas)
    ? interestedAreas
    : interestedAreas
    ? [interestedAreas]
    : [];

  try {
    const eventId = await getActiveEventId();

    // ---- Duplicate check ----
    const duplicate = await Registration.findOne({
      $or: [{ email: normalizedEmail }, { mobile: cleanMobile }],
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event with this email or mobile number.",
      });
    }

    // ---- Generate registration code + QR up front (ids don't need a round trip in Mongo) ----
    const qrToken = generateQrToken();
    const seq = await nextSequence("registration");
    const registrationId = generateRegistrationCode(seq);

    const { relativePath, absolutePath } = await generateQrImage(qrToken, registrationType);
    const qrDataUrl = await generateQrDataUrl(qrToken, registrationType);

    const registration = await Registration.create({
      event_id: eventId,
      registration_id: registrationId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      mobile: cleanMobile,
      company: company.trim(),
      registration_type: registrationType,
      vendor_name: vendorName || null,
      interested_areas: areas,
      qr_token: qrToken,
      qr_image_path: relativePath,
    });

    const qrPublicUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/${relativePath}`;

    // ---- Notifications (best-effort, run in the background - do not await) ----
    sendNotifications(registration, qrPublicUrl, absolutePath).catch((err) => {
      console.error("Background notification error:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        registrationId: registration.registration_id,
        fullName: registration.full_name,
        email: registration.email,
        registrationType: registration.registration_type,
        qrCodeImage: qrDataUrl,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A registration already exists with this email or mobile number.",
      });
    }
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

/**
 * GET /api/registrations/check?email=&mobile=
 * Used by the frontend for optional client-side duplicate warnings.
 */
async function checkDuplicate(req, res) {
  const { email, mobile } = req.query;
  if (!email && !mobile) {
    return res.status(400).json({ success: false, message: "Provide email or mobile to check." });
  }

  try {
    const cleanMobile = mobile ? String(mobile).replace(/\D/g, "").slice(-10) : "";
    const normalizedEmail = (email || "").toLowerCase().trim();
    const exists = await Registration.exists({
      $or: [{ email: normalizedEmail }, { mobile: cleanMobile }],
    });
    return res.json({ success: true, data: { exists: !!exists } });
  } catch (err) {
    console.error("Check duplicate error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

/**
 * GET /api/registrations/verify/:token
 * Public, unauthenticated lookup by QR token — this is what opens when
 * someone scans a registrant's QR code with a generic camera / Google Lens
 * (rather than the admin check-in scanner). Only returns non-sensitive
 * fields; email/mobile are deliberately left out since this is reachable by
 * anyone who can see the QR code.
 */
async function verifyByToken(req, res) {
  const { token } = req.params;

  try {
    const registration = await Registration.findOne({ qr_token: token });
    if (!registration) {
      return res.status(404).json({ success: false, message: "No registration found for this QR code." });
    }

    return res.json({
      success: true,
      data: {
        fullName: registration.full_name,
        registrationId: registration.registration_id,
        registrationType: registration.registration_type,
        company: registration.company,
        status: registration.status,
        isCheckedIn: registration.is_checked_in,
        checkedInAt: registration.checked_in_at,
      },
    });
  } catch (err) {
    console.error("Verify token error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

module.exports = { createRegistration, checkDuplicate, verifyByToken };
