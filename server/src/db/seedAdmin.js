const bcrypt = require("bcryptjs");
const { connectDB, mongoose } = require("../config/db");
const Admin = require("../models/Admin");
require("dotenv").config();

async function seedAdmin() {
  await connectDB();

  const email = (process.env.DEFAULT_ADMIN_EMAIL || "admin@danaevent.com").toLowerCase().trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "ChangeMe123";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({
    full_name: "Event Administrator",
    email,
    password_hash: passwordHash,
    role: "superadmin",
  });

  console.log(`Admin created: ${email} / ${password}`);
  console.log("  (change this password after first login in production)");
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("Seeding admin failed:", err);
  process.exit(1);
});
