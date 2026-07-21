const { mongoose } = require("../config/db");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    event_date: { type: Date, required: true },
    venue: { type: String, trim: true, maxlength: 255 },
    description: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Event", eventSchema);
