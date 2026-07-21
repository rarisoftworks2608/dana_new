const { mongoose } = require("../config/db");

const notificationSchema = new mongoose.Schema({
  registration_id: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
  channel: { type: String, required: true, enum: ["whatsapp", "email"] },
  status: { type: String, required: true, enum: ["sent", "failed", "sandboxed"] },
  error_message: { type: String, default: null },
  sent_at: { type: Date, default: Date.now },
});

notificationSchema.index({ registration_id: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
