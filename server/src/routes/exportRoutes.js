const express = require("express");
const router = express.Router();
const { exportCsv, exportExcel } = require("../controllers/exportController");
const { requireAdminAuth } = require("../middleware/auth");

router.get("/csv", requireAdminAuth, exportCsv);
router.get("/excel", requireAdminAuth, exportExcel);

module.exports = router;
