const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/authController");
const { requireAdminAuth } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", requireAdminAuth, me);

module.exports = router;
