const { mongoose } = require("../config/db");

const attendanceSchema = new mongoose.Schema({
  registration_id: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", default: null },
  scanned_by: { type: String, maxlength: 150 },
  scan_result: { type: String, required: true, enum: ["success", "duplicate", "invalid"] },
  scanned_at: { type: Date, default: Date.now },
});

attendanceSchema.index({ registration_id: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
