import React, { useEffect, useState } from 'react';

const defaultPeriods = 8;

const TimeTablePage = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [newDay, setNewDay] = useState('');
  const [newPeriods, setNewPeriods] = useState(Array(defaultPeriods).fill(''));
  const [message, setMessage] = useState('');

  // Fetch timetable data from backend
  useEffect(() => {
    fetch('http://localhost:5174/api/TimeTableapi')
      .then(res => res.json())
      .then(data => setTimetableData(data))
      .catch(() => setTimetableData([]));
  }, []);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: '20px',
    fontSize: '18px',
  };

  const thTdStyle = {
    border: '2px solid #ccc',
    padding: '12px',
    textAlign: 'center',
  };

  const headerStyle = {
    ...thTdStyle,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  };

  // Add a new day to the timetable
  const handleAddDay = async () => {
    if (!newDay.trim() || newPeriods.some(p => !p.trim())) {
      setMessage('Please fill all fields for the new day.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5174/api/TimeTableapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: newDay, periods: newPeriods }),
      });
      const data = await res.json();
      if (res.ok) {
        setTimetableData(prev => [...prev, data]);
        setNewDay('');
        setNewPeriods(Array(defaultPeriods).fill(''));
        setMessage('Day added successfully.');
      } else {
        setMessage(data.message || 'Failed to add day.');
      }
    } catch {
      setMessage('Server error. Please try again.');
    }
  };

  // Edit a period in a day
  const handleEdit = async (rowIdx, periodIdx, value) => {
    const day = timetableData[rowIdx].day;
    const res = await fetch('http://localhost:5174/api/TimeTableapi/period', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, periodIdx, value }),
    });
    if (res.ok) {
      setTimetableData(prev =>
        prev.map((row, i) =>
          i === rowIdx
            ? { ...row, periods: row.periods.map((p, j) => (j === periodIdx ? value : p)) }
            : row
        )
      );
      setMessage('Period updated.');
    } else {
      setMessage('Failed to update period.');
    }
  };

  // Delete a day's row
  const handleDeleteRow = async (rowIdx) => {
    const day = timetableData[rowIdx].day;
    const res = await fetch(`http://localhost:5174/api/TimeTableapi/day/${day}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTimetableData(prev => prev.filter((_, i) => i !== rowIdx));
      setMessage('Day deleted.');
    } else {
      setMessage('Failed to delete day.');
    }
  };

  // Delete a period (column) from all days
  const handleDeletePeriod = async (periodIdx) => {
    const res = await fetch('http://localhost:5174/api/TimeTableapi/delete-period', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periodIdx }),
    });
    if (res.ok) {
      setTimetableData(prev =>
        prev.map(row => ({
          ...row,
          periods: row.periods.filter((_, i) => i !== periodIdx)
        }))
      );
      setMessage('Period deleted from all days.');
    } else {
      setMessage('Failed to delete period.');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Class Timetable</h1>
      <div style={{ marginBottom: '32px', border: '1px solid #eee', borderRadius: 8, padding: 24 }}>
        <h2 style={{ fontSize: '22px', marginBottom: 12 }}>Add New Day</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Day (e.g. Monday)"
            value={newDay}
            onChange={e => setNewDay(e.target.value)}
            style={{ padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
          />
          {newPeriods.map((period, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Period ${idx + 1}`}
              value={period}
              onChange={e => {
                const updated = [...newPeriods];
                updated[idx] = e.target.value;
                setNewPeriods(updated);
              }}
              style={{ padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }}
            />
          ))}
          <button
            onClick={handleAddDay}
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 18px',
              fontSize: 16,
              cursor: 'pointer',
              marginLeft: 8
            }}
          >
            Add Day
          </button>
        </div>
      </div>
      {message && <div style={{ color: '#007bff', marginBottom: 16 }}>{message}</div>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Day</th>
            {[...Array(timetableData[0]?.periods.length || defaultPeriods)].map((_, i) => (
              <th key={i} style={headerStyle}>
                Period {i + 1}
                <button
                  style={{
                    marginLeft: 8,
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    padding: '2px 6px',
                  }}
                  onClick={() => handleDeletePeriod(i)}
                  title="Delete this period"
                >
                  ×
                </button>
              </th>
            ))}
            <th style={headerStyle}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {timetableData.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td style={thTdStyle}>{row.day}</td>
              {row.periods.map((className, periodIdx) => (
                <td key={periodIdx} style={thTdStyle}>
                  <input
                    type="text"
                    value={className}
                    style={{
                      width: '90%',
                      padding: '4px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                    onChange={e => handleEdit(rowIdx, periodIdx, e.target.value)}
                  />
                </td>
              ))}
              <td style={thTdStyle}>
                <button
                  style={{
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    padding: '6px 12px',
                  }}
                  onClick={() => handleDeleteRow(rowIdx)}
                  title="Delete this day"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTablePage;