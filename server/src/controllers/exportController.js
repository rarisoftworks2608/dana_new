const ExcelJS = require("exceljs");
const Registration = require("../models/Registration");

const COLUMNS = [
  { header: "Registration ID", key: "registration_id", width: 22 },
  { header: "Full Name", key: "full_name", width: 24 },
  { header: "Email", key: "email", width: 28 },
  { header: "Mobile", key: "mobile", width: 15 },
  { header: "Company", key: "company", width: 24 },
  { header: "Registration Type", key: "registration_type", width: 18 },
  { header: "Vendor Name", key: "vendor_name", width: 20 },
  { header: "Interested Areas", key: "interested_areas", width: 30 },
  { header: "Status", key: "status", width: 14 },
  { header: "Checked In", key: "is_checked_in", width: 12 },
  { header: "Checked In At", key: "checked_in_at", width: 22 },
  { header: "Registered At", key: "created_at", width: 22 },
];

async function fetchAllRegistrations() {
  const rows = await Registration.find().sort({ created_at: -1 }).lean();
  return rows.map((r) => ({
    ...r,
    interested_areas: Array.isArray(r.interested_areas) ? r.interested_areas.join(", ") : "",
    created_at: r.created_at ? new Date(r.created_at).toLocaleString("en-IN") : "",
    checked_in_at: r.checked_in_at ? new Date(r.checked_in_at).toLocaleString("en-IN") : "Not Checked In",
  }));
}

async function exportCsv(req, res) {
  try {
    const registrations = await fetchAllRegistrations();

    const header = COLUMNS.map((c) => c.header).join(",");
    const rows = registrations.map((r) =>
      COLUMNS.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=dana-registrations.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ success: false, message: "Could not export CSV." });
  }
}

async function exportExcel(req, res) {
  try {
    const registrations = await fetchAllRegistrations();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Registrations");
    sheet.columns = COLUMNS;
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003B8E" } };
    registrations.forEach((r) => sheet.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=dana-registrations.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ success: false, message: "Could not export Excel file." });
  }
}

module.exports = { exportCsv, exportExcel };
