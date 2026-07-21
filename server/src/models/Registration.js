const { mongoose } = require("../config/db");

const registrationSchema = new mongoose.Schema(
  {
    registration_id: { type: String, required: true, unique: true, maxlength: 80 },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },

    full_name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 150 },
    mobile: { type: String, required: true, unique: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 150 },
    registration_type: {
      type: String,
      required: true,
      enum: ["Attendee", "Exhibitor", "Dana", "Others"],
    },
    vendor_name: { type: String, trim: true, maxlength: 150, default: null },
    interested_areas: { type: [String], default: [] },

    qr_token: { type: String, required: true, unique: true, maxlength: 64 },
    qr_image_path: { type: String, maxlength: 255, default: null },

    whatsapp_sent: { type: Boolean, default: false },
    whatsapp_sent_at: { type: Date, default: null },
    email_sent: { type: Boolean, default: false },
    email_sent_at: { type: Date, default: null },

    is_checked_in: { type: Boolean, default: false },
    checked_in_at: { type: Date, default: null },
    checked_in_by: { type: String, maxlength: 150, default: null },

    status: { type: String, required: true, default: "registered", enum: ["registered", "cancelled"] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

registrationSchema.index({ registration_type: 1 });
registrationSchema.index({ created_at: 1 });

module.exports = mongoose.model("Registration", registrationSchema);
