const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");

const TYPES = ["Attendee", "Exhibitor", "Dana", "Others"];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getStats(req, res) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const totalQ = Registration.countDocuments();
    const byTypeQ = Registration.aggregate([
      { $group: { _id: "$registration_type", count: { $sum: 1 } } },
    ]);
    const todayQ = Registration.countDocuments({ created_at: { $gte: startOfToday, $lt: startOfTomorrow } });
    const checkedInQ = Registration.countDocuments({ is_checked_in: true });
    const dailyTrendQ = Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const [totalCount, byType, todayCount, checkedInCount, dailyTrend] = await Promise.all([
      totalQ, byTypeQ, todayQ, checkedInQ, dailyTrendQ,
    ]);

    const byTypeMap = {};
    TYPES.forEach((t) => { byTypeMap[t] = 0; });
    byType.forEach((row) => {
      byTypeMap[row._id] = row.count;
    });

    return res.json({
      success: true,
      data: {
        total: totalCount,
        today: todayCount,
        checkedIn: checkedInCount,
        pending: totalCount - checkedInCount,
        byType: byTypeMap,
        dailyTrend: dailyTrend.map((r) => ({ date: r._id, count: r.count })),
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ success: false, message: "Could not load dashboard stats." });
  }
}

async function listRegistrations(req, res) {
  const { search, type, checkedIn, page = 1, limit = 20 } = req.query;

  const filter = {};

  if (search) {
    const re = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { full_name: re },
      { email: re },
      { mobile: re },
      { company: re },
      { registration_id: re },
    ];
  }
  if (type) {
    filter.registration_type = type;
  }
  if (checkedIn === "true") {
    filter.is_checked_in = true;
  } else if (checkedIn === "false") {
    filter.is_checked_in = false;
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = parseInt(limit, 10) || 20;
  const offset = (pageNum - 1) * limitNum;

  try {
    const [rows, total] = await Promise.all([
      Registration.find(filter).sort({ created_at: -1 }).skip(offset).limit(limitNum),
      Registration.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: rows,
      pagination: { total, page: pageNum, limit: limitNum },
    });
  } catch (err) {
    console.error("List registrations error:", err);
    return res.status(500).json({ success: false, message: "Could not load registrations." });
  }
}

async function updateRegistration(req, res) {
  const { id } = req.params;
  const allowedFields = [
    "full_name", "email", "mobile", "company",
    "registration_type", "vendor_name", "status",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: "No valid fields to update." });
  }

  try {
    const registration = await Registration.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }
    return res.json({ success: true, message: "Registration updated", data: registration });
  } catch (err) {
    console.error("Update registration error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Email or mobile already used by another registration." });
    }
    return res.status(500).json({ success: false, message: "Could not update registration." });
  }
}

async function deleteRegistration(req, res) {
  const { id } = req.params;
  try {
    const registration = await Registration.findByIdAndDelete(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }
    await Promise.all([
      Attendance.deleteMany({ registration_id: id }),
      Notification.deleteMany({ registration_id: id }),
    ]);
    return res.json({ success: true, message: "Registration deleted" });
  } catch (err) {
    console.error("Delete registration error:", err);
    return res.status(500).json({ success: false, message: "Could not delete registration." });
  }
}

module.exports = { getStats, listRegistrations, updateRegistration, deleteRegistration };
