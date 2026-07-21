const express = require("express");
const router = express.Router();
const { createRegistration, checkDuplicate, verifyByToken } = require("../controllers/registrationController");

router.post("/", createRegistration);
router.get("/check", checkDuplicate);
router.get("/verify/:token", verifyByToken);

module.exports = router;
