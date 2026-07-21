const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

function sanitize(registration) {
  return {
    registrationId: registration.registration_id,
    fullName: registration.full_name,
    email: registration.email,
    mobile: registration.mobile,
    company: registration.company,
    registrationType: registration.registration_type,
    vendorName: registration.vendor_name,
  };
}

async function checkIn(req, res) {
  const qrToken = req.body.qrToken || req.body.qr_token;
  const scannedBy = req.admin?.email || req.body.scannedBy || req.body.scanned_by || "Venue Desk";

  if (!qrToken) {
    return res.status(400).json({ success: false, message: "QR token is required." });
  }

  try {
    const registration = await Registration.findOne({ qr_token: qrToken });

    if (!registration) {
      await Attendance.create({ registration_id: null, scanned_by: scannedBy, scan_result: "invalid" });
      return res.status(404).json({
        success: false,
        message: "Invalid QR code. No matching registration found.",
      });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({ success: false, message: "This registration has been cancelled." });
    }

    if (registration.is_checked_in) {
      await Attendance.create({
        registration_id: registration._id,
        scanned_by: scannedBy,
        scan_result: "duplicate",
      });
      return res.status(409).json({
        success: false,
        alreadyCheckedIn: true,
        message: `${registration.full_name} was already checked in at ${new Date(registration.checked_in_at).toLocaleTimeString("en-IN")}.`,
        data: {
          registration: sanitize(registration),
          checkedInAt: registration.checked_in_at,
        },
      });
    }

    registration.is_checked_in = true;
    registration.checked_in_at = new Date();
    registration.checked_in_by = scannedBy;
    await registration.save();

    await Attendance.create({
      registration_id: registration._id,
      scanned_by: scannedBy,
      scan_result: "success",
    });

    return res.status(200).json({
      success: true,
      message: `${registration.full_name} checked in successfully.`,
      data: {
        registration: sanitize(registration),
        checkedInAt: registration.checked_in_at,
      },
    });
  } catch (err) {
    console.error("Check-in error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

async function getAttendanceLog(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = parseInt(limit, 10) || 20;
  const offset = (pageNum - 1) * limitNum;

  try {
    const [rows, total] = await Promise.all([
      Attendance.find()
        .sort({ scanned_at: -1 })
        .skip(offset)
        .limit(limitNum)
        .populate("registration_id", "registration_id full_name company registration_type")
        .lean(),
      Attendance.countDocuments(),
    ]);

    const data = rows.map((a) => ({
      id: a._id,
      registration_id: a.registration_id?._id ?? null,
      scanned_by: a.scanned_by,
      scan_result: a.scan_result,
      scanned_at: a.scanned_at,
      reg_code: a.registration_id?.registration_id ?? null,
      full_name: a.registration_id?.full_name ?? null,
      company: a.registration_id?.company ?? null,
      registration_type: a.registration_id?.registration_type ?? null,
    }));

    return res.json({
      success: true,
      data,
      pagination: { total, page: pageNum, limit: limitNum },
    });
  } catch (err) {
    console.error("Attendance log error:", err);
    return res.status(500).json({ success: false, message: "Could not load attendance log." });
  }
}

module.exports = { checkIn, getAttendanceLog };
