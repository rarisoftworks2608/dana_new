// ============================================================
// Dana Supplier Technology Day 2026 - MongoDB import/init script
// ============================================================
// The Mongo equivalent of a .sql schema+seed file: creates the indexes
// that back the app's unique constraints, then seeds a default event and
// a default admin login if the database is empty. Safe to re-run - it
// skips seeding anything that already exists.
//
// Run with mongosh (bundled with MongoDB Compass, or install separately):
//
//   mongosh "<your-atlas-connection-string>" server/src/db/init.mongo.js
//
// The connection string must include the database name, e.g.:
//   mongodb+srv://user:pass@cluster.mongodb.net/dana_event
//
// This only needs to be run once per database (e.g. once against your
// Atlas cluster before first deploy). `npm run migrate` / `npm run
// seed:admin` do the same job from Node and are the normal day-to-day way
// to do this - this file is for handing off a single importable script.

print("Creating indexes...");

db.admins.createIndex({ email: 1 }, { unique: true });

db.registrations.createIndex({ registration_id: 1 }, { unique: true });
db.registrations.createIndex({ email: 1 }, { unique: true });
db.registrations.createIndex({ mobile: 1 }, { unique: true });
db.registrations.createIndex({ qr_token: 1 }, { unique: true });
db.registrations.createIndex({ registration_type: 1 });
db.registrations.createIndex({ created_at: 1 });

db.attendances.createIndex({ registration_id: 1 });
db.notifications.createIndex({ registration_id: 1 });

print("Indexes created.");

// ---- Default event ----
if (db.events.countDocuments() === 0) {
  db.events.insertOne({
    name: "Dana Supplier Technology Day 2026",
    event_date: new Date("2026-07-28T09:00:00"),
    venue: "Chakan Office Premises",
    description:
      "Dana's platform to collaborate with our supplier ecosystem, share our vision for the future, and co-create innovative solutions that drive sustainable growth.",
    is_active: true,
    created_at: new Date(),
  });
  print("Default event seeded.");
} else {
  print("Event already exists, skipping seed.");
}

// ---- Default admin ----
// password_hash below is bcrypt("ChangeThisPassword123", 10).
// Log in with admin@danaevent.com / ChangeThisPassword123, then change
// the password immediately - this hash is public (it's in this file).
if (db.admins.countDocuments() === 0) {
  db.admins.insertOne({
    full_name: "Event Administrator",
    email: "admin@danaevent.com",
    password_hash: "$2a$10$ldCY89Tj88tVOz5w4f631ugMPigyKLPhqJTszTZ/6NuovBThCh3f.",
    role: "superadmin",
    created_at: new Date(),
  });
  print("Default admin seeded: admin@danaevent.com / ChangeThisPassword123");
} else {
  print("Admin already exists, skipping seed.");
}

print("Done.");
