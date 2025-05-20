const express = require("express");
const router = express.Router();
const TimetableController = require("../controllers/TimeTableController.cjs");

router.get("/", TimetableController.getTimetable);
router.post("/", TimetableController.addDay);
router.put("/period", TimetableController.updatePeriod);
router.delete("/:studentId/:day", TimetableController.deleteDay);

module.exports = router;