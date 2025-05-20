const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/AttendanceController.cjs");

router.get("/", AttendanceController.getAttendance);
router.post("/", AttendanceController.markAttendance);

module.exports = router;