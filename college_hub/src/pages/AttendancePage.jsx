import React, { useState, useEffect } from "react";
import { getAttendance, markAttendance } from "../api/Attendanceapi";
import "../styles/Attendance.css";

function AttendancePage({ userId }) {
  const [paper, setPaper] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalHours, setTotalHours] = useState("");

  useEffect(() => {
    if (paper && userId) {
      getAttendance({ paper, studentId: userId })
        .then((res) => setAttendanceRecords(res.data))
        .catch(() => setAttendanceRecords([]));
    } else {
      setAttendanceRecords([]);
      setTotalHours("");
    }
  }, [paper, userId]);

  const presentHours = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentHours = attendanceRecords.filter((r) => r.status === "Absent").length;
  const minRequired = totalHours ? Math.ceil(0.75 * Number(totalHours)) : 0;
  const canLeave =
    totalHours
      ? Number(totalHours) - minRequired - absentHours
      : 0;

  const handleSubmit = async () => {
    if (!paper || !date || !hour || !status) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await markAttendance({ studentId: userId, paper, date, hour, status });
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setMessage(data.message || "Attendance marked successfully.");
        getAttendance({ paper, studentId: userId })
          .then((res) => setAttendanceRecords(res.data))
          .catch(() => setAttendanceRecords([]));
      } else {
        setMessage(data.message || "Failed to mark attendance.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="attendance-container" style={{ display: "flex", gap: 32 }}>
      <div style={{ flex: 1 }}>
        <h1 className="attendance-heading">Mark Your Attendance</h1>
        <div className="form-row">
          <div className="form-group">
            <label>Paper</label>
            <input
              type="text"
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              placeholder="Enter paper name"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Hour</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="Enter hour"
            />
          </div>
          <div className="form-group">
            <label>Attendance Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">---</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Total Hours for {paper || "Paper"}</label>
            <input
              type="number"
              min="0"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="Enter total hours"
            />
          </div>
          <div className="form-group button-group">
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {message && <p className="confirmation-message">{message}</p>}
        </div>
      </div>
      {paper && (
        <div style={{ flex: 1, marginTop: 24 }}>
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 24,
              background: "#fafbfc",
              minWidth: 260,
              maxWidth: 340,
            }}
            className="attendance-summary"
          >
            <h3>Attendance Summary for {paper}</h3>
            <p>Total Hours: {totalHours || 0}</p>
            <p>Hours Marked Present: {presentHours}</p>
            <p>Minimum Required (75%): {minRequired}</p>
            <p>
              You can still take <b>{Math.max(0, canLeave)}</b> leave(s) to avoid shortage of attendance.
            </p>
            <div style={{ marginTop: 16 }}>
              <h4>Records:</h4>
              <ul>
                {attendanceRecords.map((rec, idx) => (
                  <li key={idx}>
                    {rec.date} | Hour {rec.hour} | {rec.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;