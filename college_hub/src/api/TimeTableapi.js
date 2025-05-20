import axios from "axios";

export const getTimetable = (studentId) =>
  axios.get("/api/timetable", { params: { studentId } });

export const addDay = (data) =>
  axios.post("/api/timetable", data);

export const updatePeriod = (data) =>
  axios.put("/api/timetable/period", data);

export const deleteDay = (studentId, day) =>
  axios.delete(`/api/timetable/${studentId}/${day}`);