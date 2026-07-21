const { connectDB, mongoose } = require("../config/db");
const Event = require("../models/Event");
require("../models/Admin");
require("../models/Registration");
require("../models/Attendance");
require("../models/Notification");

async function migrate() {
  await connectDB();

  console.log("Syncing indexes...");
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.syncIndexes())
  );
  console.log("Indexes synced.");

  const existing = await Event.countDocuments();
  if (existing === 0) {
    await Event.create({
      name: "Dana Supplier Technology Day 2026",
      event_date: new Date("2026-07-28T09:00:00"),
      venue: "Chakan Office Premises",
      description:
        "Dana's platform to collaborate with our supplier ecosystem, share our vision for the future, and co-create innovative solutions that drive sustainable growth.",
    });
    console.log("Default event seeded.");
  } else {
    console.log("Event already exists, skipping seed.");
  }

  await mongoose.disconnect();
  console.log("Migration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
