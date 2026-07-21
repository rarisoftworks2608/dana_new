const express = require("express");
const router = express.Router();
const {
  getStats,
  listRegistrations,
  updateRegistration,
  deleteRegistration,
} = require("../controllers/dashboardController");
const { requireAdminAuth } = require("../middleware/auth");

router.use(requireAdminAuth);

router.get("/stats", getStats);
router.get("/registrations", listRegistrations);
router.put("/registrations/:id", updateRegistration);
router.delete("/registrations/:id", deleteRegistration);

module.exports = router;
