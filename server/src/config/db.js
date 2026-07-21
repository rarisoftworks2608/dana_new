const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection.on("error", (err) => {
  console.error("Unexpected MongoDB connection error:", err);
});

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dana_event";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name);
}

module.exports = { connectDB, mongoose };
