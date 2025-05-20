import React, { useState, useEffect } from 'react';
import '../styles/Attendance.css';

function AttendancePage() {
  const [paper, setPaper] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  const paperHours = {
    Maths: 60,
    Physics: 55,
    Chemistry: 50,
  };

  const papers = Object.keys(paperHours);
  const hours = ['1', '2', '3', '4', '5'];

  useEffect(() => {
    if (paper) {
      fetch(`http://localhost:5000/api/attendance?paper=${paper}`)
        .then(res => res.json())
        .then(data => setAttendanceRecords(data))
        .catch(() => setAttendanceRecords([]));
      setTotalHours(paperHours[paper]);
    } else {
      setAttendanceRecords([]);
      setTotalHours(0);
    }
  }, [paper]);

  const presentHours = attendanceRecords.filter(r => r.status === 'Present').length;
  const minRequired = Math.ceil(0.75 * totalHours);
  const canLeave = totalHours - minRequired - (attendanceRecords.filter(r => r.status === 'Absent').length);

  const handleSubmit = async () => {
    if (!paper || !date || !hour || !status) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper, date, hour, status }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Attendance marked successfully.');
        fetch(`http://localhost:5000/api/attendance?paper=${paper}`)
          .then(res => res.json())
          .then(data => setAttendanceRecords(data))
          .catch(() => setAttendanceRecords([]));
      } else {
        setMessage(data.message || 'Failed to mark attendance.');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="attendance-container" style={{ display: 'flex', gap: 32 }}>
      <div style={{ flex: 1 }}>
        <h1 className="attendance-heading">Mark Your Attendance</h1>
        <div className="form-row">
          <div className="form-group">
            <label>Select Paper</label>
            <select value={paper} onChange={(e) => setPaper(e.target.value)}>
              <option value="">---</option>
              {papers.map((p, index) => (
                <option key={index} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Select Hour</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)}>
              <option value="">---</option>
              {hours.map((h, index) => (
                <option key={index} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Attendance Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">---</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="form-group button-group">
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {message && <p className="confirmation-message">{message}</p>}
        </div>
      </div>
      {paper && (
        <div style={{ flex: 1, marginTop: 24 }}>
          <div style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 24,
            background: '#fafbfc',
            minWidth: 260,
            maxWidth: 340
          }}>
            <h3>Attendance Summary for {paper}</h3>
            <p>Total Hours: {totalHours}</p>
            <p>Hours Marked Present: {presentHours}</p>
            <p>Minimum Required (75%): {minRequired}</p>
            <p>
              You can still take <b>{Math.max(0, canLeave)}</b> leave(s) to avoid shortage of attendance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;