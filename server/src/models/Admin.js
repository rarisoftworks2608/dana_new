const { mongoose } = require("../config/db");

const adminSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 150 },
    password_hash: { type: String, required: true },
    role: { type: String, default: "admin", maxlength: 30 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Admin", adminSchema);
