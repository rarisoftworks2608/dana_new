const express = require("express");
const router = express.Router();
const { checkIn, getAttendanceLog } = require("../controllers/attendanceController");
const { requireAdminAuth } = require("../middleware/auth");

router.use(requireAdminAuth);

router.post("/checkin", checkIn);
router.get("/", getAttendanceLog);

module.exports = router;
