const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function shapeAdmin(admin) {
  return {
    id: admin.id,
    name: admin.full_name,
    full_name: admin.full_name,
    email: admin.email,
    role: admin.role,
  };
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
    );

    return res.json({
      success: true,
      token,
      admin: shapeAdmin(admin),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

async function me(req, res) {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }
    return res.json({ success: true, admin: shapeAdmin(admin) });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

module.exports = { login, me };
