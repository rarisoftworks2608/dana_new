const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));

 app.use(
        cors({
            origin: [
              process.env.FRONTEND_URL,
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        })
    );
// app.use(
//   cors({
//     origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(","),
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve generated QR code images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Dana Event backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
