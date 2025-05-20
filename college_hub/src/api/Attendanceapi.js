import axios from "axios";

// Get attendance records for a student and paper
export const getAttendance = ({ paper, studentId }) =>
  axios.get("/api/attendance", { params: { paper, studentId } });

// Mark or update attendance for a student
export const markAttendance = (data) =>
  axios.post("/api/attendance", data);